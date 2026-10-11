const fs = require('fs');
const path = require('path');

const readme = fs.readFileSync('README.md', 'utf8');

console.log('=== AUDITING README.md ===');

// 1. Em dashes
const emDashes = (readme.match(/\u2014/g) || []).length;
console.log(`1. Em dashes (\\u2014): ${emDashes}`);

// 2. Emoji check (standard Unicode emoji ranges)
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;
const emojis = (readme.match(emojiRegex) || []).length;
console.log(`2. Emojis: ${emojis}`);

// 3. Marketing filler phrases
const bannedPhrases = [
  'cutting-edge',
  'seamless',
  'next-gen',
  'passionate about',
  'revolutionize',
  'game-changer',
  'made with ai',
  'powered by ai',
];
let fillerCount = 0;
for (const phrase of bannedPhrases) {
  const count = (readme.toLowerCase().match(new RegExp(phrase, 'g')) || []).length;
  if (count > 0) {
    console.log(`Banned phrase found: "${phrase}" (${count} times)`);
    fillerCount += count;
  }
}
console.log(`3. Marketing filler phrases: ${fillerCount}`);

// 4. Broken internal anchors
const anchorLinks = [...readme.matchAll(/\[.*?\]\(#(.*?)\)/g)].map(m => m[1]);
const headings = [...readme.matchAll(/^#{1,6}\s+(.*)$/gm)].map(m => {
  return m[1].toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
});

let missingAnchors = 0;
for (const link of anchorLinks) {
  if (!headings.includes(link)) {
    console.warn(`Missing heading target for anchor: #${link}`);
    missingAnchors++;
  }
}
console.log(`4. Anchor targets checked: ${anchorLinks.length}, Missing: ${missingAnchors}`);

// 5. Image paths exist
const imageSrcs = [...readme.matchAll(/src=["'](.*?)["']/g)].map(m => m[1]);
let missingImages = 0;
for (const src of imageSrcs) {
  if (src.startsWith('http')) continue;
  if (!fs.existsSync(src)) {
    console.error(`Image missing: ${src}`);
    missingImages++;
  } else {
    const stats = fs.statSync(src);
    console.log(`Image verified: ${src} (${Math.round(stats.size / 1024)} KB)`);
  }
}
console.log(`5. Local images checked: ${imageSrcs.filter(s => !s.startsWith('http')).length}, Missing: ${missingImages}`);

// 6. SVG palette check
console.log('\n=== AUDITING SVG ASSETS ===');
function hexToHsl(hex) {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  const r = (num >> 16) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}

function auditSvgs(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) auditSvgs(full);
    else if (f.endsWith('.svg')) {
      const content = fs.readFileSync(full, 'utf8');
      const hasEmDash = content.includes('\u2014');
      const hexColors = content.match(/#(?:[0-9a-fA-F]{3}){1,2}\b/g) || [];
      const purpleColors = [];
      for (const hex of hexColors) {
        const { h, s } = hexToHsl(hex);
        // Purple/violet range: 255 deg to 325 deg with saturation > 15%
        if (h >= 255 && h <= 325 && s > 0.15) {
          purpleColors.push(hex);
        }
      }
      const namedPurple = /purple|violet|fuchsia|magenta|indigo/i.test(content);
      const isPurple = purpleColors.length > 0 || namedPurple;
      console.log(`SVG: ${full} - Size: ${content.length} B - EmDash: ${hasEmDash} - Purple: ${isPurple} ${purpleColors.length ? '(' + purpleColors.join(',') + ')' : ''}`);
    }
  }
}
// 7. External URL check
console.log('\n=== AUDITING EXTERNAL URLS ===');
const rawUrls = readme.match(/https?:\/\/[^\s"'<>]+/g) || [];
const cleanedUrls = rawUrls.map(u => {
  return u.replace(/[`,)\]]+$/, '');
}).filter(u => !u.includes('localhost'));
const urls = Array.from(new Set(cleanedUrls));
console.log(`Checking ${urls.length} unique external URLs...`);

async function checkAllUrls() {
  let failed = 0;
  for (const u of urls) {
    try {
      const res = await fetch(u, {
        method: 'HEAD',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      // Accept 200, 301, 302, 403 (e.g. LinkedIn bot protection blocks HEAD requests)
      if (res.status >= 400 && res.status !== 403 && res.status !== 405) {
        console.warn(`[WARN HTTP ${res.status}] ${u}`);
        failed++;
      } else {
        console.log(`[PASS ${res.status}] ${u}`);
      }
    } catch (e) {
      console.warn(`[FETCH ERR] ${u}: ${e.message}`);
    }
  }
  console.log(`URL Audit Finished. Problematic URLs: ${failed}`);
}

checkAllUrls();
