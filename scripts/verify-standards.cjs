const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCAN_DIRS = ['app', 'components', 'data', 'lib', 'types', 'public'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md'];

const BANNED_PHRASES = [
  'delve',
  'tapestry',
  'seamless',
  'leverage',
  'cutting-edge',
  'game-changer',
  'in today\'s fast-paced world',
  'crafting digital experiences',
  'passionate about',
  'turning ideas into reality',
  'pushing boundaries',
  'where creativity meets technology',
  'deterministic constraints',
  'superficial breadth',
  'engineered an array of',
  'made with',
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
  colonAsDash: [],
  tierLabels: [],
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
    const trimmed = line.trim();

    // 1. Em dash check
    if (line.includes('\u2014') || line.includes('&mdash;') || line.includes('—')) {
      violations.emDash.push({ file: relPath, line: lineNum, text: trimmed });
    }

    // 2. Colon as dash replacement: "word : word" pattern in prose/strings (excluding ternaries)
    if (!line.includes('?') && /[a-zA-Z0-9]\s+:\s+[a-zA-Z0-9]/.test(line) && !relPath.includes('verify-standards')) {
      violations.colonAsDash.push({ file: relPath, line: lineNum, text: trimmed });
    }

    // 3. Unexplained Tier labels: "Tier A" or "Tier B" in user-facing files
    if (/\bTier [A-Z]\b/.test(line) && !relPath.includes('verify-standards')) {
      violations.tierLabels.push({ file: relPath, line: lineNum, text: trimmed });
    }

    // 4. Banned phrases (case insensitive whole-phrase match)
    BANNED_PHRASES.forEach((phrase) => {
      if (relPath.includes('verify-standards')) return;
      const lowerLine = line.toLowerCase();
      if (lowerLine.includes(phrase)) {
        violations.bannedPhrases.push({
          file: relPath,
          line: lineNum,
          phrase,
          text: trimmed,
        });
      }
    });

    // 5. Banned colors
    BANNED_COLOR_CLASSES.forEach((regex) => {
      if (regex.test(line)) {
        violations.bannedColors.push({
          file: relPath,
          line: lineNum,
          text: trimmed,
        });
      }
    });

    // 6. Pill buttons/badges (rounded-full on button or badge elements)
    if (line.includes('rounded-full')) {
      if (line.includes('button') || line.includes('btn') || line.includes('badge') || line.includes('tag')) {
        violations.pillButtons.push({
          file: relPath,
          line: lineNum,
          text: trimmed,
        });
      }
    }

    // 7. Emojis
    if (EMOJI_REGEX.test(line)) {
      violations.emojis.push({
        file: relPath,
        line: lineNum,
        text: trimmed,
      });
    }

    // 8. Custom cursor
    if (line.includes('cursor: none') || line.includes('CustomCursor')) {
      violations.customCursor.push({
        file: relPath,
        line: lineNum,
        text: trimmed,
      });
    }
  });
});

console.log('================ AUDIT RESULTS ================');
console.log(`1. Em dashes (\u2014 / &mdash;): ${violations.emDash.length}`);
violations.emDash.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n2. Colon-as-dash replacements (" : "): ${violations.colonAsDash.length}`);
violations.colonAsDash.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n3. Unexplained Tier labels ("Tier A/B"): ${violations.tierLabels.length}`);
violations.tierLabels.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n4. Banned phrases: ${violations.bannedPhrases.length}`);
violations.bannedPhrases.forEach((v) => console.log(`   [Line ${v.line}] ${v.file} ("${v.phrase}"): "${v.text}"`));

console.log(`\n5. Banned color tokens: ${violations.bannedColors.length}`);
violations.bannedColors.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n6. Pill buttons/badges: ${violations.pillButtons.length}`);
violations.pillButtons.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n7. Emojis: ${violations.emojis.length}`);
violations.emojis.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log(`\n8. Custom cursor: ${violations.customCursor.length}`);
violations.customCursor.forEach((v) => console.log(`   [Line ${v.line}] ${v.file}: "${v.text}"`));

console.log('\n===============================================');

const totalErrors = violations.emDash.length +
  violations.colonAsDash.length +
  violations.tierLabels.length +
  violations.bannedPhrases.length +
  violations.bannedColors.length +
  violations.pillButtons.length +
  violations.emojis.length +
  violations.customCursor.length;

if (totalErrors > 0) {
  console.log(`\nFAIL: Found ${totalErrors} standard violations.`);
  process.exit(1);
} else {
  console.log('\nPASS: All standards verified clean.');
  process.exit(0);
}
