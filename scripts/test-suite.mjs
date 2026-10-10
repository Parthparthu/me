import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const ROOT_DIR = process.cwd();
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'scripts', 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class BrowserSession {
  constructor(port = 9222, options = {}) {
    this.port = port;
    this.options = options;
    this.userData = path.join(process.env.TEMP || 'C:\\temp', 'cdp_prof_' + Date.now());
    this.consoleLogs = [];
    this.networkErrors = [];
    this.ws = null;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async start(viewport = { width: 1280, height: 800 }, reducedMotion = false) {
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

    if (reducedMotion) {
      args.push('--force-prefers-reduced-motion');
    }

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
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const exp = msg.params.exceptionDetails;
        this.consoleLogs.push({
          type: 'error',
          text: exp.text + ' ' + (exp.exception?.description || ''),
        });
      } else if (msg.method === 'Network.loadingFailed') {
        this.networkErrors.push(msg.params);
      }
    };

    await new Promise((r) => (this.ws.onopen = r));
    await this.send('Runtime.enable');
    await this.send('Page.enable');
    await this.send('Network.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expr) {
    const res = await this.send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result?.value;
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    await new Promise((r) => setTimeout(r, 1200));
  }

  async screenshot(name) {
    const ss = await this.send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(ss.data, 'base64'));
    return filePath;
  }

  async close() {
    if (this.ws) this.ws.close();
    if (this.proc) this.proc.kill();
    try {
      fs.rmSync(this.userData, { recursive: true, force: true });
    } catch {}
  }
}

