const fs = require('fs');
const path = require('path');

const targets = ['Made with', 'Built with', 'Powered by', 'v0.dev', 'bolt.new', 'lovable'];
const matches = [];

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((file) => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        scanDir(full);
      }
    } else {
      const ext = path.extname(full);
      if (['.html', '.js', '.json', '.txt', '.css', '.tsx', '.ts'].includes(ext)) {
        if (full.includes('verify-standards') || full.includes('scan-branding')) return;
        try {
          const content = fs.readFileSync(full, 'utf-8');
          targets.forEach((t) => {
            if (content.toLowerCase().includes(t.toLowerCase())) {
              matches.push({ file: full, target: t });
            }
          });
        } catch (e) {}
      }
    }
  });
}

scanDir(path.resolve('.next/server'));
scanDir(path.resolve('app'));
scanDir(path.resolve('components'));
scanDir(path.resolve('data'));
scanDir(path.resolve('public'));

console.log('Search results for branding watermarks (Target: 0 matches):');
console.log('Total matches:', matches.length);
matches.forEach((m) => console.log('Match:', m.file, 'Target:', m.target));
