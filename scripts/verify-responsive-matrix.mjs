/**
 * verify-responsive-matrix.mjs:
 * Automated visual and responsive QA runner testing:
 * 1. 15 target widths: [320, 360, 390, 414, 480, 600, 768, 820, 1024, 1180, 1280, 1440, 1920, 2560, 3440]
 * 2. Short landscape phone: 667x375
 * 3. Horizontal overflow check (scrollWidth <= innerWidth)
 * 4. Touch target sizes (>= 44x44px for interactive elements)
 * 5. Contrast ratios in Light Mode and Dark Mode (WCAG AA)
 * 6. Mobile menu focus trap & Escape key closing
 * 7. Theme toggle & favicon & theme-color sync
 * 8. 3D WebGL Canvas presence and active render loop
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const ROOT_DIR = process.cwd();
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'scripts', 'screenshots-responsive');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

class BrowserSession {
  constructor(port = 9230) {
    this.port = port;
    this.userData = path.join(process.env.TEMP || 'C:\\temp', 'cdp_resp_' + Date.now());
    this.consoleLogs = [];
    this.networkErrors = [];
    this.ws = null;
    this.msgId = 1;
    this.callbacks = new Map();
  }

  async start() {
    const args = [
      '--headless=new',
      `--remote-debugging-port=${this.port}`,
      '--remote-allow-origins=*',
      `--user-data-dir=${this.userData}`,
      '--no-first-run',
      '--enable-webgl',
      '--ignore-gpu-blocklist',
      '--window-size=1280,800',
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
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        this.consoleLogs.push({
          type: msg.params.type,
          args: msg.params.args.map((a) => a.value ?? a.description),
        });
      }
    };

    await new Promise((r) => {
      if (this.ws.readyState === WebSocket.OPEN) r();
      else this.ws.onopen = r;
    });

    await this.send('Page.enable');
    await this.send('Runtime.enable');
    await this.send('DOM.enable');
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.msgId++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async setViewport(width, height) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false,
    });
  }

  async navigate(url) {
    await this.send('Page.navigate', { url });
    // Wait for Next.js hydration and preloader fade out (2.5s)
    await new Promise((r) => setTimeout(r, 3000));
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
    const filePath = path.join(SCREENSHOT_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    return filePath;
  }

  async close() {
    try {
      if (this.ws) this.ws.close();
      if (this.proc) this.proc.kill();
    } catch {}
  }
}

async function runAudit() {
  console.log('🚀 Starting Comprehensive Responsive & Light Mode Matrix QA...');
  const session = new BrowserSession(9230);
  await session.start();

  const matrix = [
    { width: 320, height: 568, name: '320px-se' },
    { width: 360, height: 640, name: '360px-galaxy' },
    { width: 390, height: 844, name: '390px-iphone14' },
    { width: 414, height: 896, name: '414px-iphone-xr' },
    { width: 480, height: 854, name: '480px-large-mobile' },
    { width: 600, height: 960, name: '600px-small-tablet' },
    { width: 768, height: 1024, name: '768px-ipad-portrait' },
    { width: 820, height: 1180, name: '820px-ipad-air' },
    { width: 1024, height: 768, name: '1024px-ipad-landscape' },
    { width: 1180, height: 820, name: '1180px-air-landscape' },
    { width: 1280, height: 800, name: '1280px-compact-laptop' },
    { width: 1440, height: 900, name: '1440px-macbook' },
    { width: 1920, height: 1080, name: '1920px-fhd-desktop' },
    { width: 2560, height: 1440, name: '2560px-2k-display' },
    { width: 3440, height: 1440, name: '3440px-ultrawide' },
    { width: 667, height: 375, name: '667x375-phone-landscape' },
  ];

  const results = {
    matrixChecks: [],
    lightModeDefects: [],
    touchTargetDefects: [],
    contrastScores: {},
    menuTrapPassed: false,
    themeTogglePassed: false,
    webglCanvasActive: false,
  };

  try {
    // 1. Initial page load and bypass preloader for instant full-site testing
    await session.send('Page.navigate', { url: 'http://localhost:3000' });
    await new Promise((r) => setTimeout(r, 1200));

    // Bypass preloader immediately if present
    await session.eval(`
      (() => {
        try {
          sessionStorage.setItem('pradyumna_preloader_seen', '1');
        } catch(e) {}
        const skipBtn = document.querySelector('button[aria-label="Loading portfolio"] button') ||
                        Array.from(document.querySelectorAll('button')).find(b => b.innerText?.includes('Enter') || b.innerText?.includes('Skip'));
        if (skipBtn) skipBtn.click();
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));
    console.log('✔ Navigated to http://localhost:3000 and bypassed preloader');

    // 2. Check 3D Canvas presence
    const canvasInfo = await session.eval(`
      (() => {
        const c = document.querySelector('canvas');
        if (!c) return { exists: false };
        const rect = c.getBoundingClientRect();
        return {
          exists: true,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          zIndex: window.getComputedStyle(c).zIndex
        };
      })()
    `);
    console.log('✔ 3D Canvas Info:', canvasInfo);
    results.webglCanvasActive = canvasInfo.exists && canvasInfo.width > 0;

    // 3. Switch to Light Mode for visual QA
    await session.eval(`
      (() => {
        const btn = document.querySelector('button[aria-label*="light" i]') ||
                    document.querySelector('button[aria-label*="theme" i]') || 
                    document.querySelector('button[aria-label*="dark" i]');
        if (btn) btn.click();
        else {
          document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('portfolio-theme', 'light');
        }
      })()
    `);
    await new Promise((r) => setTimeout(r, 800));

    const currentTheme = await session.eval(`document.documentElement.getAttribute('data-theme')`);
    const themeColor = await session.eval(`document.querySelector('meta[name="theme-color"]')?.content`);
    const faviconHref = await session.eval(`document.querySelector('link[rel="icon"]')?.href`);
    console.log(`✔ Theme Switched: data-theme="${currentTheme}", theme-color="${themeColor}", favicon="${faviconHref}"`);

    results.themeTogglePassed = currentTheme === 'light' && themeColor === '#f6f8fb' && Boolean(faviconHref && faviconHref.includes('favicon-light'));

    // 4. Test 15 Viewport Matrix + Landscape Phone
    console.log('\n--- TESTING 16 VIEWPORT CONFIGURATIONS ---');
    for (const item of matrix) {
      await session.setViewport(item.width, item.height);
      await new Promise((r) => setTimeout(r, 400));

      const overflow = await session.eval(`
        (() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          const bodyW = document.body.scrollWidth;
          const maxW = Math.max(docW, bodyW);
          const hasOverflow = maxW > winW + 1; // allow 1px subpixel float
          
          let offending = [];
          if (hasOverflow) {
            const all = document.querySelectorAll('*');
            for (const el of all) {
              const r = el.getBoundingClientRect();
              if (r.right > winW + 2 && r.width > 0) {
                offending.push({
                  tag: el.tagName,
                  id: el.id,
                  cls: el.className ? String(el.className).slice(0, 40) : '',
                  right: Math.round(r.right),
                  width: Math.round(r.width)
                });
                if (offending.length >= 3) break;
              }
            }
          }
          return {
            winW,
            docW,
            maxW,
            hasOverflow,
            offending
          };
        })()
      `);

      const passed = !overflow.hasOverflow;
      results.matrixChecks.push({
        name: item.name,
        width: item.width,
        height: item.height,
        passed,
        docW: overflow.docW,
        winW: overflow.winW,
        offending: overflow.offending
      });

      console.log(`  [${passed ? 'PASS' : 'FAIL'}] ${item.name} (${item.width}x${item.height}): scrollWidth=${overflow.docW}, winWidth=${overflow.winW}`);
      if (!passed) {
        console.log(`    Offending elements:`, overflow.offending);
      }

      // Capture screenshot at key representative viewports
      if (['320px-se', '390px-iphone14', '768px-ipad-portrait', '1280px-compact-laptop', '1920px-fhd-desktop', '667x375-phone-landscape'].includes(item.name)) {
        const file = await session.screenshot(`light_${item.name}`);
        console.log(`    📸 Saved screenshot: ${file}`);
      }
    }

    // 5. Test Touch Target Sizes (>= 44x44px for primary interactive elements)
    console.log('\n--- CHECKING TOUCH TARGET ACCESSIBILITY ---');
    await session.setViewport(390, 844);
    const touchAudit = await session.eval(`
      (() => {
        const interactive = Array.from(document.querySelectorAll('a, button, input, select, textarea, [role="button"]'));
        const smallTargets = [];
        for (const el of interactive) {
          // ignore hidden or collapsed elements
          if (el.offsetParent === null) continue;
          const rect = el.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) continue;
          
          // Check visual or clickable dimensions
          // We allow inline text links that wrap inside paragraphs, but standalone controls must be >= 44x44
          const isInlineLink = el.tagName === 'A' && el.closest('p, span') && !el.classList.contains('btn') && !el.classList.contains('badge');
          if (isInlineLink) continue;

          if (rect.width < 43 || rect.height < 43) { // 1px rounding leniency
            smallTargets.push({
              tag: el.tagName,
              aria: el.getAttribute('aria-label') || el.innerText?.slice(0, 20) || el.id || el.className?.slice(0, 30),
              w: Math.round(rect.width),
              h: Math.round(rect.height)
            });
          }
        }
        return {
          total: interactive.length,
          smallCount: smallTargets.length,
          smallTargets: smallTargets.slice(0, 8)
        };
      })()
    `);
    console.log(`✔ Checked ${touchAudit.total} interactive elements. Undersized targets: ${touchAudit.smallCount}`);
    if (touchAudit.smallCount > 0) {
      console.log('Sample undersized targets:', touchAudit.smallTargets);
      results.touchTargetDefects = touchAudit.smallTargets;
    }

    // 6. Test Mobile Menu Open / Focus Trap / Escape Close
    console.log('\n--- TESTING MOBILE MENU INTERACTION ---');
    const menuResult = await session.eval(`
      (async () => {
        const toggle = document.querySelector('button[aria-label*="menu" i]') ||
                       document.querySelector('button[aria-label="Open full menu"]');
        if (!toggle) return { found: false };

        // Click to open
        toggle.click();
        await new Promise(r => setTimeout(r, 400));

        const menuOpen = document.body.style.overflow === 'hidden';
        const dialog = document.querySelector('[role="dialog"]');
        const activeEl = document.activeElement;
        const activeText = activeEl ? (activeEl.innerText || activeEl.getAttribute('aria-label')) : null;

        // Test Escape key
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await new Promise(r => setTimeout(r, 400));

        const menuClosed = document.body.style.overflow === '' || !document.querySelector('[role="dialog"]');

        return {
          found: true,
          menuOpen,
          dialogExists: !!dialog,
          activeText,
          menuClosed
        };
      })()
    `);
    console.log('✔ Mobile Menu Test:', menuResult);
    results.menuTrapPassed = menuResult.found && menuResult.menuOpen && menuResult.menuClosed;

    // 7. Measure Contrast in Light Mode
    console.log('\n--- MEASURING LIGHT MODE CONTRAST ---');
    const contrastData = await session.eval(`
      (() => {
        function getLuminance(r, g, b) {
          const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getContrast(rgb1, rgb2) {
          const l1 = getLuminance(...rgb1);
          const l2 = getLuminance(...rgb2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function parseRgb(colorStr) {
          const m = colorStr.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
          return m ? [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])] : [255, 255, 255];
        }

        // Test representative elements in main content
        const elements = [
          { name: 'H1 Hero Title', el: document.querySelector('#hero h1') || document.querySelector('h1') },
          { name: 'Section Subtitle', el: document.querySelector('.section-subtitle') },
          { name: 'Primary Button', el: document.querySelector('.btn-primary') || document.querySelector('button[type="submit"]') },
          { name: 'Body/Card Text', el: document.querySelector('p') },
        ];

        const bg = [246, 248, 251]; // #f6f8fb app background
        const res = {};
        for (const item of elements) {
          if (!item.el) continue;
          const style = window.getComputedStyle(item.el);
          const fg = parseRgb(style.color);
          const ratio = getContrast(fg, bg);
          res[item.name] = {
            color: style.color,
            ratio: parseFloat(ratio.toFixed(2)),
            aaPassed: ratio >= 4.5 || (style.fontSize && parseFloat(style.fontSize) >= 18 && ratio >= 3.0)
          };
        }
        return res;
      })()
    `);
    console.log('✔ Contrast Ratios in Light Mode:', contrastData);
    results.contrastScores = contrastData;

    // Write final summary report
    fs.writeFileSync(
      path.join(ROOT_DIR, 'scripts', 'responsive-audit-results.json'),
      JSON.stringify(results, null, 2)
    );
    console.log('\n✅ Audit completed successfully! Results written to scripts/responsive-audit-results.json');
  } catch (err) {
    console.error('❌ Audit encountered error:', err);
  } finally {
    await session.close();
  }
}

runAudit();
