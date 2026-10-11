import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const BROWSER_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const PORT = 9246;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_nav_test_' + Date.now());

async function run() {
  console.log('--- NAVBAR ACTIVE HIGHLIGHT VERIFICATION ---');
  console.log('Launching headless browser:', BROWSER_PATH);

  const browserProc = spawn(BROWSER_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--no-default-browser-check',
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
    console.error('FAIL: Could not connect to browser CDP.');
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

  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `sessionStorage.setItem('pradyuma_portfolio_preloader_seen', '1');`,
  });

  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 3000));

  async function getActiveNavText() {
    const res = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const activeEl = document.querySelector('nav[aria-label="Main navigation"] a[aria-current="page"]');
          return activeEl ? activeEl.textContent.trim() : null;
        })()
      `,
      returnByValue: true,
    });
    return res.result.value;
  }

  async function clickNavLink(name) {
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('nav[aria-label="Main navigation"] a'));
          const link = links.find(a => a.textContent.includes('${name}'));
          if (link) link.click();
        })()
      `,
    });
  }

  let failures = 0;

  // Check 1: Initial state
  const initialActive = await getActiveNavText();
  console.log(`Initial active nav: "${initialActive}"`);
  if (initialActive === 'Home') {
    console.log('✓ PASS: Initial nav highlights Home');
  } else {
    console.error(`✗ FAIL: Expected Home, got ${initialActive}`);
    failures++;
  }

  // Check 2: Click Work
  console.log('\nClicking "Work"...');
  await clickNavLink('Work');
  await new Promise((r) => setTimeout(r, 2200));
  const workActive = await getActiveNavText();
  console.log(`Active nav after clicking Work: "${workActive}"`);
  if (workActive === 'Work') {
    console.log('✓ PASS: Work is highlighted when clicking Work');
  } else {
    console.error(`✗ FAIL: Expected Work, got ${workActive}`);
    failures++;
  }

  // Check 3: Click About
  console.log('\nClicking "About"...');
  await clickNavLink('About');
  await new Promise((r) => setTimeout(r, 2200));
  const aboutActive = await getActiveNavText();
  console.log(`Active nav after clicking About: "${aboutActive}"`);
  if (aboutActive === 'About') {
    console.log('✓ PASS: About is highlighted when clicking About');
  } else {
    console.error(`✗ FAIL: Expected About, got ${aboutActive}`);
    failures++;
  }

  // Check 4: Click Journey
  console.log('\nClicking "Journey"...');
  await clickNavLink('Journey');
  await new Promise((r) => setTimeout(r, 2200));
  const journeyActive = await getActiveNavText();
  console.log(`Active nav after clicking Journey: "${journeyActive}"`);
  if (journeyActive === 'Journey') {
    console.log('✓ PASS: Journey is highlighted when clicking Journey');
  } else {
    console.error(`✗ FAIL: Expected Journey, got ${journeyActive}`);
    failures++;
  }

  // Check 5: Click Contact
  console.log('\nClicking "Contact"...');
  await clickNavLink('Contact');
  await new Promise((r) => setTimeout(r, 2200));
  const contactActive = await getActiveNavText();
  console.log(`Active nav after clicking Contact: "${contactActive}"`);
  if (contactActive === 'Contact') {
    console.log('✓ PASS: Contact is highlighted when clicking Contact');
  } else {
    console.error(`✗ FAIL: Expected Contact, got ${contactActive}`);
    failures++;
  }

  // Check 6: Click Home
  console.log('\nClicking "Home"...');
  await clickNavLink('Home');
  await new Promise((r) => setTimeout(r, 2200));
  const homeActive = await getActiveNavText();
  console.log(`Active nav after clicking Home: "${homeActive}"`);
  if (homeActive === 'Home') {
    console.log('✓ PASS: Home is highlighted when clicking Home');
  } else {
    console.error(`✗ FAIL: Expected Home, got ${homeActive}`);
    failures++;
  }

  // Check 7: Manual scroll spy test
  console.log('\n--- TESTING MANUAL SCROLL SPY ---');
  // Scroll to Selected Work
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('selected-work');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo(0, y);
        }
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  const scrollWorkActive = await getActiveNavText();
  console.log(`Active nav when scrolled to #selected-work: "${scrollWorkActive}"`);
  if (scrollWorkActive === 'Work') {
    console.log('✓ PASS: Scroll spy highlights Work at #selected-work');
  } else {
    console.error(`✗ FAIL: Expected Work, got ${scrollWorkActive}`);
    failures++;
  }

  // Scroll to About
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('about');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo(0, y);
        }
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  const scrollAboutActive = await getActiveNavText();
  console.log(`Active nav when scrolled to #about: "${scrollAboutActive}"`);
  if (scrollAboutActive === 'About') {
    console.log('✓ PASS: Scroll spy highlights About at #about');
  } else {
    console.error(`✗ FAIL: Expected About, got ${scrollAboutActive}`);
    failures++;
  }

  // Scroll to Journey
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('journey');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo(0, y);
        }
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  const scrollJourneyActive = await getActiveNavText();
  console.log(`Active nav when scrolled to #journey: "${scrollJourneyActive}"`);
  if (scrollJourneyActive === 'Journey') {
    console.log('✓ PASS: Scroll spy highlights Journey at #journey');
  } else {
    console.error(`✗ FAIL: Expected Journey, got ${scrollJourneyActive}`);
    failures++;
  }

  // Scroll to Contact
  await send('Runtime.evaluate', {
    expression: `
      (() => {
        const el = document.getElementById('contact');
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo(0, y);
        }
      })()
    `,
  });
  await new Promise((r) => setTimeout(r, 600));
  const scrollContactActive = await getActiveNavText();
  console.log(`Active nav when scrolled to #contact: "${scrollContactActive}"`);
  if (scrollContactActive === 'Contact') {
    console.log('✓ PASS: Scroll spy highlights Contact at #contact');
  } else {
    console.error(`✗ FAIL: Expected Contact, got ${scrollContactActive}`);
    failures++;
  }

  // Scroll to top
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, 0);`,
  });
  await new Promise((r) => setTimeout(r, 600));
  const scrollTopActive = await getActiveNavText();
  console.log(`Active nav when scrolled to top: "${scrollTopActive}"`);
  if (scrollTopActive === 'Home') {
    console.log('✓ PASS: Scroll spy highlights Home at top');
  } else {
    console.error(`✗ FAIL: Expected Home, got ${scrollTopActive}`);
    failures++;
  }

  ws.close();
  browserProc.kill();

  console.log('\n====================================');
  if (failures === 0) {
    console.log('>>> ALL 12 TESTS PASSED PERFECTLY! <<<');
    process.exit(0);
  } else {
    console.error(`>>> FAILED WITH ${failures} ERRORS <<<`);
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
