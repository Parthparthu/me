import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 3000;
const CDP_PORT = 9260;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  let filePath = path.join(OUT_DIR, reqPath);
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) filePath += '.html';
  else if (!fs.existsSync(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) filePath = path.join(filePath, 'index.html');

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404');
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

async function runAudit() {
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log(`Static server running at http://localhost:${PORT}`);

  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_full_audit_' + Date.now());
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--window-size=1440,900',
    `http://localhost:${PORT}/`,
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.url.includes('localhost'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    browserProc.kill();
    server.close();
    throw new Error('CDP connection failed');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
      consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
    }
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

  console.log('Page loaded. Waiting for 3D scene & hydration...');
  await new Promise((r) => setTimeout(r, 3500));

  const results = {};

  // 1. Check Console Errors
  results.consoleErrors = consoleErrors;

  // 2. Check for Emoji, Em Dashes, and Pill Buttons in Dark Mode
  const domAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        // Regex for emojis
        const emojiRegex = /(\\p{Extended_Pictographic}|[\\u{1F300}-\\u{1F5FF}]|[\\u{1F600}-\\u{1F64F}]|[\\u{1F680}-\\u{1F6FF}]|[\\u{2600}-\\u{26FF}]|[\\u{2700}-\\u{27BF}])/u;
        const emDashRegex = /\\u2014|&mdash;|—/;

        const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const emojiFindings = [];
        const emDashFindings = [];

        let node;
        while ((node = textWalker.nextNode())) {
          const val = node.nodeValue;
          if (emojiRegex.test(val)) {
            emojiFindings.push({ text: val.trim().slice(0, 80), parent: node.parentElement?.tagName });
          }
          if (emDashRegex.test(val)) {
            emDashFindings.push({ text: val.trim().slice(0, 80), parent: node.parentElement?.tagName });
          }
        }

        // Check attributes (title, alt, aria-label)
        const allElements = document.querySelectorAll('*');
        allElements.forEach((el) => {
          ['title', 'alt', 'aria-label', 'placeholder'].forEach((attr) => {
            const val = el.getAttribute(attr);
            if (val) {
              if (emojiRegex.test(val)) {
                emojiFindings.push({ attr, text: val.slice(0, 80), tag: el.tagName });
              }
              if (emDashRegex.test(val)) {
                emDashFindings.push({ attr, text: val.slice(0, 80), tag: el.tagName });
              }
            }
          });
        });

        // Check pill buttons (border-radius >= height/2)
        const buttons = Array.from(document.querySelectorAll('button, a[role="button"], .btn'));
        const pillButtons = [];
        buttons.forEach((b) => {
          const style = window.getComputedStyle(b);
          const r = parseFloat(style.borderRadius) || 0;
          const h = b.offsetHeight;
          if (h > 0 && r >= h / 2 - 1) {
            pillButtons.push({
              tag: b.tagName,
              text: b.textContent?.trim().slice(0, 30),
              radius: style.borderRadius,
              height: h,
              className: b.className.slice(0, 60),
            });
          }
        });

        // Check tap targets < 44px
        const interactiveElements = Array.from(document.querySelectorAll('a, button, input, select, textarea'));
        const smallTargets = [];
        interactiveElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && (rect.width < 40 || rect.height < 40)) {
            // Check if hidden or part of inline text
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
              smallTargets.push({
                tag: el.tagName,
                text: el.textContent?.trim().slice(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                id: el.id,
                className: el.className.slice(0, 50),
              });
            }
          }
        });

        // Check purple / magenta / violet colors
        const purpleHits = [];
        const colorRegex = /(rgba?\\(\\s*\\d+\\s*,\\s*\\d+\\s*,\\s*\\d+)|(#[0-9a-fA-F]{3,8})/g;
        allElements.forEach((el) => {
          const style = window.getComputedStyle(el);
          const colorProps = [style.color, style.backgroundColor, style.borderColor];
          colorProps.forEach((c) => {
            const m = c && c.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/);
            if (m) {
              const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
              // Check if purple/violet/magenta hue: high R and B, low G (e.g. R>100, B>100, G<min(R,B)*0.7)
              if (r > 120 && b > 140 && g < Math.min(r, b) * 0.7) {
                purpleHits.push({ tag: el.tagName, color: c, text: el.textContent?.trim().slice(0, 30) });
              }
            }
          });
        });

        // Sections found
        const sections = Array.from(document.querySelectorAll('section, [id]')).filter(el => ['hero', 'about', 'skills', 'work', 'projects', 'experience', 'journey', 'achievements', 'contact'].includes(el.id)).map(el => el.id);

        return {
          emojiFindings,
          emDashFindings,
          pillButtons,
          smallTargets: smallTargets.slice(0, 10),
          purpleHits: purpleHits.slice(0, 10),
          sections,
        };
      })()
    `,
    returnByValue: true,
  });

  results.domAudit = domAudit.result.value;

  // 3. Scroll to test Parallax offsets
  console.log('Testing parallax scroll at scrollY = 0, 300, 800, 1500...');
  const parallaxPoints = [];
  for (const targetY of [0, 300, 800, 1500]) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${targetY});` });
    await new Promise((r) => setTimeout(r, 600));
    const sample = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const hero = document.getElementById('hero');
          const heroLayers = hero ? Array.from(hero.children).map(c => ({
            tag: c.tagName,
            className: c.className.slice(0, 40),
            transform: window.getComputedStyle(c).transform,
          })) : [];

          // Projects section cards
          const workSection = document.getElementById('work') || document.getElementById('projects');
          const cards = workSection ? Array.from(workSection.querySelectorAll('.glass-card, article, [data-project-card]')).slice(0, 4).map(c => ({
            transform: window.getComputedStyle(c).transform,
            top: c.getBoundingClientRect().top
          })) : [];

          return { scrollY: window.scrollY, heroLayers, cards };
        })()
      `,
      returnByValue: true,
    });
    parallaxPoints.push(sample.result.value);
  }
  results.parallaxPoints = parallaxPoints;

  // 4. Test Mobile Viewport (375x667)
  console.log('Testing mobile viewport (375x667)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise((r) => setTimeout(r, 1000));
  const mobileAudit = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const hasHorizontalScroll = document.documentElement.scrollWidth > window.innerWidth;
        const nav = document.querySelector('nav, header');
        const navRect = nav ? nav.getBoundingClientRect() : null;
        return {
          innerWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          hasHorizontalScroll,
          navVisible: navRect ? navRect.height > 0 : false,
        };
      })()
    `,
    returnByValue: true,
  });
  results.mobileAudit = mobileAudit.result.value;

  console.log('\n=== AUDIT RESULTS SUMMARY ===');
  console.log('Console Errors:', results.consoleErrors.length);
  if (results.consoleErrors.length > 0) {
    console.log(results.consoleErrors);
  }
  console.log('Emoji Findings:', results.domAudit.emojiFindings.length);
  if (results.domAudit.emojiFindings.length > 0) {
    console.log('Sample Emojis:', results.domAudit.emojiFindings);
  }
  console.log('Em Dash Findings:', results.domAudit.emDashFindings.length);
  if (results.domAudit.emDashFindings.length > 0) {
    console.log('Sample Em Dashes:', results.domAudit.emDashFindings);
  }
  console.log('Pill Buttons Found:', results.domAudit.pillButtons.length);
  if (results.domAudit.pillButtons.length > 0) {
    console.log('Sample Pill Buttons:', results.domAudit.pillButtons);
  }
  console.log('Purple Hues Found:', results.domAudit.purpleHits.length);
  if (results.domAudit.purpleHits.length > 0) {
    console.log('Sample Purple Hues:', results.domAudit.purpleHits);
  }
  console.log('Small Targets (<40px):', results.domAudit.smallTargets.length);
  if (results.domAudit.smallTargets.length > 0) {
    console.log('Sample Small Targets:', results.domAudit.smallTargets);
  }
  console.log('Sections Detected:', results.domAudit.sections);
  console.log('Mobile Horizontal Scroll:', results.mobileAudit.hasHorizontalScroll);
  console.log('Parallax Points Captured:', results.parallaxPoints.length);

  ws.close();
  browserProc.kill();
  server.close();

  fs.writeFileSync('audit-raw-results.json', JSON.stringify(results, null, 2));
}

runAudit().catch((err) => {
  console.error('Audit failed:', err);
  process.exit(1);
});
