import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_browser_profile_' + Date.now());

async function runTest() {
  console.log('Using browser:', CHROME_PATH);
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--window-size=1280,800',
    'http://localhost:3000',
  ], { stdio: 'ignore' });

  // Wait for CDP port
  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const res = await fetch('http://127.0.0.1:9222/json/list');
      const list = await res.json();
      const page = list.find((t) => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {
      // wait
    }
  }

  if (!wsUrl) {
    console.error('Failed to connect to CDP endpoint');
    browserProc.kill();
    process.exit(1);
  }

  console.log('Connected to CDP at:', wsUrl);

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

  const consoleLogs = [];
  const networkErrors = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
      return;
    }

    if (msg.method === 'Runtime.consoleAPICalled') {
      const { type, args } = msg.params;
      const text = args.map((a) => a.value ?? JSON.stringify(a)).join(' ');
      consoleLogs.push({ type, text });
      console.log(`[Browser Console ${type.toUpperCase()}]:`, text);
    } else if (msg.method === 'Runtime.exceptionThrown') {
      const exp = msg.params.exceptionDetails;
      consoleLogs.push({ type: 'exception', text: exp.text + ' ' + (exp.exception?.description || '') });
      console.error('[Browser Exception]:', exp.text, exp.exception?.description);
    } else if (msg.method === 'Network.loadingFailed') {
      networkErrors.push(msg.params);
      console.warn('[Network Failed]:', msg.params.requestId, msg.params.errorText);
    }
  };

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await send('Runtime.enable');
  await send('Page.enable');
  await send('Network.enable');

  console.log('Waiting 3s for page load & WebGL init...');
  await new Promise((r) => setTimeout(r, 3000));

  // Inspect page details
  const evalResult = await send('Runtime.evaluate', {
    expression: `(() => {
      const canvas = document.querySelector('canvas');
      const canvasRect = canvas ? canvas.getBoundingClientRect() : null;
      const gl = canvas ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;
      return {
        title: document.title,
        canvasFound: !!canvas,
        canvasRect: canvasRect ? {
          width: canvasRect.width,
          height: canvasRect.height,
          top: canvasRect.top,
          left: canvasRect.left,
          display: window.getComputedStyle(canvas).display,
          visibility: window.getComputedStyle(canvas).visibility,
          opacity: window.getComputedStyle(canvas).opacity
        } : null,
        glRenderer: gl ? gl.getParameter(gl.RENDERER) : null,
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        bodyHeight: document.body.scrollHeight
      };
    })()`,
    returnByValue: true,
  });

  console.log('Page & WebGL Evaluation:', JSON.stringify(evalResult.result.value, null, 2));

  // Measure FPS over 1 second
  const fpsResult = await send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      let frames = 0;
      const start = performance.now();
      function count() {
        frames++;
        if (performance.now() - start < 1000) {
          requestAnimationFrame(count);
        } else {
          resolve({
            fps: Math.round((frames * 1000) / (performance.now() - start)),
            totalFrames: frames
          });
        }
      }
      requestAnimationFrame(count);
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  console.log('FPS Measurement:', fpsResult.result.value);

  // Take screenshot
  const ss = await send('Page.captureScreenshot', { format: 'png' });
  const ssPath = path.join(ROOT_DIR, 'scripts', 'screenshot-test.png');
  fs.writeFileSync(ssPath, Buffer.from(ss.data, 'base64'));
  console.log('Screenshot saved to:', ssPath);

  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}

  console.log('\n--- SUMMARY ---');
  console.log('Total Console Logs:', consoleLogs.length);
  console.log('Total Network Errors:', networkErrors.length);
}

const ROOT_DIR = process.cwd();
runTest().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
