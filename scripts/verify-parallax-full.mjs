import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 3000;
const CDP_PORT = 9265;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
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
  console.log(`Server listening on http://localhost:${PORT}`);

  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_parallax_cards_' + Date.now());
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--window-size=1440,900',
    `http://localhost:${PORT}/?parallax-debug=true`,
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

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));
  await new Promise((r) => setTimeout(r, 3000));

  // Check HUD existence
  const hud = await send('Runtime.evaluate', {
    expression: `Boolean(document.querySelector('aside[aria-label="Parallax Debug HUD"]'))`,
    returnByValue: true,
  });
  console.log('Parallax Debug HUD present with ?parallax-debug=true:', hud.result.value);

  // Check SectionSpine existence
  const spine = await send('Runtime.evaluate', {
    expression: `Boolean(document.querySelector('.hidden.xl\\\\:flex.fixed'))`,
    returnByValue: true,
  });
  console.log('SectionSpine present in DOM:', spine.result.value);

  // Scroll to SelectedWork (around 1100px) and inspect card transforms
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 1100);' });
  await new Promise((r) => setTimeout(r, 800));

  const cardTransforms = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const section = document.getElementById('selected-work');
        if (!section) return { error: 'No selected-work section' };
        // Query child cards
        const parallaxWrappers = Array.from(section.querySelectorAll('.perspective-1000')).map(p => p.parentElement);
        return parallaxWrappers.map((el, i) => {
          const innerMotion = el.querySelector('div');
          return {
            index: i,
            transform: innerMotion ? window.getComputedStyle(innerMotion).transform : 'none',
          };
        });
      })()
    `,
    returnByValue: true,
  });

  console.log('SelectedWork Card Parallax Transforms at scroll 1100px:', JSON.stringify(cardTransforms.result.value, null, 2));

  // Scroll to Contact Section (around bottom) and inspect settling transforms
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, document.body.scrollHeight);' });
  await new Promise((r) => setTimeout(r, 800));

  const contactSettling = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const contact = document.getElementById('contact');
        if (!contact) return null;
        const settlingElements = Array.from(contact.querySelectorAll('.grid > div')).map(el => ({
          className: el.className.slice(0, 40),
          transform: window.getComputedStyle(el).transform,
          opacity: window.getComputedStyle(el).opacity,
        }));
        return settlingElements;
      })()
    `,
    returnByValue: true,
  });

  console.log('Contact Settling transforms at scroll bottom:', JSON.stringify(contactSettling.result.value, null, 2));

  ws.close();
  browserProc.kill();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
