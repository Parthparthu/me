import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3018;
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
  '.webp': 'image/webp',
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
  const CDP_PORT = 9295;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_gif_' + Date.now());
  const FRAMES_DIR = path.resolve('temp_gif_frames');

  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--window-size=1000,625',
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
  await send('Runtime.enable');
  await send('Page.enable');

  try {
    // Dismiss preloader immediately if present
    await send('Runtime.evaluate', {
      expression: `(() => {
        sessionStorage.setItem('pradyumna_portfolio_preloader_seen', 'true');
        const skip = document.querySelector('button[aria-label="Skip intro"]');
        if (skip) skip.click();
      })()`,
    });

    await new Promise((r) => setTimeout(r, 1200));

    // Ensure we are at top
    await send('Runtime.evaluate', {
      expression: `window.scrollTo(0, 0);`,
    });

    await new Promise((r) => setTimeout(r, 600));

    console.log('Capturing frames of liquid sculpture in motion with cursor interaction...');
    const frameCount = 36; // 36 frames at ~100ms each = 3.6 second loop
    const width = 1000;
    const height = 625;

    // S-curve cursor trajectory across the hero sculpture center
    for (let f = 0; f < frameCount; f++) {
      const progress = f / frameCount; // 0 to 1
      // Sine wave motion across hero canvas
      const angle = progress * Math.PI * 2;
      const mouseX = Math.round(500 + Math.sin(angle) * 220);
      const mouseY = Math.round(280 + Math.cos(angle * 2) * 80);

      await send('Input.dispatchMouseEvent', {
        type: 'mouseMoved',
        x: mouseX,
        y: mouseY,
      });

      await new Promise((r) => setTimeout(r, 90));

      const shot = await send('Page.captureScreenshot', {
        format: 'png',
        clip: {
          x: 0,
          y: 0,
          width: width,
          height: height,
          scale: 1,
        },
      });

      const framePath = path.join(FRAMES_DIR, `frame_${String(f).padStart(3, '0')}.png`);
      fs.writeFileSync(framePath, Buffer.from(shot.data, 'base64'));
    }

    console.log(`Captured ${frameCount} frames successfully in ${FRAMES_DIR}`);
  } catch (err) {
    console.error('Frame capture error:', err);
  } finally {
    browserProc.kill();
    server.close();
  }
}

main();
