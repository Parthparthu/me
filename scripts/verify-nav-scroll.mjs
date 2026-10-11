import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const BROWSER_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PORT = 9245;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_scroll_final_' + Date.now());

async function runScrollVerification() {
  console.log('Starting headless browser for Comprehensive Scroll Animation Verification...');
  console.log('Browser binary:', BROWSER_PATH);

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
    console.error('FAIL: Could not connect to browser CDP endpoint.');
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

  ws.onmessage = (evt) => {
    const data = JSON.parse(evt.data);
    if (data.id && callbacks.has(data.id)) {
      const { resolve, reject } = callbacks.get(data.id);
      callbacks.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise((resolve) => ws.onopen = resolve);

  await send('Page.enable');
  await send('Runtime.enable');

  // Pre-seed preloader bypass
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('pradyumna_portfolio_preloader_seen', '1');`,
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 2500));

  console.log('[Check 1] Verifying initial scroll position...');
  const initRes = await send('Runtime.evaluate', {
    expression: 'window.scrollY',
    returnByValue: true,
  });
  console.log(`   Initial scrollY: ${initRes.result.value}px`);

  // Test 1: Click "About" link
  console.log('\n[Test 1] Clicking "About" in navigation bar...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.__samplesAbout = [];
        const l = window.__lenis;
        const start = performance.now();
        if (l) {
          l.on('scroll', (e) => {
            window.__samplesAbout.push({
              t: Math.round(performance.now() - start),
              y: Math.round(e.scroll),
            });
          });
        }
        const link = Array.from(document.querySelectorAll('nav a')).find(a => a.textContent.includes('About'));
        if (link) link.click();
      })()
    `,
  });

  // Sample scroll for 1.5 seconds
  for (let s = 1; s <= 14; s++) {
    await new Promise((r) => setTimeout(r, 100));
    const p = await send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log(`   t = ${s * 100}ms: scrollY = ${p.result.value}px`);
  }

  const aboutSamples = (await send('Runtime.evaluate', { expression: 'window.__samplesAbout', returnByValue: true })).result.value || [];
  console.log(`   Captured ${aboutSamples.length} frames during "About" glide.`);
  const finalAboutY = (await send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true })).result.value;

  // Test 2: Click Logo to scroll to top
  console.log('\n[Test 2] Clicking Logo ("P.") to return to top...');
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        window.__samplesTop = [];
        const l = window.__lenis;
        const start = performance.now();
        if (l) {
          l.on('scroll', (e) => {
            window.__samplesTop.push({
              t: Math.round(performance.now() - start),
              y: Math.round(e.scroll),
            });
          });
        }
        const logo = document.querySelector('a[aria-label*="home"]');
        if (logo) logo.click();
      })()
    `,
  });

  for (let s = 1; s <= 14; s++) {
    await new Promise((r) => setTimeout(r, 100));
    const p = await send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true });
    console.log(`   t = ${s * 100}ms: scrollY = ${p.result.value}px`);
  }

  const topSamples = (await send('Runtime.evaluate', { expression: 'window.__samplesTop', returnByValue: true })).result.value || [];
  console.log(`   Captured ${topSamples.length} frames during return glide.`);
  const finalTopY = (await send('Runtime.evaluate', { expression: 'window.scrollY', returnByValue: true })).result.value;

  ws.close();
  browserProc.kill();

  console.log('\n================ VERIFICATION SUMMARY ================');
  const passAbout = aboutSamples.length > 20 && finalAboutY > 2000;
  const passTop = topSamples.length > 20 && finalTopY === 0;

  console.log(`1. Nav click to "About" smoothly animated: ${passAbout ? 'PASS' : 'FAIL'} (${aboutSamples.length} frames, target ${finalAboutY}px)`);
  console.log(`2. Logo click to "Top" smoothly animated: ${passTop ? 'PASS' : 'FAIL'} (${topSamples.length} frames, target ${finalTopY}px)`);

  if (passAbout && passTop) {
    console.log('\n>>> ALL SCROLL ANIMATION TESTS PASSED WITH 100% SUCCESS! <<<');
    process.exit(0);
  } else {
    console.error('\n>>> TESTS FAILED <<<');
    process.exit(1);
  }
}

runScrollVerification().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
