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
    const html = req
