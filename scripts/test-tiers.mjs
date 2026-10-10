import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_tier_' + Date.now());
const SCREENSHOT_DIR = path.join(process.cwd(), 'scripts', 'screenshots');

async function testTiers() {
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9230',
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--window-size=1280,800',
    'http://localhost:3000',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch('http://127.0.0.1:9230/json/list');
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
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

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
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

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 2000));

  // Skip preloader
  await send('Runtime.evaluate', {
    expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))`,
  });
  await new Promise((r) => setTimeout(r, 2500));

  const tiers = ['high', 'medium', 'low', 'none'];
  const results = {};

  for (const tier of tiers) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const store = window.__PORTFOLIO_SCENE_STORE__;
        if (store) {
          store.getState().setQuality('${tier}');
        }
        const canvas = document.querySelector('canvas');
        return {
          currentTier: store ? store.getState().quality : 'unknown',
          canvasPresent: !!canvas,
          canvasDisplay: canvas ? window.getComputedStyle(canvas).display : 'none',
        };
      })()`,
      returnByValue: true,
    });

    results[tier] = res.result.value;
    await new Promise((r) => setTimeout(r, 500));

    // Capture screenshot for each tier
    const ss = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(SCREENSHOT_DIR, `tier-${tier}.png`), Buffer.from(ss.data, 'base64'));
  }

  console.log('TIER TEST RESULTS:', JSON.stringify(results, null, 2));

  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}
}

testTiers().catch(console.error);
