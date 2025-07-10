const express = require('express');
const bodyParser = require('body-parser');
const chromium = require('chrome-aws-lambda');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({ limit: '10mb' }));

app.get('/', async (req, res) => {
  const chromePath = await chromium.executablePath;
  res.send(`✅ Puppeteer Render Server is running<br>🧠 Chrome path: ${chromePath}`);
});

app.post('/render', async (req, res) => {
  try {
    const html = req.body;

    console.log("📥 Received HTML:", html.slice(0, 150));

    const executablePath = await chromium.executablePath;
    console.log("🧠 Using Chromium at:", executablePath);

    const browser = await chromium.puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath,
      headless: chromium.headless,
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
