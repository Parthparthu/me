const http = require('http');

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runLiveVerification() {
  console.log('=== STARTING LIVE ENDPOINT & GATES VERIFICATION ===\n');

  // Test 1: Root & Header Inspection (Gate G3)
  console.log('1. Checking Root & HTTP Headers (Gate G3: No Powered-By)...');
  const root = await makeRequest({ host: 'localhost', port: 3001, path: '/', method: 'GET' });
  console.log(`   Root HTTP status: ${root.status}`);
  if (root.headers['x-powered-by']) {
    console.error(`   [FAIL] X-Powered-By header found: ${root.headers['x-powered-by']}`);
  } else {
    console.log('   [PASS] Zero X-Powered-By header present.');
  }

  // Test 2: Core Pages Resolution
  console.log('\n2. Verifying Core Pages (200 OK)...');
  const pages = ['/privacy/', '/terms/', '/resume/', '/projects/', '/projects/oweo/', '/sitemap.xml', '/robots.txt'];
  for (const page of pages) {
    const res = await makeRequest({ host: 'localhost', port: 3001, path: page, method: 'GET' });
    if (res.status === 200) {
      console.log(`   [PASS] ${page} -> 200 OK (${res.headers['content-type']})`);
    } else {
      console.error(`   [FAIL] ${page} -> ${res.status}`);
    }
  }

  // Test 3: Favicon and Icon Assets (Gate G2)
  console.log('\n3. Verifying Favicon & Icon Suite (Gate G2: Zero 404s)...');
  const icons = [
    '/favicon.ico',
    '/favicon.svg',
    '/apple-touch-icon.png',
    '/icon-192.png',
    '/icon-512.png',
    '/manifest.webmanifest',
  ];
  for (const icon of icons) {
    const res = await makeRequest({ host: 'localhost', port: 3001, path: icon, method: 'GET' });
    if (res.status === 200) {
      console.log(`   [PASS] ${icon} -> 200 OK (${res.headers['content-type']})`);
    } else {
      console.error(`   [FAIL] ${icon} -> ${res.status}`);
    }
  }

  // Test 4: Contact Form API (Gate G7)
  console.log('\n4. Verifying Contact API (Gate G7: Validation, Anti-Spam, Honest 503 fallback)...');
  
  // 4a. Invalid submission
  const invalidPayload = JSON.stringify({ name: '', email: 'not-an-email', message: '' });
  const resInvalid = await makeRequest(
    {
      host: 'localhost',
      port: 3001,
      path: '/api/contact/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(invalidPayload) },
    },
    invalidPayload
  );
  console.log(`   4a. Invalid Payload: status ${resInvalid.status} (Expected: 400). Body: ${resInvalid.body}`);

  // 4b. Bot Honeypot
  const botPayload = JSON.stringify({
    name: 'Spam Bot',
    email: 'bot@example.com',
    subject: 'Spam Infiltration',
    message: 'Buy now! Automated unsolicited spam advertisement payload.',
    _website: 'http://spam.com',
  });
  const resBot = await makeRequest(
    {
      host: 'localhost',
      port: 3001,
      path: '/api/contact/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(botPayload) },
    },
    botPayload
  );
  console.log(`   4b. Bot Honeypot: status ${resBot.status} (Expected: 200 silent rejection). Body: ${resBot.body}`);

  // 4c. Valid Payload without configured RESEND_API_KEY
  const validPayload = JSON.stringify({
    name: 'Senior QA Reviewer',
    email: 'reviewer@example.com',
    subject: 'Portfolio Engineering Review',
    message: 'Testing the live contact pipeline under Section 4 verification protocol.',
  });
  const resValid = await makeRequest(
    {
      host: 'localhost',
      port: 3001,
      path: '/api/contact/',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(validPayload) },
    },
    validPayload
  );
  console.log(`   4c. Valid Payload (No API Key set): status ${resValid.status} (Expected: 503 honest fallback). Body: ${resValid.body}`);

  console.log('\n=== LIVE VERIFICATION COMPLETE ===');
}

runLiveVerification().catch(console.error);
