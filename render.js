const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer-core');
const { executablePath } = require('puppeteer'); // <- pulls correct path from installed chrome

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('✅ Puppeteer Render Server is running');
});

app.post('/render', async (req, res) => {
  let html = req.body;

  try {
    html = html.toString();
  } catch (e) {
    console.error("❌ Could not convert body to string:", html);
    return res.status(400).send('Invalid HTML input.');
  }

  try {
    console.log("📥 Received HTML:", html.slice(0, 150));

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: executablePath(), // use the correct path dynamically
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ PDF rendering failed:', error);
    res.status(500).send('Rendering failed.\n' + error.toString());
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
