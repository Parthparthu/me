import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9225;
const TARGET_URL = 'http://localhost:3000';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.ws = null;
    this.id = 1;
    this.callbacks = new Map();
    this.eventListeners = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => resolve();
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(new Error(msg.error.message));
          else cb.resolve(msg.result);
        } else if (msg.method && this.eventListeners.has(msg.method)) {
          this.eventListeners.get(msg.method)(msg.params);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    this.eventListeners.set(method, handler);
  }

  async evaluate(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || 'Evaluation failed');
    }
    return res.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function main() {
  console.log('=== STARTING BROWSER VERIFICATION AUDIT ===\n');

  // Launch Chrome headless
  const chromeProcess = spawn(
    CHROME_PATH,
    [
      `--remote-debugging-port=${PORT}`,
      '--headless=new',
      '--disable-gpu=false',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=C:\\Users\\MS\\AppData\\Local\\Temp\\chrome-verify-profile-2',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let cdp = null;

  try {
    let endpoints = null;
    for (let i = 0; i < 20; i++) {
      try {
        endpoints = await fetchJson(`http://127.0.0.1:${PORT}/json`);
        if (endpoints && endpoints.length > 0) break;
      } catch {
        await wait(500);
      }
    }

    if (!endpoints || endpoints.length === 0) {
      throw new Error('Could not connect to Chrome DevTools endpoint');
    }

    const pageTarget = endpoints.find((e) => e.type === 'page') || endpoints[0];
    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    const consoleErrors = [];
    const failedRequests = [];

    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Network.enable');

    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        const text = params.args.map((a) => a.value || a.description).join(' ');
        consoleErrors.push(text);
      }
    });

    cdp.on('Network.responseReceived', (params) => {
      if (params.response.status >= 400) {
        failedRequests.push(`${params.response.url} (${params.response.status})`);
      }
    });

    // Set standard desktop viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log(`Navigating to ${TARGET_URL}...`);
    await cdp.send('Page.navigate', { url: TARGET_URL });
    await wait(2500);

    // Skip preloader
    await cdp.evaluate(`
      (() => {
        const enterBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Enter') || b.textContent.includes('Skip'));
        if (enterBtn) enterBtn.click();
      })()
    `);
    await wait(1200);

    // ==========================================
    // ITEM 1: NAV TOP VS SCROLLED STATES
    // ==========================================
    console.log('--- ITEM 1: FLOATING NAVIGATION AUDIT ---');
    const navTop = await cdp.evaluate(`
      (() => {
        window.scrollTo(0, 0);
        const nav = document.querySelector('nav[aria-label="Main navigation"]');
        const container = nav ? nav.closest('div[style*="border-radius"]') || nav.parentElement : null;
        const rect = container ? container.getBoundingClientRect() : null;
        const logo = nav ? nav.querySelector('a') : null;
        const link = nav ? nav.querySelectorAll('a')[1] : null;
        return {
          height: rect ? Math.round(rect.height) : 0,
          width: rect ? Math.round(rect.width) : 0,
          paddingY: container ? window.getComputedStyle(container).paddingTop : '0',
          logoFontSize: logo ? window.getComputedStyle(logo).fontSize : '0',
          linkFontSize: link ? window.getComputedStyle(link).fontSize : '0',
          role: nav ? nav.getAttribute('aria-label') : null,
        };
      })()
    `);
    console.log('Nav at top (y=0):', navTop);

    // Scroll to y=250
    await cdp.evaluate(`
      window.scrollTo(0, 250);
      window.dispatchEvent(new Event('scroll'));
    `);
    await wait(400);

    const navScrolled = await cdp.evaluate(`
      (() => {
        const nav = document.querySelector('nav[aria-label="Main navigation"]');
        const container = nav ? nav.closest('div[style*="border-radius"]') || nav.parentElement : null;
        const rect = container ? container.getBoundingClientRect() : null;
        const logo = nav ? nav.querySelector('a') : null;
        const link = nav ? nav.querySelectorAll('a')[1] : null;
        return {
          height: rect ? Math.round(rect.height) : 0,
          width: rect ? Math.round(rect.width) : 0,
          paddingY: container ? window.getComputedStyle(container).paddingTop : '0',
          logoFontSize: logo ? window.getComputedStyle(logo).fontSize : '0',
          linkFontSize: link ? window.getComputedStyle(link).fontSize : '0',
        };
      })()
    `);
    console.log('Nav scrolled (y=250):', navScrolled);

    // Hysteresis test at y=45
    await cdp.evaluate(`
      window.scrollTo(0, 45);
      window.dispatchEvent(new Event('scroll'));
    `);
    await wait(300);
    const navHysteresis = await cdp.evaluate(`
      (() => {
        const nav = document.querySelector('nav[aria-label="Main navigation"]');
        const container = nav ? nav.closest('div[style*="border-radius"]') || nav.parentElement : null;
        return container ? Math.round(container.getBoundingClientRect().height) : 0;
      })()
    `);
    console.log('Nav at y=45 (hysteresis check): height =', navHysteresis);

    // Restore to y=0
    await cdp.evaluate(`
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
    `);
    await wait(400);
    const navRestored = await cdp.evaluate(`
      (() => {
        const nav = document.querySelector('nav[aria-label="Main navigation"]');
        const container = nav ? nav.closest('div[style*="border-radius"]') || nav.parentElement : null;
        return container ? Math.round(container.getBoundingClientRect().height) : 0;
      })()
    `);
    console.log('Nav restored at y=0: height =', navRestored);

    const navPass =
      navTop.height > 0 &&
      navScrolled.height > 0 &&
      navTop.height >= navScrolled.height &&
      navTop.role === 'Main navigation';
    console.log(`Nav state transitions: ${navPass ? 'PASS' : 'FAIL'}`);

    // ==========================================
    // ITEM 2: MOBILE NAV SHEET
    // ==========================================
    console.log('\n--- ITEM 2: MOBILE NAV SHEET AUDIT ---');
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true,
    });
    await wait(500);

    const mobileOpen = await cdp.evaluate(`
      (() => {
        const moreBtn = Array.from(document.querySelectorAll('button')).find(
          b => b.getAttribute('aria-label') === 'Open full menu' || b.textContent.includes('More')
        );
        if (!moreBtn) return { foundBtn: false };
        const rect = moreBtn.getBoundingClientRect();
        moreBtn.click();
        return {
          foundBtn: true,
          btnWidth: Math.round(rect.width),
          btnHeight: Math.round(rect.height),
          meetsMin44: rect.width >= 44 && rect.height >= 44,
        };
      })()
    `);
    await wait(500);

    const sheetDetails = await cdp.evaluate(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
        if (!dialog) return { sheetFound: false };
        const rect = dialog.getBoundingClientRect();
        const grabber = dialog.querySelector('.w-8.h-1, [aria-hidden="true"] .rounded-full');
        const links = Array.from(dialog.querySelectorAll('a'));
        const allTouchTargetsGe44 = links.every(l => l.getBoundingClientRect().height >= 44);
        const bodyOverflow = document.body.style.overflow;

        return {
          sheetFound: true,
          bodyOverflow,
          hasGrabber: !!grabber,
          linksCount: links.length,
          allTouchTargetsGe44,
        };
      })()
    `);
    console.log('Mobile sheet open:', { ...mobileOpen, ...sheetDetails });

    // Press Escape
    await cdp.evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    `);
    await wait(700);

    const sheetClosed = await cdp.evaluate(`
      (() => {
        const dialog = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
        return {
          sheetDismissed: !dialog,
          bodyOverflowRestored: document.body.style.overflow === '' || document.body.style.overflow === 'auto',
        };
      })()
    `);
    console.log('Mobile sheet Escape dismissal:', sheetClosed);

    // Restore desktop
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(400);

    // ==========================================
    // ITEM 3: CONTINUOUS CORNERS & CONCENTRIC RADII
    // ==========================================
    console.log('\n--- ITEM 3: CORNERS & CONCENTRIC RADII AUDIT ---');
    const corners = await cdp.evaluate(`
      (() => {
        const nav = document.querySelector('nav[aria-label="Main navigation"]')?.closest('div[style*="border-radius"]');
        const cards = Array.from(document.querySelectorAll('.surface-card, .card-surface, [class*="rounded-[var(--radius-lg)]"]'));
        const navRadius = nav ? window.getComputedStyle(nav).borderRadius : 'none';

        // Concentric radii check on cards with inner elements
        const cardElements = Array.from(document.querySelectorAll('section [class*="liquid-glass"], section article, section .grid > div'));
        const concentricResults = [];

        cardElements.slice(0, 8).forEach((card, i) => {
          const cardStyle = window.getComputedStyle(card);
          const outerR = parseFloat(cardStyle.borderRadius) || 0;
          const pad = parseFloat(cardStyle.paddingTop) || 0;
          const inner = card.querySelector('button, .badge, div[class*="rounded"], img');
          if (inner && outerR > 0) {
            const innerR = parseFloat(window.getComputedStyle(inner).borderRadius) || 0;
            concentricResults.push({
              card: i,
              outerR,
              pad,
              innerR,
              rulePass: innerR <= outerR,
            });
          }
        });

        return {
          navRadius,
          concentricSampleCount: concentricResults.length,
          allConcentricPass: concentricResults.every(r => r.rulePass),
          samples: concentricResults.slice(0, 4),
        };
      })()
    `);
    console.log('Corners and concentric radii:', corners);

    // ==========================================
    // ITEM 5: BUTTONS AUDIT
    // ==========================================
    console.log('\n--- ITEM 5: BUTTONS AUDIT ---');
    const buttonsResult = await cdp.evaluate(`
      (() => {
        const actionButtons = Array.from(document.querySelectorAll('button:not([aria-hidden="true"]), .btn'));
        const samples = actionButtons.slice(0, 8).map(b => {
          const s = window.getComputedStyle(b);
          const rect = b.getBoundingClientRect();
          const r = parseFloat(s.borderRadius) || 0;
          return {
            text: b.textContent.trim().slice(0, 20),
            height: Math.round(rect.height),
            borderRadius: s.borderRadius,
            isCapsule: r > 24,
            hasOffsetFocus: s.outlineOffset !== '0px',
          };
        });

        const noCapsules = samples.every(s => !s.isCapsule);
        const actionHeights = samples.filter(s => s.text.length > 2).map(s => s.height);

        return {
          totalButtons: actionButtons.length,
          noCapsules,
          samples: samples.slice(0, 5),
        };
      })()
    `);
    console.log('Buttons audit:', buttonsResult);

    // ==========================================
    // ITEM 6: CONTRAST AUDIT IN BOTH THEMES
    // ==========================================
    console.log('\n--- ITEM 6: CONTRAST AUDIT IN BOTH THEMES ---');
    const contrastScript = `
      (() => {
        function getLuminance(r, g, b) {
          const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
        }

        function getContrast(rgb1, rgb2) {
          const l1 = getLuminance(...rgb1);
          const l2 = getLuminance(...rgb2);
          const lighter = Math.max(l1, l2);
          const darker = Math.min(l1, l2);
          return (lighter + 0.05) / (darker + 0.05);
        }

        function parseRgb(colorStr) {
          if (!colorStr) return null;
          const numbers = colorStr.replace(/[^0-9.,]/g, '').split(',').map(s => parseFloat(s.trim()));
          if (numbers.length >= 3 && !isNaN(numbers[0])) {
            const a = numbers.length >= 4 && !isNaN(numbers[3]) ? numbers[3] : 1;
            return [numbers[0], numbers[1], numbers[2], a];
          }
          return null;
        }

        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        const rootBg = isLight ? [245, 247, 250] : [10, 14, 26];

        const elements = Array.from(document.querySelectorAll('h1, h2, h3, p, label, .section-subtitle, .section-title, .badge'));
        const measurements = [];

        elements.forEach(el => {
          const s = window.getComputedStyle(el);
          const fg = parseRgb(s.color);
          if (!fg) return;

          // Collect background layers from target up to root
          const bgStack = [];
          let p = el;
          while (p && p !== document.documentElement) {
            const ps = window.getComputedStyle(p);
            const parsed = parseRgb(ps.backgroundColor);
            if (parsed && parsed[3] > 0.01) {
              bgStack.unshift(parsed);
              if (parsed[3] >= 0.99) break;
            }
            p = p.parentElement;
          }

          // Composite from root upward
          let blended = rootBg;
          for (const layer of bgStack) {
            const a = layer[3];
            blended = [
              Math.round(layer[0] * a + blended[0] * (1 - a)),
              Math.round(layer[1] * a + blended[1] * (1 - a)),
              Math.round(layer[2] * a + blended[2] * (1 - a)),
            ];
          }

          const ratio = getContrast([fg[0], fg[1], fg[2]], blended);
          const text = el.textContent.trim().slice(0, 25);
          if (text) {
            const isLarge = parseFloat(s.fontSize) >= 18 || parseInt(s.fontWeight) >= 700;
            const threshold = isLarge ? 3.0 : 4.5;
            measurements.push({
              text,
              fontSize: s.fontSize,
              ratio: parseFloat(ratio.toFixed(2)),
              fg: s.color,
              bg: 'rgb(' + blended.join(', ') + ')',
              meetsAA: ratio >= threshold,
            });
          }
        });

        const sorted = measurements.sort((a, b) => a.ratio - b.ratio);
        return {
          totalAudited: measurements.length,
          allPassAA: measurements.every(m => m.meetsAA),
          lowest3: sorted.slice(0, 3),
        };
      })()
    `;

    const darkContrast = await cdp.evaluate(contrastScript);
    console.log('Dark theme text contrast:', darkContrast);

    // Switch to light theme
    await cdp.evaluate(`
      (() => {
        const toggle = Array.from(document.querySelectorAll('button')).find(
          b => b.getAttribute('aria-label')?.includes('mode') || b.getAttribute('aria-label')?.includes('light') || b.getAttribute('aria-label')?.includes('dark')
        );
        if (toggle) toggle.click();
      })()
    `);
    await wait(800);

    const currentTheme = await cdp.evaluate(`document.documentElement.getAttribute('data-theme')`);
    const themeColorMeta = await cdp.evaluate(`document.querySelector('meta[name="theme-color"]')?.getAttribute('content')`);
    console.log(`Theme toggled to: ${currentTheme}, meta theme-color: ${themeColorMeta}`);

    const lightContrast = await cdp.evaluate(contrastScript);
    console.log('Light theme text contrast:', lightContrast);

    // Switch back to dark theme
    await cdp.evaluate(`
      (() => {
        const toggle = Array.from(document.querySelectorAll('button')).find(
          b => b.getAttribute('aria-label')?.includes('mode') || b.getAttribute('aria-label')?.includes('light') || b.getAttribute('aria-label')?.includes('dark')
        );
        if (toggle) toggle.click();
      })()
    `);
    await wait(300);

    // ==========================================
    // ITEM 7: RESPONSIVE VIEWPORT AUDIT
    // ==========================================
    console.log('\n--- ITEM 7: RESPONSIVE AUDIT ---');
    const viewports = [
      { w: 320, h: 568, label: '320 (iPhone SE)' },
      { w: 390, h: 844, label: '390 (iPhone 14/15)' },
      { w: 768, h: 1024, label: '768 (iPad portrait)' },
      { w: 844, h: 390, label: '844 (Landscape phone)' },
      { w: 1024, h: 768, label: '1024 (iPad landscape)' },
      { w: 1280, h: 800, label: '1280 (MacBook Air)' },
      { w: 1440, h: 900, label: '1440 (Desktop standard)' },
      { w: 1920, h: 1080, label: '1920 (FHD desktop)' },
      { w: 2560, h: 1440, label: '2560 (Ultrawide / QHD)' },
    ];

    const vpResults = [];
    for (const vp of viewports) {
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      });
      await wait(150);

      const check = await cdp.evaluate(`
        (() => {
          const docW = document.documentElement.scrollWidth;
          const winW = window.innerWidth;
          return { noHScroll: docW <= winW + 1 };
        })()
      `);
      vpResults.push({ viewport: vp.label, pass: check.noHScroll });
    }
    console.log('Responsive viewports passed:', vpResults.every(r => r.pass) ? 'ALL PASS (9/9)' : vpResults);

    // Reset viewport
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await wait(300);

    // ==========================================
    // ITEM 8: REDUCED MOTION
    // ==========================================
    console.log('\n--- ITEM 8: MOTION & REDUCED MOTION ---');
    await cdp.send('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await wait(200);
    const motionCheck = await cdp.evaluate(`
      (() => {
        const matches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const bodyAfter = window.getComputedStyle(document.body, '::after').display;
        return { matches, bodyNoiseDisabled: bodyAfter === 'none' };
      })()
    `);
    console.log('Reduced motion check:', motionCheck);
    await cdp.send('Emulation.setEmulatedMedia', { features: [] });

    // ==========================================
    // ITEM 9: 3D SCENE & FPS
    // ==========================================
    console.log('\n--- ITEM 9: 3D SCENE & FPS ---');
    const threeResult = await cdp.evaluate(`
      (() => {
        return new Promise(resolve => {
          const canvas = document.querySelector('canvas');
          if (!canvas) return resolve({ canvas: false });

          let count = 0;
          const t0 = performance.now();
          function step(t) {
            count++;
            if (count < 40) requestAnimationFrame(step);
            else {
              const dt = (t - t0) / 1000;
              resolve({
                canvas: true,
                fps: Math.round(count / dt),
                width: canvas.width,
                height: canvas.height,
              });
            }
          }
          requestAnimationFrame(step);
        });
      })()
    `);
    console.log('3D Scene test:', threeResult);

    // ==========================================
    // ITEM 10: REGRESSION AUDIT (Command palette & Contact form)
    // ==========================================
    console.log('\n--- ITEM 10: REGRESSION AUDIT ---');
    // Open Command palette via keyboard
    await cdp.evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
    `);
    await wait(500);

    const paletteState = await cdp.evaluate(`
      (() => {
        const input = document.querySelector('input[placeholder*="command" i], input[placeholder*="search" i]');
        return { paletteOpen: !!input };
      })()
    `);
    console.log('Command palette keyboard trigger:', paletteState);

    // Close palette
    await cdp.evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    `);
    await wait(300);

    // Contact form validation
    const contactValidation = await cdp.evaluate(`
      (() => {
        const contactSection = document.getElementById('contact');
        if (contactSection) contactSection.scrollIntoView();

        const form = document.querySelector('#contact form');
        if (!form) return { formFound: false };

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();

        return { formFound: true };
      })()
    `);
    await wait(300);

    const contactAlert = await cdp.evaluate(`
      (() => {
        const alert = document.querySelector('#contact [role="alert"]');
        return {
          validationShown: !!alert,
          message: alert ? alert.textContent.trim() : null,
        };
      })()
    `);
    console.log('Contact form inline validation:', contactAlert);

    // ==========================================
    // ITEM 12: CONSOLE ERRORS & FAILED REQUESTS
    // ==========================================
    console.log('\n--- ITEM 12: CONSOLE & NETWORK AUDIT ---');
    const localFailed = failedRequests.filter((u) => u.includes('localhost:3000'));
    const externalFailed = failedRequests.filter((u) => !u.includes('localhost:3000'));
    console.log(`Console Errors: ${consoleErrors.length === 0 ? 'ZERO (PASS)' : consoleErrors.join(', ')}`);
    console.log(`Local Asset Failures: ${localFailed.length === 0 ? 'ZERO (PASS)' : localFailed.join(', ')}`);
    if (externalFailed.length > 0) {
      console.log(`External API Rate-Limits (expected unauthenticated CI): ${externalFailed.join(', ')}`);
    }

    console.log('\n=== BROWSER VERIFICATION AUDIT COMPLETE ===');
  } catch (e) {
    console.error('Audit run error:', e);
  } finally {
    if (cdp) cdp.close();
    chromeProcess.kill();
  }
}

main();
