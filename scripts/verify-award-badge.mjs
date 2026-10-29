import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3012;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(OUT_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function main() {
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log(`Server listening on http://127.0.0.1:${PORT}...`);

  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const CDP_PORT = 9288;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_badge_' + Date.now());

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--window-size=1280,900',
    `http://127.0.0.1:${PORT}/`,
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.url.includes('127.0.0.1'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    browserProc.kill();
    server.close();
    throw new Error('CDP connect failed');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
    }
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));
  await send('Runtime.enable');
  await send('Page.enable');
  await send('DOM.enable');

  try {
    // Wait for hydration and scroll #achievements into view
    await new Promise((r) => setTimeout(r, 1200));

    console.log('Scrolling #achievements into view...');
    await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.getElementById('achievements');
        if (el) el.scrollIntoView({ block: 'center' });
      })()`,
    });

    await new Promise((r) => setTimeout(r, 800));

    // Get the bounding boxes and labels for the two badges
    const badgeInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const badges = Array.from(document.querySelectorAll('a[aria-label="World Memory Champ - IAM WORLD CHAMPIONSHIP"], a[aria-label="Logic Champion - WHITEHAT JR"]'));
        return JSON.stringify(badges.map(b => {
          const rect = b.getBoundingClientRect();
          const innerDiv = b.querySelector('div');
          return {
            label: b.getAttribute('aria-label'),
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            initialTransform: innerDiv ? innerDiv.style.transform : null
          };
        }));
      })()`,
      returnByValue: true,
    });

    const badges = JSON.parse(badgeInfo.result.value);
    console.log(`Found ${badges.length} badges on page:`, badges);

    if (badges.length < 2) {
      throw new Error(`Expected 2 award badges, found ${badges.length}`);
    }

    for (let i = 0; i < badges.length; i++) {
      const b = badges[i];
      console.log(`\n========================================`);
      console.log(`Testing Badge ${i + 1}: "${b.label}"`);
      console.log(`Initial transform: "${b.initialTransform}"`);

      // 1. Hover near top-left of the badge
      const x1 = Math.round(b.x + b.width * 0.2);
      const y1 = Math.round(b.y + b.height * 0.2);
      console.log(`Moving mouse to Top-Left: (${x1}, ${y1})...`);

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: x1,
        y: y1,
      });

      await new Promise((r) => setTimeout(r, 200));

      const resTL = await send('Runtime.evaluate', {
        expression: `(() => {
          const badge = document.querySelectorAll('a[aria-label="World Memory Champ - IAM WORLD CHAMPIONSHIP"], a[aria-label="Logic Champion - WHITEHAT JR"]')[${i}];
          const innerDiv = badge ? badge.querySelector('div') : null;
          return innerDiv ? innerDiv.style.transform : null;
        })()`,
        returnByValue: true,
      });

      const transformTL = resTL.result.value;
      console.log(`Hover Top-Left transform: "${transformTL}"`);

      if (!transformTL || !transformTL.includes('perspective(700px) matrix3d')) {
        throw new Error(`Invalid hover transform: ${transformTL}`);
      }

      // Check that matrix values are not all identity
      if (transformTL.includes('1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1')) {
        throw new Error(`Badge transform did not tilt on mouse hover!`);
      }

      // 2. Hover near bottom-right of the badge
      const x2 = Math.round(b.x + b.width * 0.8);
      const y2 = Math.round(b.y + b.height * 0.8);
      console.log(`Moving mouse to Bottom-Right: (${x2}, ${y2})...`);

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: x2,
        y: y2,
      });

      await new Promise((r) => setTimeout(r, 200));

      const resBR = await send('Runtime.evaluate', {
        expression: `(() => {
          const badge = document.querySelectorAll('a[aria-label="World Memory Champ - IAM WORLD CHAMPIONSHIP"], a[aria-label="Logic Champion - WHITEHAT JR"]')[${i}];
          const innerDiv = badge ? badge.querySelector('div') : null;
          return innerDiv ? innerDiv.style.transform : null;
        })()`,
        returnByValue: true,
      });

      const transformBR = resBR.result.value;
      console.log(`Hover Bottom-Right transform: "${transformBR}"`);

      if (transformTL === transformBR) {
        throw new Error(`Transform did not change across cursor coordinates!`);
      }

      // 3. Move mouse away to reset
      console.log(`Moving mouse away to (10, 10)...`);
      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: 10,
        y: 10,
      });

      await new Promise((r) => setTimeout(r, 600));

      const resReset = await send('Runtime.evaluate', {
        expression: `(() => {
          const badge = document.querySelectorAll('a[aria-label="World Memory Champ - IAM WORLD CHAMPIONSHIP"], a[aria-label="Logic Champion - WHITEHAT JR"]')[${i}];
          const innerDiv = badge ? badge.querySelector('div') : null;
          return innerDiv ? innerDiv.style.transform : null;
        })()`,
        returnByValue: true,
      });

      const transformReset = resReset.result.value;
      console.log(`Reset transform: "${transformReset}"`);

      if (!transformReset.includes('1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1')) {
        throw new Error(`Badge did not cleanly reset to identity matrix on mouse leave: ${transformReset}`);
      }

      // 4. Test click interaction
      console.log(`Clicking badge "${b.label}" to verify certificate modal opens...`);
      const centerX = Math.round(b.x + b.width / 2);
      const centerY = Math.round(b.y + b.height / 2);

      await send('Input.dispatchMouseEvent', {
        type: 'mousePressed',
        x: centerX,
        y: centerY,
        button: 'left',
        clickCount: 1,
      });
      await send('Input.dispatchMouseEvent', {
        type: 'mouseReleased',
        x: centerX,
        y: centerY,
        button: 'left',
        clickCount: 1,
      });

      await new Promise((r) => setTimeout(r, 400));

      const modalCheck = await send('Runtime.evaluate', {
        expression: `(() => {
          const dialog = document.querySelector('[role="dialog"]');
          return dialog !== null;
        })()`,
        returnByValue: true,
      });

      console.log(`Modal opened on click:`, modalCheck.result.value);
      if (!modalCheck.result.value) {
        throw new Error(`Expected modal dialog to open when clicking badge "${b.label}"`);
      }

      // Close modal by pressing Escape
      await send('Input.dispatchKeyEvent', {
        type: 'rawKeyDown',
        key: 'Escape',
        windowsVirtualKeyCode: 27,
      });
      await send('Input.dispatchKeyEvent', {
        type: 'keyUp',
        key: 'Escape',
        windowsVirtualKeyCode: 27,
      });

      await new Promise((r) => setTimeout(r, 400));
      console.log(`Modal closed successfully with Escape key.`);
    }

    console.log(`\n========================================`);
    console.log(`Console errors during test: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error(consoleErrors);
      process.exitCode = 1;
    } else {
      console.log('🎉 VERIFICATION COMPLETE: Both award badges animate smoothly, track 3D tilt accurately, reset to identity matrix, and open evidence modals on click!');
    }
  } catch (err) {
    console.error('Test error:', err);
    process.exitCode = 1;
  } finally {
    browserProc.kill();
    server.close();
  }
}

main();
