import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_audit_' + Date.now());

async function runAudit() {
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9228',
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
      const res = await fetch('http://127.0.0.1:9228/json/list');
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
  await new Promise((r) => setTimeout(r, 3000));

  const metrics = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = performance.getEntriesByType('paint');
      const fp = paints.find(p => p.name === 'first-paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');

      // Accessibility checks
      const imagesWithoutAlt = Array.from(document.querySelectorAll('img')).filter(img => !img.hasAttribute('alt') && !img.hasAttribute('aria-hidden')).length;
      const buttonsWithoutLabel = Array.from(document.querySelectorAll('button')).filter(btn => !btn.innerText.trim() && !btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')).length;
      const linksWithoutLabel = Array.from(document.querySelectorAll('a')).filter(a => !a.innerText.trim() && !a.getAttribute('aria-label') && !a.getAttribute('aria-labelledby')).length;
      const htmlLang = document.documentElement.lang;
      const metaDesc = !!document.querySelector('meta[name="description"]');
      const canonical = !!document.querySelector('link[rel="canonical"]');
      const structuredData = !!document.querySelector('script[type="application/ld+json"]');

      return {
        domInteractive: Math.round(nav.domInteractive || 0),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd || 0),
        loadComplete: Math.round(nav.loadEventEnd || 0),
        firstPaint: Math.round(fp ? fp.startTime : 0),
        firstContentfulPaint: Math.round(fcp ? fcp.startTime : 0),
        accessibility: {
          imagesWithoutAlt,
          buttonsWithoutLabel,
          linksWithoutLabel,
          htmlLang,
        },
        seo: {
          metaDesc,
          canonical,
          structuredData,
          title: document.title,
        },
      };
    })()`,
    returnByValue: true,
  });

  console.log('AUDIT METRICS:', JSON.stringify(metrics.result.value, null, 2));

  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}
}

runAudit().catch(console.error);
