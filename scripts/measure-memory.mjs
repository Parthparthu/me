import { spawn } from 'child_process';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const browserProc = spawn(CHROME_PATH, [
  '--headless=new',
  '--remote-debugging-port=9232',
  '--remote-allow-origins=*',
  '--enable-webgl',
  'about:blank'
], { stdio: 'ignore' });

async function run() {
  await new Promise(r => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9232/json/list');
  const list = await res.json();
  const page = list.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === msgId) {
        ws.removeEventListener('message', handler);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000' });
  await new Promise(r => setTimeout(r, 3500));

  const startMemory = await send('Runtime.evaluate', {
    expression: '({ used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) })',
    returnByValue: true
  });
  console.log('Start Memory (MB):', JSON.stringify(startMemory.result.value));

  // Scroll back and forth for 15 seconds
  await send('Runtime.evaluate', {
    expression: `new Promise(async (resolve) => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      for (let i = 0; i < 10; i++) {
        window.scrollTo(0, i % 2 === 0 ? h : 0);
        await new Promise(r => setTimeout(r, 1000));
      }
      resolve();
    })`,
    awaitPromise: true
  });

  const endMemory = await send('Runtime.evaluate', {
    expression: '({ used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) })',
    returnByValue: true
  });
  console.log('End Memory (MB):', JSON.stringify(endMemory.result.value));

  ws.close();
  browserProc.kill();
}

run().catch(console.error);
