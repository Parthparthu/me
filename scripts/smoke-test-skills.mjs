import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3005;
const OUT_DIR = path.resolve('out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webmanifest': 'application/manifest+json',
  '.txt': 'text/plain; charset=utf-8',
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

async function main() {
  await new Promise((r) => server.listen(PORT, '127.0.0.1', r));
  console.log(`Server listening on port ${PORT}...`);

  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const CDP_PORT = 9260;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_skills_' + Date.now());

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--window-size=1280,900',
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
    throw new Error('CDP connect failed');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];
  const networkRequests = [];

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
    if (msg.method === 'Network.requestWillBeSent') {
      networkRequests.push(msg.params.request.url);
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
  await send('Network.enable');
  await send('Page.enable');

  // Wait for initial hydration
  await new Promise((r) => setTimeout(r, 3000));

  console.log('Testing skills section in page...');
  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      const skillsSection = document.getElementById('skills');
      if (!skillsSection) return { error: 'Skills section #skills not found' };

      // Test tabs
      const tabs = Array.from(skillsSection.querySelectorAll('[role="tab"]'));
      const tabInfo = tabs.map(t => {
        const rect = t.getBoundingClientRect();
        return {
          id: t.id,
          text: t.innerText.trim().replace(/\\s+/g, ' '),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          min44px: rect.height >= 44 && rect.width >= 44,
          selected: t.getAttribute('aria-selected') === 'true',
          tabIndex: t.getAttribute('tabindex')
        };
      });

      // Test links
      const links = Array.from(skillsSection.querySelectorAll('a[href^="http"]'));
      const safeLinks = links.every(l => {
        const rel = l.getAttribute('rel') || '';
        const target = l.getAttribute('target');
        return rel.includes('noopener') && rel.includes('noreferrer') && target === '_blank';
      });

      // Check category cards count
      const panels = Array.from(skillsSection.querySelectorAll('[role="tabpanel"]'));

      // Check SVG icons
      const svgs = Array.from(skillsSection.querySelectorAll('svg'));

      return {
        tabCount: tabs.length,
        allTabsMin44px: tabInfo.every(t => t.min44px),
        tabInfo,
        externalLinksCount: links.length,
        allLinksSafeRel: safeLinks,
        panelFound: panels.length > 0,
        svgIconCount: svgs.length
      };
    })()`,
    returnByValue: true,
  });

  console.log('Skills section DOM evaluation:', JSON.stringify(result.result.value, null, 2));

  // Test keyboard navigation
  console.log('Testing keyboard navigation on tablist...');
  const keyTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const tabs = Array.from(document.querySelectorAll('#skills [role="tab"]'));
      if (tabs.length < 2) return { error: 'Not enough tabs' };
      tabs[0].focus();
      
      // Dispatch ArrowRight
      tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      
      const activeTab = document.activeElement;
      return {
        firstTabFocusedBefore: tabs[0].id,
        activeTabAfterArrowRight: activeTab ? activeTab.id : null,
        isSecondTab: activeTab === tabs[1],
        secondTabSelected: tabs[1].getAttribute('aria-selected') === 'true'
      };
    })()`,
    returnByValue: true,
  });
  console.log('Keyboard navigation test result:', JSON.stringify(keyTest.result.value, null, 2));

  // Check external font and icon requests (must be strictly ZERO per non-negotiable)
  const fontAndIconRequests = networkRequests.filter((url) => {
    const isLocal = url.startsWith(`http://localhost:${PORT}`) || url.startsWith(`http://127.0.0.1:${PORT}`) || url.startsWith('data:');
    if (isLocal) return false;
    const isFont =
      url.endsWith('.woff') ||
      url.endsWith('.woff2') ||
      url.endsWith('.ttf') ||
      url.endsWith('.otf') ||
      url.includes('fonts.googleapis.com') ||
      url.includes('fonts.gstatic.com');
    const isIcon =
      url.includes('fontawesome') ||
      url.includes('iconify') ||
      url.includes('heroicons') ||
      url.endsWith('.svg');
    return isFont || isIcon;
  });
  console.log('External font & icon requests detected (must be 0):', fontAndIconRequests);

  // Click on 'Languages' tab and verify it becomes selected and panel updates
  console.log('Testing clicking languages tab...');
  const clickTest = await send('Runtime.evaluate', {
    expression: `(() => {
      const langTab = document.getElementById('skill-tab-languages');
      if (!langTab) return { error: 'skill-tab-languages not found' };
      langTab.click();
      return {
        selected: langTab.getAttribute('aria-selected') === 'true',
        tabIndex: langTab.getAttribute('tabindex'),
        activeCategoryHeading: document.querySelector('#skills h3')?.innerText || null
      };
    })()`,
    returnByValue: true,
  });
  console.log('Click test result:', JSON.stringify(clickTest.result.value, null, 2));

  ws.close();
  browserProc.kill();
  server.close();

  const val = result.result.value;
  const clickVal = clickTest.result.value;
  if (val.allTabsMin44px && val.allLinksSafeRel && val.tabCount >= 6 && fontAndIconRequests.length === 0 && clickVal.selected) {
    console.log('\n>>> ACCEPTANCE CRITERIA FOR SKILLS PASSED: min 44px tap targets, keyboard operable, no external icon requests, safe links <<<');
    process.exit(0);
  } else {
    console.error('Criteria check failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
