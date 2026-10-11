import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const PORT = 9230;
const USER_DATA = path.join(process.env.TEMP || 'C:\\temp', 'cdp_perf_baseline_' + Date.now());

async function runSession(profileName, options) {
  console.log(`\n============================================================`);
  console.log(`MEASURING PROFILE: ${profileName}`);
  console.log(`============================================================`);

  const browserProc = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA}`,
    '--no-first-run',
    '--enable-webgl',
    '--enable-gpu-rasterization',
    `--window-size=${options.width},${options.height}`,
    'about:blank',
  ], { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 200));
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
    throw new Error('Failed to connect to CDP');
  }

  const ws = new WebSocket(wsUrl);
  let id = 1;
  const callbacks = new Map();
  const eventListeners = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      callbacks.set(msgId, { resolve, reject });
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    if (msg.id && callbacks.has(msg.id)) {
      const { resolve, reject } = callbacks.get(msg.id);
      callbacks.delete(msg.id);
      if (msg.error) reject(msg.error);
      else resolve(msg.result);
    } else if (msg.method) {
      const listener = eventListeners.get(msg.method);
      if (listener) listener(msg.params);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Network.enable');

  if (options.cpuThrottling > 1) {
    await send('Emulation.setCPUThrottlingRate', { rate: options.cpuThrottling });
  }

  await send('Emulation.setDeviceMetricsOverride', {
    width: options.width,
    height: options.height,
    deviceScaleFactor: options.dpr || 1,
    mobile: options.mobile || false,
  });

  if (options.mobile) {
    await send('Network.setUserAgentOverride', {
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    });
  }

  // Track network resources
  const networkRequests = [];
  eventListeners.set('Network.responseReceived', (params) => {
    const { response } = params;
    networkRequests.push({
      url: response.url,
      mimeType: response.mimeType,
      encodedDataLength: response.encodedDataLength,
    });
  });

  // Inject WebGL interceptors and preloader bypass
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__webglStats = {
        drawCalls: 0,
        triangles: 0,
        renderTargets: new Set(),
        textures: new Set(),
        programs: new Set(),
        lastDrawCalls: 0,
        lastTriangles: 0,
        resetFrame() {
          this.lastDrawCalls = this.drawCalls;
          this.lastTriangles = this.triangles;
          this.drawCalls = 0;
          this.triangles = 0;
        }
      };

      try {
        const origDrawElements = WebGL2RenderingContext.prototype.drawElements;
        WebGL2RenderingContext.prototype.drawElements = function(mode, count, type, offset) {
          window.__webglStats.drawCalls++;
          if (mode === 4) window.__webglStats.triangles += count / 3;
          return origDrawElements.apply(this, arguments);
        };

        const origDrawArrays = WebGL2RenderingContext.prototype.drawArrays;
        WebGL2RenderingContext.prototype.drawArrays = function(mode, first, count) {
          window.__webglStats.drawCalls++;
          if (mode === 4) window.__webglStats.triangles += count / 3;
          return origDrawArrays.apply(this, arguments);
        };

        const origBindFramebuffer = WebGL2RenderingContext.prototype.bindFramebuffer;
        WebGL2RenderingContext.prototype.bindFramebuffer = function(target, fb) {
          if (fb) window.__webglStats.renderTargets.add(fb);
          return origBindFramebuffer.apply(this, arguments);
        };

        const origCreateProgram = WebGL2RenderingContext.prototype.createProgram;
        WebGL2RenderingContext.prototype.createProgram = function() {
          const p = origCreateProgram.apply(this, arguments);
          if (p) window.__webglStats.programs.add(p);
          return p;
        };

        const origCreateTexture = WebGL2RenderingContext.prototype.createTexture;
        WebGL2RenderingContext.prototype.createTexture = function() {
          const t = origCreateTexture.apply(this, arguments);
          if (t) window.__webglStats.textures.add(t);
          return t;
        };
      } catch (e) {}

      // Bypass preloader for consistent steady-state measurement
      sessionStorage.setItem('pradyumna_portfolio_preloader_seen', 'true');
    `,
  });

  // Navigate to site
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise((r) => setTimeout(r, 3500));

  // 1. Idle FPS and GPU metrics on hero
  console.log('Measuring Idle on Hero...');
  const heroMetrics = await send('Runtime.evaluate', {
    expression: `new Promise((resolve) => {
      let frames = 0;
      let start = performance.now();
      let dropped = 0;
      let maxFrameDelta = 0;
      let last = start;

      function tick(now) {
        frames++;
        const delta = now - last;
        if (delta > maxFrameDelta) maxFrameDelta = delta;
        if (delta > 33.33) dropped++;
        last = now;
        if (now - start >= 2000) {
          const duration = (now - start) / 1000;
          const fps = Math.round(frames / duration);
          window.__webglStats.resetFrame();
          // Sample one frame of WebGL
          requestAnimationFrame(() => {
            resolve({
              fps,
              dropped,
              maxFrameDelta: Math.round(maxFrameDelta),
              drawCalls: window.__webglStats.lastDrawCalls || window.__webglStats.drawCalls,
              triangles: Math.round(window.__webglStats.lastTriangles || window.__webglStats.triangles),
              renderTargetsCount: window.__webglStats.renderTargets.size,
              programsCount: window.__webglStats.programs.size,
              texturesCount: window.__webglStats.textures.size,
            });
          });
        } else {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  // 2. Trace full-page scroll
  console.log('Recording Trace during Full Page Scroll...');
  const traceEvents = [];
  eventListeners.set('Tracing.dataCollected', (params) => {
    if (params.value) traceEvents.push(...params.value);
  });

  let traceDonePromise = new Promise((resolve) => {
    eventListeners.set('Tracing.tracingComplete', resolve);
  });

  await send('Tracing.start', {
    traceConfig: {
      includedCategories: [
        'devtools.timeline',
        'v8.execute',
        'blink.user_timing',
        'latencyInfo',
      ],
    },
  });

  // Perform full-page scroll and measure FPS
  const scrollMetrics = await send('Runtime.evaluate', {
    expression: `new Promise(async (resolve) => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      let frames = 0;
      let dropped = 0;
      let maxFrameDelta = 0;
      let start = performance.now();
      let last = start;
      let running = true;

      function frame(now) {
        if (!running) return;
        frames++;
        const delta = now - last;
        if (delta > maxFrameDelta) maxFrameDelta = delta;
        if (delta > 33.33) dropped++;
        last = now;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      // Scroll smoothly down the entire page over 3 seconds
      const scrollStart = performance.now();
      const scrollDuration = 3000;

      while (performance.now() - scrollStart < scrollDuration) {
        const p = (performance.now() - scrollStart) / scrollDuration;
        const targetY = scrollHeight * p;
        window.scrollTo(0, targetY);
        await new Promise((r) => setTimeout(r, 16));
      }
      window.scrollTo(0, scrollHeight);
      await new Promise((r) => setTimeout(r, 400));

      running = false;
      const totalDuration = (performance.now() - start) / 1000;
      resolve({
        fps: Math.round(frames / totalDuration),
        dropped,
        maxFrameDelta: Math.round(maxFrameDelta),
        drawCalls: window.__webglStats.drawCalls,
        triangles: Math.round(window.__webglStats.triangles),
      });
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  await send('Tracing.end');
  await traceDonePromise;

  // Process trace events
  let scriptingTime = 0;
  let renderingTime = 0;
  let paintingTime = 0;
  let layoutCount = 0;
  let styleRecalcCount = 0;
  let longTasks = [];

  for (const evt of traceEvents) {
    const durMs = (evt.dur || 0) / 1000;
    const name = evt.name;

    if (durMs > 50) {
      longTasks.push({ name, durMs: Math.round(durMs) });
    }

    if (name === 'EvaluateScript' || name === 'FunctionCall' || name === 'v8.compile' || name === 'TimerFire') {
      scriptingTime += durMs;
    } else if (name === 'Layout' || name === 'UpdateLayoutTree' || name === 'RecalculateStyles') {
      renderingTime += durMs;
      if (name === 'Layout') layoutCount++;
      if (name === 'UpdateLayoutTree' || name === 'RecalculateStyles') styleRecalcCount++;
    } else if (name === 'Paint' || name === 'CompositeLayers' || name === 'RasterTask') {
      paintingTime += durMs;
    }
  }

  // 3. Hovering cards FPS
  console.log('Measuring Card Hover FPS...');
  const hoverMetrics = await send('Runtime.evaluate', {
    expression: `new Promise(async (resolve) => {
      // Scroll to SelectedWork
      const workEl = document.getElementById('selected-work') || document.getElementById('work');
      if (workEl) workEl.scrollIntoView();
      await new Promise((r) => setTimeout(r, 500));

      const cards = document.querySelectorAll('.perspective-1000, .liquid-glass');
      let frames = 0;
      let start = performance.now();
      let last = start;
      let dropped = 0;
      let maxFrameDelta = 0;
      let running = true;

      function frame(now) {
        if (!running) return;
        frames++;
        const delta = now - last;
        if (delta > maxFrameDelta) maxFrameDelta = delta;
        if (delta > 33.33) dropped++;
        last = now;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      // Simulate hovering back and forth across cards
      for (const card of Array.from(cards).slice(0, 3)) {
        const rect = card.getBoundingClientRect();
        card.dispatchEvent(new PointerEvent('pointerenter', { bubbles: true }));
        for (let i = 0; i < 15; i++) {
          card.dispatchEvent(new PointerEvent('pointermove', {
            bubbles: true,
            clientX: rect.left + (rect.width * i) / 15,
            clientY: rect.top + (rect.height * i) / 15,
          }));
          await new Promise((r) => setTimeout(r, 20));
        }
        card.dispatchEvent(new PointerEvent('pointerleave', { bubbles: true }));
      }

      running = false;
      const totalDuration = (performance.now() - start) / 1000;
      resolve({
        fps: Math.round(frames / totalDuration),
        dropped,
        maxFrameDelta: Math.round(maxFrameDelta),
      });
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  // 4. Opening and closing menus (Command Palette)
  console.log('Measuring Menu Open/Close FPS...');
  const menuMetrics = await send('Runtime.evaluate', {
    expression: `new Promise(async (resolve) => {
      let frames = 0;
      let start = performance.now();
      let last = start;
      let dropped = 0;
      let maxDelta = 0;
      let running = true;

      function frame(now) {
        if (!running) return;
        frames++;
        const delta = now - last;
        if (delta > maxDelta) maxDelta = delta;
        if (delta > 33.33) dropped++;
        last = now;
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      // Open palette
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));
      await new Promise((r) => setTimeout(r, 600));

      // Close palette
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await new Promise((r) => setTimeout(r, 600));

      running = false;
      const totalDuration = (performance.now() - start) / 1000;
      resolve({
        fps: Math.round(frames / totalDuration),
        dropped,
        maxFrameDelta: Math.round(maxDelta),
      });
    })`,
    awaitPromise: true,
    returnByValue: true,
  });

  // 5. Memory usage
  const perfMetrics = await send('Performance.getMetrics');
  const getMetric = (name) => {
    const m = perfMetrics.metrics.find((x) => x.name === name);
    return m ? m.value : 0;
  };
  const jsHeapUsedMB = Math.round((getMetric('JSHeapUsedSize') / (1024 * 1024)) * 10) / 10;
  const jsHeapTotalMB = Math.round((getMetric('JSHeapTotalSize') / (1024 * 1024)) * 10) / 10;
  const domNodes = getMetric('Nodes');

  // 6. Web Vitals & Main thread blocking (TBT)
  const vitals = await send('Runtime.evaluate', {
    expression: `(() => {
      const nav = performance.getEntriesByType('navigation')[0] || {};
      const paints = performance.getEntriesByType('paint');
      const fcp = paints.find(p => p.name === 'first-contentful-paint');
      return {
        fcp: Math.round(fcp ? fcp.startTime : 0),
        domInteractive: Math.round(nav.domInteractive || 0),
        duration: Math.round(nav.duration || 0),
      };
    })()`,
    returnByValue: true,
  });

  // Calculate TBT from long tasks
  let tbt = 0;
  for (const lt of longTasks) {
    tbt += Math.max(0, lt.durMs - 50);
  }

  // Network stats
  let totalJsBytes = 0;
  let totalImageBytes = 0;
  for (const req of networkRequests) {
    if (req.mimeType.includes('javascript')) totalJsBytes += req.encodedDataLength || 0;
    if (req.mimeType.includes('image')) totalImageBytes += req.encodedDataLength || 0;
  }

  const result = {
    profile: profileName,
    fps: {
      idleHero: heroMetrics.result.value.fps,
      scrollFullPage: scrollMetrics.result.value.fps,
      hoverCards: hoverMetrics.result.value.fps,
      menuToggle: menuMetrics.result.value.fps,
    },
    frameDeltas: {
      idleMax: heroMetrics.result.value.maxFrameDelta,
      scrollMax: scrollMetrics.result.value.maxFrameDelta,
      hoverMax: hoverMetrics.result.value.maxFrameDelta,
      menuMax: menuMetrics.result.value.maxFrameDelta,
    },
    droppedFrames: {
      idle: heroMetrics.result.value.dropped,
      scroll: scrollMetrics.result.value.dropped,
      hover: hoverMetrics.result.value.dropped,
      menu: menuMetrics.result.value.dropped,
    },
    trace: {
      longTasksCount: longTasks.length,
      longTasks: longTasks.slice(0, 5),
      tbtMs: Math.round(tbt),
      scriptingTimeMs: Math.round(scriptingTime),
      renderingTimeMs: Math.round(renderingTime),
      paintingTimeMs: Math.round(paintingTime),
      layoutCount,
      styleRecalcCount,
    },
    gpu: {
      drawCallsPerFrame: heroMetrics.result.value.drawCalls,
      trianglesPerFrame: heroMetrics.result.value.triangles,
      renderTargetsCount: heroMetrics.result.value.renderTargetsCount,
      programsCount: heroMetrics.result.value.programsCount,
      texturesCount: heroMetrics.result.value.texturesCount,
    },
    memory: {
      jsHeapUsedMB,
      jsHeapTotalMB,
      domNodes,
    },
    network: {
      requestsCount: networkRequests.length,
      totalJsKB: Math.round(totalJsBytes / 1024),
      totalImageKB: Math.round(totalImageBytes / 1024),
    },
    vitals: vitals.result.value,
  };

  console.log(`RESULTS FOR ${profileName}:`);
  console.log(JSON.stringify(result, null, 2));

  ws.close();
  browserProc.kill();
  try {
    fs.rmSync(USER_DATA, { recursive: true, force: true });
  } catch {}

  return result;
}

async function main() {
  const desktop = await runSession('Desktop (Unthrottled)', {
    width: 1440,
    height: 900,
    dpr: 1,
    cpuThrottling: 1,
    mobile: false,
  });

  const laptop = await runSession('Mid-Range Laptop (4x CPU Throttle)', {
    width: 1440,
    height: 900,
    dpr: 1,
    cpuThrottling: 4,
    mobile: false,
  });

  const mobile = await runSession('Mobile Profile (6x CPU Throttle, 390x844)', {
    width: 390,
    height: 844,
    dpr: 2,
    cpuThrottling: 6,
    mobile: true,
  });

  const combined = { desktop, laptop, mobile, timestamp: new Date().toISOString() };
  fs.writeFileSync('scripts/baseline-results.json', JSON.stringify(combined, null, 2));
  console.log('\nWrote baseline-results.json successfully.');
}

main().catch(console.error);