async function runTestSuite() {
  console.log('=== STARTING SECTION 4 VERIFICATION SUITE ===\n');

  // Test 1: Desktop Experience (1280x800)
  console.log('1. Testing Desktop Experience at 1280x800...');
  const desktop = new BrowserSession(9222);
  await desktop.start({ width: 1280, height: 800 });
  await desktop.navigate('http://localhost:3000');

  // Skip preloader via space key
  await desktop.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  })()`);
  await new Promise((r) => setTimeout(r, 1500));

  // Capture Hero screenshot
  await desktop.screenshot('01-desktop-hero');

  // Check 3D Canvas
  const canvasInfo = await desktop.eval(`(() => {
    const canvas = document.querySelector('canvas');
    const gl = canvas ? (canvas.getContext('webgl2') || canvas.getContext('webgl')) : null;
    return {
      exists: !!canvas,
      width: canvas?.clientWidth,
      height: canvas?.clientHeight,
      renderer: gl ? gl.getParameter(gl.RENDERER) : null
    };
  })()`);
  console.log('   Canvas Info:', canvasInfo);

  // Measure FPS over 1.5 seconds
  const desktopFps = await desktop.eval(`new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    function count() {
      frames++;
      if (performance.now() - start < 1500) {
        requestAnimationFrame(count);
      } else {
        resolve(Math.round((frames * 1000) / (performance.now() - start)));
      }
    }
    requestAnimationFrame(count);
  })`);
  console.log('   Measured Desktop FPS:', desktopFps);

  // Test 2: Scroll through rooms
  console.log('\n2. Testing Scroll-Linked Camera Spline & Multi-Room 3D...');
  await desktop.eval(`(() => {
    window.scrollTo({ top: 1200, behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1000));
  await desktop.screenshot('02-desktop-work-room');

  await desktop.eval(`(() => {
    window.scrollTo({ top: 3200, behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1000));
  await desktop.screenshot('03-desktop-skills-room');

  await desktop.eval(`(() => {
    window.scrollTo({ top: 6000, behavior: 'instant' });
  })()`);
  await new Promise((r) => setTimeout(r, 1000));
  await desktop.screenshot('04-desktop-contact-room');

  // Test 3: Expanded Project Modal
  console.log('\n3. Testing Expanded Project Modal...');
  const modalOpened = await desktop.eval(`(() => {
    const inspectBtn = document.querySelector('button[aria-label*="Open expanded preview"]');
    if (inspectBtn) {
      inspectBtn.click();
      return true;
    }
    return false;
  })()`);
  await new Promise((r) => setTimeout(r, 600));
  await desktop.screenshot('05-project-expanded-modal');
  console.log('   Modal opened successfully:', modalOpened);

  // Close modal via Escape
  await desktop.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  })()`);
  await new Promise((r) => setTimeout(r, 400));

  // Test 4: Command Palette (Cmd+K / Ctrl+K)
  console.log('\n4. Testing Command Palette (Ctrl+K)...');
  await desktop.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  })()`);
  await new Promise((r) => setTimeout(r, 600));
  await desktop.screenshot('06-command-palette');
  const paletteOpen = await desktop.eval(`(() => {
    return !!document.querySelector('input[placeholder*="Type a command"]');
  })()`);
  console.log('   Command palette visible:', paletteOpen);

  // Close palette via Escape
  await desktop.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
  })()`);
  await new Promise((r) => setTimeout(r, 400));

  // Test Quality Tiers
  console.log('\n4b. Testing Quality Tiers (high, medium, low, none)...');
  for (const tier of ['high', 'medium', 'low', 'none']) {
    const tierResult = await desktop.eval(`(() => {
      const store = window.__PORTFOLIO_SCENE_STORE__;
      if (store) {
        store.getState().setQuality('${tier}');
      }
      const canvas = document.querySelector('canvas');
      return {
        tier: '${tier}',
        canvasFound: !!canvas,
        qualityInStore: store ? store.getState().quality : 'unknown'
      };
    })()`);
    console.log('   Tier result:', tierResult);
    await desktop.screenshot(`tier-${tier}`);
    await new Promise((r) => setTimeout(r, 300));
  }
  // Restore high tier
  await desktop.eval(`(() => {
    const store = window.__PORTFOLIO_SCENE_STORE__;
    if (store) store.getState().setQuality('high');
  })()`);

  // Test 5: Route navigation & Page Transitions
  console.log('\n5. Testing Route Navigation to /projects...');
  await desktop.navigate('http://localhost:3000/projects');
  await new Promise((r) => setTimeout(r, 1200));
  await desktop.screenshot('07-projects-catalog');

  const catalogTitle = await desktop.eval(`document.querySelector('h1')?.innerText`);
  console.log('   Projects Page H1:', catalogTitle);

  // Navigate back to home
  await desktop.navigate('http://localhost:3000');
  await new Promise((r) => setTimeout(r, 1000));

  // Check console errors
  const errors = desktop.consoleLogs.filter((l) => l.type === 'error');
  console.log('\n6. Console Status:');
  console.log('   Total Errors:', errors.length);
  errors.forEach((e) => console.error('     ->', e.text));
  console.log('   Total Network Errors:', desktop.networkErrors.length);

  await desktop.close();

  // Test 6: Mobile Viewport (360x740) & FPS
  console.log('\n7. Testing Mobile Viewport at 360x740...');
  const mobile = new BrowserSession(9223);
  await mobile.start({ width: 360, height: 740 });
  await mobile.navigate('http://localhost:3000');

  // Skip preloader
  await mobile.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
  })()`);
  await new Promise((r) => setTimeout(r, 1500));

  const mobileFps = await mobile.eval(`new Promise((resolve) => {
    let frames = 0;
    const start = performance.now();
    function count() {
      frames++;
      if (performance.now() - start < 1000) {
        requestAnimationFrame(count);
      } else {
        resolve(Math.round((frames * 1000) / (performance.now() - start)));
      }
    }
    requestAnimationFrame(count);
  })`);
  console.log('   Measured Mobile FPS:', mobileFps);
  await mobile.screenshot('08-mobile-360px');
  await mobile.close();

  // Test 7: Tablet Viewport (768x1024)
  console.log('\n8. Testing Tablet Viewport at 768x1024...');
  const tablet = new BrowserSession(9224);
  await tablet.start({ width: 768, height: 1024 });
  await tablet.navigate('http://localhost:3000');
  await tablet.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))`);
  await new Promise((r) => setTimeout(r, 1500));
  await tablet.screenshot('09-tablet-768px');
  await tablet.close();

  // Test 8: Ultra-Wide (1920x1080)
  console.log('\n9. Testing Ultra-Wide Viewport at 1920x1080...');
  const ultrawide = new BrowserSession(9225);
  await ultrawide.start({ width: 1920, height: 1080 });
  await ultrawide.navigate('http://localhost:3000');
  await ultrawide.eval(`window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))`);
  await new Promise((r) => setTimeout(r, 1500));
  await ultrawide.screenshot('10-ultrawide-1920px');
  await ultrawide.close();

  // Test 9: Reduced Motion Mode
  console.log('\n10. Testing Prefers-Reduced-Motion Mode...');
  const reduced = new BrowserSession(9226);
  await reduced.start({ width: 1280, height: 800 }, true);
  await reduced.navigate('http://localhost:3000');
  await new Promise((r) => setTimeout(r, 1500));

  const reducedMotionEval = await reduced.eval(`(() => {
    const canvas = document.querySelector('canvas');
    return {
      canvasExists: !!canvas,
      canvasVisible: canvas ? window.getComputedStyle(canvas).display !== 'none' && window.getComputedStyle(canvas).opacity !== '0' : false,
      prefersReducedMotionMatches: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  })()`);
  console.log('   Reduced Motion Status:', reducedMotionEval);
  await reduced.screenshot('11-reduced-motion');
  await reduced.close();

  console.log('\n=== VERIFICATION SUITE COMPLETED SUCCESSFULLY ===');
}

runTestSuite().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
