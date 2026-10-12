import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3006;
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
  const CDP_PORT = 9265;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_focus_' + Date.now());

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

  // Wait for initial hydration
  await new Promise((r) => setTimeout(r, 3000));

  console.log('Testing focus cards in page...');
  const cardData = await send('Runtime.evaluate', {
    expression: `(() => {
      const aboutSection = document.getElementById('about');
      if (!aboutSection) return { error: '#about section not found' };

      const cards = Array.from(aboutSection.querySelectorAll('[role="region"][aria-label]'));
      const cardInfo = cards.map(c => {
        const title = c.querySelector('h3')?.innerText.trim() || '';
        const desc = c.querySelector('p')?.innerText.trim() || '';
        const tags = Array.from(c.querySelectorAll('span.font-mono')).map(s => s.innerText.trim());
        const rect = c.getBoundingClientRect();
        return {
          title,
          desc,
          tags,
          tabIndex: c.getAttribute('tabindex'),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          transform: c.style.transform
        };
      });

      // Check for banned buzzwords in copy
      const bannedBuzzwords = ['passionate', 'dream', 'cutting-edge', 'magic', 'turning ideas into reality', 'synergy', 'rockstar', 'ninja'];
      const foundBuzzwords = [];
      cards.forEach(c => {
        const text = c.innerText.toLowerCase();
        bannedBuzzwords.forEach(b => {
          if (text.includes(b)) foundBuzzwords.push(b);
        });
      });

      return {
        cardCount: cards.length,
        cardInfo,
        foundBuzzwords,
        hasBannedBuzzwords: foundBuzzwords.length > 0
      };
    })()`,
    returnByValue: true,
  });

  console.log('Focus cards data:', JSON.stringify(cardData.result.value, null, 2));

  // Test keyboard focus state on card 0
  console.log('Testing keyboard focus on card 0...');
  const focusTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('#about [role="region"][aria-label]'));
      if (cards.length === 0) return { error: 'No cards found' };
      cards[0].focus();
      const active = document.activeElement;
      return {
        focusedCardLabel: active ? active.getAttribute('aria-label') : null,
        isCard0: active === cards[0],
      };
    })()`,
    returnByValue: true,
  });
  console.log('Keyboard focus test:', JSON.stringify(focusTest.result.value, null, 2));

  // Test pointer tilt on card 0
  console.log('Testing pointer tilt on card 0...');
  const tiltTest = await send('Runtime.evaluate', {
    expression: `(async () => {
      const card = document.querySelector('#about [role="region"][aria-label]');
      if (!card) return { error: 'Card not found' };

      const rect = card.getBoundingClientRect();
      const enterEvt = new PointerEvent('pointerenter', { bubbles: true, clientX: rect.left + 10, clientY: rect.top + 10 });
      card.dispatchEvent(enterEvt);

      // Trigger move at bottom-right corner
      const moveEvt = new PointerEvent('pointermove', {
        bubbles: true,
        clientX: rect.left + rect.width * 0.9,
        clientY: rect.top + rect.height * 0.9
      });
      card.dispatchEvent(moveEvt);

      await new Promise(r => requestAnimationFrame(r));
      await new Promise(r => setTimeout(r, 50));

      const transformAfterMove = card.style.transform;

      // Leave
      card.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
      await new Promise(r => setTimeout(r, 50));
      const transformAfterLeave = card.style.transform;

      return {
        transformAfterMove,
        transformAfterLeave,
        tilted: transformAfterMove.includes('rotateX') && !transformAfterMove.includes('rotateX(0deg)')
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  console.log('Pointer tilt test:', JSON.stringify(tiltTest.result.value, null, 2));

  ws.close();
  browserProc.kill();
  server.close();

  const cVal = cardData.result.value;
  const fVal = focusTest.result.value;
  const tVal = tiltTest.result.value;

  if (
    cVal.cardCount >= 3 &&
    !cVal.hasBannedBuzzwords &&
    fVal.isCard0 &&
    tVal.tilted
  ) {
    console.log('\n>>> ACCEPTANCE CRITERIA FOR FOCUS CARDS PASSED: 4 verified cards, no buzzwords, keyboard focusable, pointer tilt working <<<');
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
