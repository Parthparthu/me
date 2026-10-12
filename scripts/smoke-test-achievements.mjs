import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3008;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
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
  console.log(`Server listening on port ${PORT}...`);

  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const CDP_PORT = 9280;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_achieve_' + Date.now());

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--window-size=1280,900',
    `http://localhost:${PORT}/`,
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.url.includes('localhost'));
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
  const netReqs = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Network.requestWillBeSent') {
      netReqs.push(msg.params.request.url);
    }
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
  await send('Network.enable');

  // Scroll into view so below-fold lazy images load
  console.log('Scrolling #achievements into view...');
  await send('Runtime.evaluate', {
    expression: `(async () => {
      const section = document.getElementById('achievements');
      if (!section) return;
      section.scrollIntoView();
      window.scrollBy(0, 100);
      
      const images = Array.from(section.querySelectorAll('img'));
      await Promise.all(images.map(img => {
        if (img.complete && img.naturalWidth > 0) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
          // If decoding supported
          if (img.decode) {
            img.decode().then(resolve).catch(resolve);
          }
          setTimeout(resolve, 2500);
        });
      }));
    })()`,
    awaitPromise: true,
  });

  await new Promise((r) => setTimeout(r, 1000));

  console.log('Testing Achievements & Lightbox in page...');
  const sectionCheck = await send('Runtime.evaluate', {
    expression: `(async () => {
      const section = document.getElementById('achievements');
      if (!section) return { error: '#achievements not found' };

      const certThumbnails = Array.from(section.querySelectorAll('img'));
      await Promise.all(certThumbnails.map(img => (img.decode ? img.decode().catch(() => {}) : Promise.resolve())));

      const thumbInfo = certThumbnails.map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        hasDimensions: img.naturalWidth > 0 && img.naturalHeight > 0
      }));

      // Check placeholder text
      const text = section.innerText.toLowerCase();
      const placeholders = ['lorem ipsum', 'placeholder', 'coming soon', 'tbd'];
      const foundPlaceholders = placeholders.filter(p => text.includes(p));

      return {
        thumbCount: certThumbnails.length,
        thumbInfo,
        allThumbsLoaded: thumbInfo.every(t => t.hasDimensions),
        foundPlaceholders,
        hasPlaceholders: foundPlaceholders.length > 0
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log('Section evaluation:', JSON.stringify(sectionCheck.result.value, null, 2));

  // Test lightbox open & keyboard escape & focus return
  console.log('Testing lightbox modal opening, Escape key, and focus return...');
  const lightboxTest = await send('Runtime.evaluate', {
    expression: `(async () => {
      const triggerBtn = document.querySelector('#achievements button[aria-label*="certificate"]');
      if (!triggerBtn) return { error: 'Certificate trigger button not found' };

      // Focus and click
      triggerBtn.focus();
      triggerBtn.click();

      // Wait for modal animation
      await new Promise(r => setTimeout(r, 400));

      const modal = document.querySelector('[role="dialog"]');
      const modalOpen = Boolean(modal);
      const modalHeading = modal?.querySelector('h4')?.innerText || '';

      // Dispatch Escape key to window
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      // Wait for exit animation
      await new Promise(r => setTimeout(r, 400));

      const modalAfterEscape = document.querySelector('[role="dialog"]');
      const activeElementAfterEscape = document.activeElement;
      const focusReturned = activeElementAfterEscape === triggerBtn;

      return {
        modalOpen,
        modalHeading,
        modalClosedAfterEscape: !modalAfterEscape,
        focusReturned
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log('Network requests sent:', netReqs.filter(u => u.includes('certificates')));
  console.log('Console errors:', consoleErrors);

  ws.close();
  browserProc.kill();
  server.close();

  const sVal = sectionCheck.result.value;
  const lVal = lightboxTest.result.value;

  if (
    sVal.thumbCount >= 7 &&
    sVal.allThumbsLoaded &&
    !sVal.hasPlaceholders &&
    lVal.modalOpen &&
    lVal.modalClosedAfterEscape &&
    lVal.focusReturned
  ) {
    console.log('\n>>> ACCEPTANCE CRITERIA FOR ACHIEVEMENTS PASSED: 7 verified certs, no placeholder data, lightbox Escape closes, focus returns to trigger, thumbnails preserved <<<');
    process.exit(0);
  } else {
    console.error('Criteria check failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
