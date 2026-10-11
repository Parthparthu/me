import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testVitals(profileName, options) {
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9234',
    '--remote-allow-origins=*',
    '--enable-webgl',
    `--window-size=${options.width},${options.height}`,
    'about:blank',
  ], { stdio: 'ignore' });

  await new Promise(r => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9234/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');

  if (options.cpuThrottling > 1) {
    await send('Emulation.setCPUThrottlingRate', { rate: options.cpuThrottling });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: options.width,
    height: options.height,
    deviceScaleFactor: options.dpr || 1,
    mobile: options.mobile || false,
  });

  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__vitals = { lcp: 0, cls: 0, tbt: 0, fcp: 0, longTasks: [] };
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.__vitals.lcp = Math.round(entry.startTime);
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__vitals.cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.__vitals.longTasks.push(entry.duration);
          if (entry.duration > 50) {
            window.__vitals.tbt += (entry.duration - 50);
          }
        }
      }).observe({ type: 'longtask', buffered: true });

      sessionStorage.setItem('pradyumna_portfolio_preloader_seen', 'true');
    `
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 4000));

  const vitals = await send('Runtime.evaluate', {
    expression: `(() => {
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');
      return {
        fcp: Math.round(fcp ? fcp.startTime : 0),
        lcp: window.__vitals.lcp,
        cls: Math.round(window.__vitals.cls * 1000) / 1000,
        tbt: Math.round(window.__vitals.tbt),
        longTaskCount: window.__vitals.longTasks.length
      };
    })()`,
    returnByValue: true
  });

  ws.close();
  browserProc.kill();
  return vitals.result.value;
}

async function main() {
  const desktop = await testVitals('Desktop', { width: 1440, height: 900, dpr: 1, cpuThrottling: 1, mobile: false });
  const laptop = await testVitals('Laptop (4x)', { width: 1440, height: 900, dpr: 1, cpuThrottling: 4, mobile: false });
  const mobile = await testVitals('Mobile (6x)', { width: 390, height: 844, dpr: 2, cpuThrottling: 6, mobile: true });

  console.log('WEB VITALS BASELINE:');
  console.log('Desktop:', desktop);
  console.log('Laptop 4x:', laptop);
  console.log('Mobile 6x:', mobile);
}

main().catch(console.error);
