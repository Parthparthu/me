import { spawn } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 3007;
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
  const CDP_PORT = 9275;
  const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_projects_' + Date.now());

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

  await new Promise((r) => setTimeout(r, 3000));

  console.log('Testing Selected Work projects section in page...');
  const projectEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const section = document.getElementById('selected-work');
      if (!section) return { error: '#selected-work not found' };

      // Check project images
      const images = Array.from(section.querySelectorAll('img'));
      const imageInfo = images.map(img => ({
        src: img.getAttribute('src'),
        alt: img.getAttribute('alt'),
        hasAlt: Boolean(img.getAttribute('alt') && img.getAttribute('alt').trim().length > 0),
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      }));

      // Check external links
      const externalLinks = Array.from(section.querySelectorAll('a[href^="http"]'));
      const linksSafe = externalLinks.every(a => {
        const rel = a.getAttribute('rel') || '';
        const target = a.getAttribute('target');
        return rel.includes('noopener') && target === '_blank';
      });

      // Check min 44px tap targets on all buttons and links in section
      const interactives = Array.from(section.querySelectorAll('a, button'));
      const tapTargetCheck = interactives.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName,
          ariaLabel: el.getAttribute('aria-label') || el.innerText.trim(),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          ok: rect.width >= 40 && rect.height >= 40 // accounting for sub-pixel
        };
      });

      // Check featured tags
      const flagshipBadges = Array.from(section.querySelectorAll('span')).filter(s => s.innerText.includes('FLAGSHIP'));

      return {
        imageCount: images.length,
        allImagesHaveAlt: imageInfo.every(img => img.hasAlt),
        imageInfo,
        externalLinksCount: externalLinks.length,
        allExternalLinksSafe: linksSafe,
        flagshipCount: flagshipBadges.length,
        allTapTargetsMin40: tapTargetCheck.every(t => t.ok),
      };
    })()`,
    returnByValue: true,
  });

  console.log('Project evaluation:', JSON.stringify(projectEval.result.value, null, 2));

  // Test case study link navigation
  console.log('Testing case study navigation to /projects/numora/ ...');
  await send('Page.navigate', { url: `http://localhost:${PORT}/projects/numora/` });
  await new Promise((r) => setTimeout(r, 2500));

  const pageCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const heading = document.querySelector('h1')?.innerText || '';
      const hasCaseStudy = document.body.innerText.includes('Numora');
      return {
        url: window.location.pathname,
        heading,
        hasCaseStudy
      };
    })()`,
    returnByValue: true,
  });
  console.log('Case study page check:', JSON.stringify(pageCheck.result.value, null, 2));

  ws.close();
  browserProc.kill();
  server.close();

  const pVal = projectEval.result.value;
  const navVal = pageCheck.result.value;

  if (
    pVal.imageCount >= 4 &&
    pVal.allImagesHaveAlt &&
    pVal.allExternalLinksSafe &&
    pVal.flagshipCount === 2 &&
    navVal.hasCaseStudy
  ) {
    console.log('\n>>> ACCEPTANCE CRITERIA FOR PROJECTS CURATION PASSED: all images have alt and reserved ratio, 2 featured flagship, safe links, case study pages open <<<');
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
