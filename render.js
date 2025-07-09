const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  const html = fs.readFileSync(inputPath, 'utf8');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true
  });

  await browser.close();
})();
