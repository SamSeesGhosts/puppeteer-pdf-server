const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

// Accept large HTML bodies
app.use(bodyParser.text({ limit: '10mb' }));

// Basic health check route
app.get('/', (req, res) => {
  res.send('✅ Puppeteer Render Server is running');
});

// PDF rendering route
app.post('/render', async (req, res) => {
  try {
    const html = req.body;
    console.log("📥 Received HTML:", html.slice(0, 150));

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
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
