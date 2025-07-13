const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('✅ Puppeteer PDF server is running.');
});

app.post('/render', async (req, res) => {
  let html = req.body;

  try {
    html = html.toString();
  } catch (err) {
    console.error("❌ Failed to parse HTML:", err);
    return res.status(400).send("Invalid HTML body.");
  }

  try {
    console.log("📥 Received HTML:", html.slice(0, 100));

    const browser = await puppeteer.launch({
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox"
      ]
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
    console.error("❌ PDF rendering failed:", error);
    res.status(500).send("Rendering failed:\n" + error.toString());
  }
});

app.listen(port, () => {
  console.log(`🚀 Server is listening on port ${port}`);
});
