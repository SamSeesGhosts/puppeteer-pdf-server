const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.text({ limit: '10mb' }));

app.get('/', (req, res) => {
  res.send('✅ Puppeteer Render Server is running');
});

app.post('/render', async (req, res) => {
  let html = req.body;

  try {
    html = html.toString(); // Convert buffer or object to string
  } catch (e) {
    console.error("❌ Could not convert body to string:", html);
    return res.status(400).send('Invalid HTML input.');
  }

  try {
    console.log("📥 Received HTML:", html.slice(0, 150));

    const browser = await puppeteer.launch({
      headless: true,
      executablePath: '/opt/render/.cache/puppeteer/chrome/linux-127.0.6533.88/chrome-linux64/chrome',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    awa
