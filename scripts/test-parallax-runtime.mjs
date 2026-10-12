import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 3000;
const CDP_PORT = 9240;
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
  console.log(`Server running at http://localhost:${PORT}`);

  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_parallax_audit_' + Date.now());
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--window-size=1920,1080',
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
  console.log('Connected to CDP. Waiting for page ready...');
  await new Promise((r) => setTimeout(r, 4000));

  // Measure initial transforms at scroll 0
  const initial = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.getElementById('hero');
        const heroChildren = hero ? Array.from(hero.children).map(c => ({
          tag: c.tagName,
          className: c.className,
          transform: window.getComputedStyle(c).transform
        })) : [];
        return { heroChildren };
      })()
    `,
    returnByValue: true,
  });

  // Scroll 300px
  await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 300);' });
  await new Promise((r) => setTimeout(r, 1000));

  const at300 = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hero = document.getElementById('hero');
        const heroChildren = hero ? Array.from(hero.children).map(c => ({
          tag: c.tagName,
          className: c.className,
          transform: window.getComputedStyle(c).transform,
          rect: c.getBoundingClientRect()
        })) : [];
        return { heroChildren, scrollY: window.scrollY };
      })()
    `,
    returnByValue: true,
  });

  console.log('AUDIT AT SCROLL 0:', JSON.stringify(initial.result.value, null, 2));
  console.log('AUDIT AT SCROLL 300:', JSON.stringify(at300.result.value, null, 2));

  ws.close();
  browserProc.kill();
  server.close();
}

main().catch(console.error);
