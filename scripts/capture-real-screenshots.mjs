import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const CDP_PORT = 9270;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_capture_' + Date.now());

async function main() {
  const outDir = path.resolve('public', 'projects');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--window-size=1280,800',
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    browserProc.kill();
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
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 2,
    mobile: false,
  });

  const targets = [
    { name: 'numora.png', url: 'https://parthparthu.github.io/Numora/' },
    { name: 'oweo.png', url: 'https://oweo.vercel.app' },
  ];

  for (const t of targets) {
    console.log(`Capturing real screenshot of ${t.url}...`);
    try {
      await send('Page.navigate', { url: t.url });
      await new Promise((r) => setTimeout(r, 5000)); // wait for full render
      const screenshot = await send('Page.captureScreenshot', { format: 'png' });
      const buf = Buffer.from(screenshot.data, 'base64');
      fs.writeFileSync(path.join(outDir, t.name), buf);
      console.log(`Saved real screenshot to public/projects/${t.name} (${buf.length} bytes)`);
    } catch (err) {
      console.error(`Failed to capture ${t.url}:`, err);
    }
  }

  ws.close();
  browserProc.kill();
}

main().catch(console.error);
