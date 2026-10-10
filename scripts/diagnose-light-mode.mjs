import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const ROOT_DIR = process.cwd();
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'scripts', 'screenshots-light');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class BrowserSession {
  constructor(port = 9228) {
    this.port = port;
    this.userData = path.join(process.env.TEMP || 'C:\\temp', 'cdp_diag_' + Date.now());
    this.consoleLogs = [];
    this.networkErrors = [];
    this.ws = null;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async start(viewport = { width: 1280, height: 800 }) {
    const args = [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--remote-allow-origins=*',
      `--user-data-dir=${this.userData}`,
      '--no-first-run',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      `--window-size=${viewport.width},${viewport.height}`,
    ];

    this.proc = spawn(CHROME_PATH, args, { stdio: 'ignore' });

    let wsUrl = null;
    for (let i = 0; i < 40; i++) {
      await new Promise((r) => setTimeout(r, 250));
      try {
        const res = await fetch(`http://127.0.0.1:${this.port}/json/list`);
        const list = await res.json();
        const page = list.find((t) => t.type === 'page');
        if (page && page.webSocketDebuggerUrl) {
          wsUrl = page.webSocketDebuggerUrl;
          break;
        }
      } catch {}
    }

    if (!wsUrl) throw new Error('Could not connect to CDP');

    this.ws = new WebSocket(wsUrl);
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
        return;
      }

      if (msg.method === 'Runtime.consoleAPICalled') {
        const { type, args } = msg.params;
        const text = args.map((a) => a.value ?? JSON.stringify(a)).join(' ');
        this.consoleLogs.push({ type, text });
      }

      if (msg.method === 'Network.responseReceived') {
        const { status, url } = msg.params.response;
        if (status >= 400) {
          this.networkErrors.push({ url, status });
        }
      }
    };

    await new Promise((r) => {
      this.ws.onopen = r;
    });

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('Network.enable');
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.width <= 768,
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 2000));
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async screenshot(name) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved screenshot: ${filePath} (${Math.round(buffer.length / 1024)} KB)`);
  }

  async close() {
    try {
      this.ws?.close();
    } catch {}
    try {
      this.proc?.kill();
    } catch {}
    try {
      fs.rmSync(this.userData, { recursive: true, force: true });
    } catch {}
  }
}

async function runDiagnosis() {
  console.log('=== LIGHT MODE IN-BROWSER DIAGNOSIS ===\n');
  const session = new BrowserSession(9228);
  await session.start({ width: 1280, height: 800 });
  await session.navigate('http://localhost:3000');

  // Dismiss preloader
  await session.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))`);
  await new Promise((r) => setTimeout(r, 1200));

  // Switch to light theme
  console.log('1. Switching to Light Theme via UI/Store...');
  const switchResult = await session.eval(`(() => {
    // Check ThemeToggle button
    const btn = document.querySelector('button[aria-label*="Switch to light"]');
    if (btn) {
      btn.click();
    } else {
      const store = window.__PORTFOLIO_SCENE_STORE__;
      if (store) store.getState().setTheme('light');
      document.documentElement.setAttribute('data-theme', 'light');
    }
    return {
      currentThemeAttr: document.documentElement.getAttribute('data-theme'),
      storeTheme: window.__PORTFOLIO_SCENE_STORE__?.getState().theme
    };
  })()`);
  console.log('   Switch result:', switchResult);
  await new Promise((r) => setTimeout(r, 1000));

  // Screenshot 1: Hero in Light Mode
  await session.screenshot('01-light-hero');

  // Diagnose Defects on Hero and Nav
  console.log('\n2. Inspecting Nav and Hero Text & Colors in Light Mode...');
  const heroInspection = await session.eval(`(() => {
    const issues = [];
    
    // Check Nav items for text-white or low contrast
    const navLinks = Array.from(document.querySelectorAll('nav a, nav button'));
    navLinks.forEach((el) => {
      const cs = window.getComputedStyle(el);
      const text = el.innerText.trim();
      const color = cs.color;
      // parse rgb
      const rgb = color.match(/\\d+/g);
      if (rgb) {
        const [r, g, b] = rgb.map(Number);
        // Is it nearly white?
        if (r > 230 && g > 230 && b > 230) {
          issues.push({ element: 'Nav ' + (text || el.getAttribute('aria-label') || 'icon'), problem: 'Nearly white text on light mode', color });
        }
      }
    });

    // Check Hero H1 and Subtitle
    const h1 = document.querySelector('h1');
    if (h1) {
      const cs = window.getComputedStyle(h1);
      issues.push({ element: 'Hero H1', color: cs.color, fontSize: cs.fontSize });
    }

    // Check Glass container
    const glasses = Array.from(document.querySelectorAll('.liquid-glass'));
    glasses.slice(0, 3).forEach((g, i) => {
      const cs = window.getComputedStyle(g);
      issues.push({
        element: 'Glass Card ' + i,
        bgColor: cs.backgroundColor,
        border: cs.border,
        boxShadow: cs.boxShadow
      });
    });

    return issues;
  })()`);
  console.log('   Inspection Results:', JSON.stringify(heroInspection, null, 2));

  // Scroll to Work Section
  console.log('\n3. Scrolling to Work Section...');
  await session.eval(`(() => {
    const el = document.getElementById('selected-work');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1200));
  await session.screenshot('02-light-work');

  // Check Work Card Contrast & Text
  const workInspection = await session.eval(`(() => {
    const cards = Array.from(document.querySelectorAll('#selected-work article, #selected-work .liquid-glass'));
    return cards.slice(0, 2).map((c, i) => {
      const headings = Array.from(c.querySelectorAll('h3, p, span, a')).map((el) => ({
        tag: el.tagName,
        text: el.innerText.slice(0, 30),
        color: window.getComputedStyle(el).color
      }));
      return { cardIndex: i, textSamples: headings.slice(0, 6) };
    });
  })()`);
  console.log('   Work Cards Sample Colors:', JSON.stringify(workInspection, null, 2));

  // Scroll to About & Skills Section
  console.log('\n4. Scrolling to Skills Section...');
  await session.eval(`(() => {
    const el = document.getElementById('skills');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1200));
  await session.screenshot('03-light-skills');

  // Scroll to Contact Section
  console.log('\n5. Scrolling to Contact Section...');
  await session.eval(`(() => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1200));
  await session.screenshot('04-light-contact');

  // Navigate to /projects
  console.log('\n6. Navigating to /projects in Light Mode...');
  await session.navigate('http://localhost:3000/projects');
  await new Promise((r) => setTimeout(r, 1200));
  await session.screenshot('05-light-projects-page');

  // Open Command Palette
  console.log('\n7. Testing Command Palette in Light Mode...');
  await session.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }))`);
  await new Promise((r) => setTimeout(r, 800));
  await session.screenshot('06-light-command-palette');

  // Check Mobile Viewport in Light Mode
  console.log('\n8. Testing Mobile Light Mode at 360x740...');
  await session.send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 740,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await session.navigate('http://localhost:3000');
  await session.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))`);
  await new Promise((r) => setTimeout(r, 1200));
  await session.screenshot('07-light-mobile-hero');

  // Check Console & Network Errors
  console.log('\n9. Checking Errors...');
  console.log('   Console Errors:', session.consoleLogs.filter((l) => l.type === 'error'));
  console.log('   Network Errors:', session.networkErrors);

  await session.close();
  console.log('\n=== DIAGNOSIS COMPLETE ===');
}

runDiagnosis().catch((err) => {
  console.error('Diagnosis Failed:', err);
  process.exit(1);
});
