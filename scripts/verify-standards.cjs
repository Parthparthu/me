const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['app', 'components', 'data', 'lib', 'types', 'public'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'];

const BANNED_PHRASES = [
  'delve',
  'tapestry',
  'elevate',
  'seamless',
  'leverage',
  'unlock',
  'cutting-edge',
  'game-changer',
  'in today\'s fast-paced world',
  'crafting digital experiences',
  'passionate about',
  'turning ideas into reality',
  'pushing boundaries',
  'where creativity meets technology',
  'made with',
  'built with',
  'powered by',
];

const BANNED_COLOR_CLASSES = [
  /text-(purple|violet|indigo|pink)-\d+/,
  /bg-(purple|violet|indigo|pink)-\d+/,
  /border-(purple|violet|indigo|pink)-\d+/,
  /#(6366f1|818cf8|a78bfa|4f46e5|c7d2fe|e0e7ff|ec4899|f43f5e|8b5cf6|7c3aed|6d28d9)/i,
];

// Regex for emoji characters
const EMOJI_REGEX = /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// Collect all files recursively
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(getFiles(filePath));
      }
    } else {
      const ext = path.extname(filePath);
      if (EXTENSIONS.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

let allFiles = [];
SCAN_DIRS.forEach((dir) => {
  const fullPath = path.join(ROOT, dir);
  if (fs.existsSync(fullPath)) {
    allFiles = allFiles.concat(getFiles(fullPath));
  }
});

console.log(`Auditing ${allFiles.length} files across ${SCAN_DIRS.join(', ')}...\n`);

const violations = {
  emDash: [],
  bannedPhrases: [],
  bannedColors: [],
  pillButtons: [],
  emojis: [],
  customCursor: [],
};

allFiles.forEach((file) => {
  const relPath = path.relative(ROOT, file).replace(/\\/g, '/');
  // Skip binary or manifest favicons
  if (relPath.endsWith('.ico') || relPath.endsWith('.png')) return;

  const content = fs.readFileSync(file, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Em dash check
    if (line.includes('\u2014')) {
      violations.emDash.push({ file: relPath, line: lineNum, text: line.trim() });
    }

    // 2. Banned phrases (case insensitive)
    BANNED_PHRASES.forEach((phrase) => {
      // Exclude verification scripts or this script itself
      if (relPath.includes('verify-standards')) return;
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes(phrase)) {
        violations.bannedPhrases.push({
          file: relPath,
          line: lineNum,
          phrase,
          text: line.trim(),
        });
      }
    });

    // 3. Banned colors
    BANNED_COLOR_CLASSES.forEach((regex) => {
      if (regex.test(line)) {
        violations.bannedColors.push({
          file: relPath,
          line: lineNum,
          text: line.trim(),
        });
      }
    });

    // 4. Pill classes (rounded-full)
    if (line.includes('rounded-full')) {
      // Allow pulse indicators (tiny 2x2 or 4x4 dots like ping animations) if explicitly small dots, but flag buttons/badges/cards
      violations.pillButtons.push({
        file: relPath,
        line: lineNum,
        text: line.trim(),
      });
    }

    // 5. Emojis
    if (EMOJI_REGEX.test(line)) {
      violations.emojis.push({
        file: relPath,
        line: lineNum,
        text: line.trim(),
      });
    }

    // 6. Custom cursor
    if (line.includes('cursor: none') || line.includes('CustomCursor')) {
      violations.customCursor.push({
        file: relPath,
        line: lineNum,
        text: line.trim(),
      });
    }
  });
});

console.log('================ AUDIT RESULTS ================');
console.log(`1. Em dashes (\u2014): ${violations.emDash.length}`);
violations.emDash.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n2. Banned phrases: ${violations.bannedPhrases.length}`);
violations.bannedPhrases.forEach((v) => console.log(`   [Line ${v.line}] ${v.file} ("${v.phrase}"): "${v.text}"`));

console.log(`\n3. Banned color tokens: ${violations.bannedColors.length}`);
violations.bannedColors.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n4. Pill/rounded-full usages: ${violations.pillButtons.length}`);
violations.pillButtons.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n5. Emojis: ${violations.emojis.length}`);
violations.emojis.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n6. Custom cursor: ${violations.customCursor.length}`);
violations.customCursor.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log('\n===============================================');
