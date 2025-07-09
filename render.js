import express from "express";
import puppeteer from "puppeteer";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.text({ type: "text/html", limit: "5mb" }));

app.post("/render", async (req, res) => {
  const html = req.body;
  if (!html) return res.status(400).send("Missing HTML body");

  try {
    const browserFetcher = puppeteer.createBrowserFetcher({
      path: "./chromium"
    });
    const revisionInfo = await browserFetcher.download(puppeteer.browser.version());

    const browser = await puppeteer.launch({
      headless: "new",
      executablePath: revisionInfo.executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "30px", bottom: "30px", left: "30px", right: "30px" },
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=output.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ Puppeteer error:", err);
    res.status(500).send("Puppeteer rendering failed.");
  }
});

app.get("/", (req, res) => res.send("Puppeteer PDF server is up!"));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
