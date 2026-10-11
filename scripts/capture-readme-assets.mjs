import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const BROWSER_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PORT = 9266;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_readme_profile_' + Date.now());
const OUTPUT_DIR = path.resolve('docs/assets');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Using browser:', BROWSER_PATH);
  const browserProc = spawn(BROWSER_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--window-size=1440,900',
    'http://localhost:3000',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    console.error('Failed to connect to CDP endpoint');
    browserProc.kill();
    process.exit(1);
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

  await new Promise((r) => ws.onopen = r);
  await send('Runtime.enable');
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  // Skip preloader if active
  await new Promise((r) => setTimeout(r, 2000));
  await send('Runtime.evaluate', {
    expression: `(() => {
      sessionStorage.setItem('pradyumna_portfolio_preloader_seen', 'true');
      const skipBtn = document.querySelector('button[aria-label="Skip intro"]');
      if (skipBtn) skipBtn.click();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1000));

  async function takeShot(filename, clip = null) {
    const params = { format: 'png' };
    if (clip) params.clip = clip;
    const shot = await send('Page.captureScreenshot', params);
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${filename} (${Math.round(shot.data.length / 1024)} KB)`);
  }

  // 1. Dark Mode Desktop Hero
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
      window.scrollTo(0, 0);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await takeShot('screenshot-dark-hero.png');

  // 2. Dark Mode Command Palette
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));
  await takeShot('screenshot-dark-palette.png');

  // Close palette
  await send('Runtime.evaluate', {
    expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`,
  });
  await new Promise((r) => setTimeout(r, 400));

  // 3. Dark Mode Projects
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('selected-work');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await takeShot('screenshot-dark-projects.png');

  // 4. Switch to Light Mode
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.classList.add('theme-light');
      localStorage.setItem('theme', 'light');
      window.scrollTo(0, 0);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 1000));

  // Light Mode Hero
  await takeShot('screenshot-light-hero.png');

  // Light Mode Command Palette
  await send('Runtime.evaluate', {
    expression: `(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true }));
    })()`,
  });
  await new Promise((r) => setTimeout(r, 600));
  await takeShot('screenshot-light-palette.png');

  // Close palette
  await send('Runtime.evaluate', {
    expression: `window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`,
  });
  await new Promise((r) => setTimeout(r, 400));

  // Light Mode Projects
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('selected-work');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await takeShot('screenshot-light-projects.png');

  // 5. Mobile Viewport (390 x 844)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 0);`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await takeShot('screenshot-mobile-light.png');

  // Switch back to dark for mobile dark
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
      window.scrollTo(0, 0);
    })()`,
  });
  await new Promise((r) => setTimeout(r, 800));
  await takeShot('screenshot-mobile-dark.png');

  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}

  console.log('Capture complete!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
