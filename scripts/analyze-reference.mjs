import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 9235;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_reference_analysis_' + Date.now());

async function inspectReference(width, height, isMobile) {
  console.log(`Launching browser for width=${width}, height=${height}...`);
  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    `--window-size=${width},${height}`,
    'https://3d-portfolio-rouge-seven.vercel.app/',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const list = await res.json();
      const page = list.find((t) => t.type === 'page' && t.url.includes('3d-portfolio'));
      if (page && page.webSocketDebuggerUrl) {
        wsUrl = page.webSocketDebuggerUrl;
        break;
      }
    } catch {}
  }

  if (!wsUrl) {
    browserProc.kill();
    throw new Error('Failed to find page or connect to CDP');
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

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    } catch (e) {
      console.error(e);
    }
  };

  await new Promise((r) => (ws.onopen = r));
  console.log('Connected to CDP. Waiting for load and hydration...');
  await new Promise((r) => setTimeout(r, 5000));

  // Extract DOM elements, styles, computed colors
  const evalResult = await send('Runtime.evaluate', {
    expression: `
      (() => {
        function rgbToHex(rgb) {
          if (!rgb) return rgb;
          if (rgb.startsWith('#')) return rgb;
          const match = rgb.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
          if (!match) return rgb;
          const r = parseInt(match[1]).toString(16).padStart(2, '0');
          const g = parseInt(match[2]).toString(16).padStart(2, '0');
          const b = parseInt(match[3]).toString(16).padStart(2, '0');
          const a = match[4] !== undefined ? Math.round(parseFloat(match[4]) * 255).toString(16).padStart(2, '0') : '';
          return '#' + r + g + b + (a ? ' (' + match[4] + ' alpha)' : '');
        }

        const body = document.body;
        const bodyStyle = window.getComputedStyle(body);

        const sections = Array.from(document.querySelectorAll('section, main, header, footer, div[id]')).map(el => {
          const style = window.getComputedStyle(el);
          return {
            id: el.id || el.tagName.toLowerCase(),
            tag: el.tagName.toLowerCase(),
            className: el.className ? String(el.className).slice(0, 100) : '',
            bg: rgbToHex(style.backgroundColor),
            color: rgbToHex(style.color),
            borderColor: rgbToHex(style.borderColor),
            boxShadow: style.boxShadow,
          };
        });

        // Sample key elements
        const sampledElements = [];
        const selectors = [
          'body',
          'header',
          'nav',
          'section',
          'button',
          'a',
          'card',
          '[class*="card"]',
          '[class*="bg-"]',
          '[class*="text-"]',
          'canvas',
          'h1', 'h2', 'h3', 'p'
        ];

        for (const sel of selectors) {
          const el = document.querySelector(sel);
          if (el) {
            const cs = window.getComputedStyle(el);
            sampledElements.push({
              selector: sel,
              bg: rgbToHex(cs.backgroundColor),
              color: rgbToHex(cs.color),
              borderColor: rgbToHex(cs.borderColor),
              borderWidth: cs.borderWidth,
              boxShadow: cs.boxShadow,
              backgroundImage: cs.backgroundImage.slice(0, 150),
            });
          }
        }

        // Check for canvases and 3D
        const canvases = document.querySelectorAll('canvas').length;

        // Check for scroll/parallax indicators
        const hasFramerMotion = !!document.querySelector('[data-projection-id]');

        // Headings text
        const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
          tag: h.tagName,
          text: h.textContent.trim().slice(0, 100),
          color: rgbToHex(window.getComputedStyle(h).color)
        }));

        return {
          title: document.title,
          bodyBg: rgbToHex(bodyStyle.backgroundColor),
          bodyColor: rgbToHex(bodyStyle.color),
          canvases,
          hasFramerMotion,
          headings,
          sampledElements,
          sections: sections.slice(0, 20),
          scrollY: window.scrollY,
        };
      })()
    `,
    returnByValue: true,
  });

  // Now perform a scroll test to check parallax
  await send('Runtime.evaluate', {
    expression: 'window.scrollTo(0, 500);',
  });
  await new Promise((r) => setTimeout(r, 1000));

  const scrollCheck = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const transformedElements = Array.from(document.querySelectorAll('*')).filter(el => {
          const t = window.getComputedStyle(el).transform;
          return t && t !== 'none';
        }).map(el => ({
          tag: el.tagName,
          id: el.id,
          className: String(el.className).slice(0, 60),
          transform: window.getComputedStyle(el).transform
        }));

        return {
          scrollPos: window.scrollY,
          transformedCount: transformedElements.length,
          transformedSamples: transformedElements.slice(0, 10)
        };
      })()
    `,
    returnByValue: true,
  });

  ws.close();
  browserProc.kill();

  return {
    dimensions: { width, height, isMobile },
    data: evalResult.result ? evalResult.result.value : evalResult,
    scroll: scrollCheck.result ? scrollCheck.result.value : scrollCheck,
  };
}

async function main() {
  try {
    const desktop = await inspectReference(1920, 1080, false);
    console.log('DESKTOP RESULT:', JSON.stringify(desktop, null, 2));

    const mobile = await inspectReference(390, 844, true);
    console.log('MOBILE RESULT:', JSON.stringify(mobile, null, 2));

    fs.writeFileSync('scripts/reference-dump.json', JSON.stringify({ desktop, mobile }, null, 2));
    console.log('Saved to scripts/reference-dump.json');
  } catch (err) {
    console.error('Error analyzing reference:', err);
    process.exit(1);
  }
}

main();
