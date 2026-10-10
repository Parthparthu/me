const fs = require('fs');

function inspectFile(filePath) {
  if (fs.existsSync(filePath)) {
    const html = fs.readFileSync(filePath, 'utf8');
    const imgMatches = html.match(/<img[^>]+src="([^">]+)"/g) || [];
    console.log(`--- Image Tags in ${filePath} ---`);
    imgMatches.forEach(m => {
      if (m.includes('certificate')) console.log(m);
    });

    const aMatches = html.match(/<a[^>]+href="([^">]+)"/g) || [];
    console.log(`--- Anchor Tags in ${filePath} ---`);
    aMatches.forEach(m => {
      if (m.includes('certificate') || m.includes('resume.pdf')) console.log(m);
    });
  }
}

inspectFile('out/index.html');
inspectFile('out/resume/index.html');
