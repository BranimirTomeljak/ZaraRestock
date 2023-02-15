var express = require("express");
const puppeteer = require("puppeteer");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");
var router = express.Router();

router.post("/", async function (req, res) {
  checkSizeAvailability(
    "https://www.zara.com/hr/hr/haljina-od-strukturirane-tkanine-p06560267.html?v1=207813905&utm_campaign=productMultiShare&utm_medium=mobile_sharing_Android&utm_source=red_social_movil",
    "L"
  );
  res.status(200);
});

async function checkSizeAvailability(url, size) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setCookie({
    name: "cookieName",
    value: "cookieValue",
    domain: "example.com",
    path: "/",
    expires: Date.now() / 1000 + 10, // Expires in 10 seconds
  });
  await page.setUserAgent(
    user_agents_list[Math.floor(Math.random() * user_agents_list.length)]
  );
  try {
    await page.goto(url);
    await page.waitForSelector("#onetrust-consent-sdk", { timeout: 30000 });
    await page.evaluate(() => {
      const cookiePrompt = document.querySelector("#onetrust-consent-sdk");
      if (cookiePrompt) {
        cookiePrompt.remove();
      }
    });
    await page.waitForSelector(".product-size-info__main-label", {
      timeout: 30000,
    });

    const html = await page.content();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = xpath.select('//*[@data-qa-action="size-in-stock"]', doc);
    if (!elements.length) {
      console.error(
        `Nema, tugy plaky`
      );
      return false;
    }

    for (const element of elements) {
      const sizeString = xpath.select(
        './/*[contains(@class, "product-size-info__main-label")]',
        element
      )[0].textContent;
      if (sizeString === size) {
        console.log("IMA aleale");
        return true;
      }
    }
    console.error("tugica");
    return false;
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    return false;
  } finally {
    await browser.close();
  }
}

async function runPeriodically(url, size) {
  setInterval(async () => {
    const result = await checkSizeAvailability(url, size);
    if(result){
        //sendMail(mail);
    }
    console.log(`Result of checking ${url}: ${result}`);
  }, Math.random() * (60000 - 30000) + 30000); // random[30, 60] seconds
}

//runPeriodically(url, size);

var user_agents_list = [
  "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.83 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/51.0.2704.79 Chrome/51.0.2704.79 Safari/537.36",
];

module.exports = router;
