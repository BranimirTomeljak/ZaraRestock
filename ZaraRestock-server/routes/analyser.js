var express = require("express");
const puppeteer = require("puppeteer");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");
var router = express.Router();

router.post("/", async function (req, res) {
  checkSizeAvailability(
    "https://www.zara.com/hr/hr/elasticna-majica-sa-sirokim-naramenicama-p03905931.html?v1=232669686",
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
      console.error(`Nema, tugy plaky`);
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
    if (result) {
      //sendMail(mail);
    }
    console.log(`Result of checking ${url}: ${result}`);
  }, Math.random() * (60000 - 30000) + 30000); // random[30, 60] seconds
}

//runPeriodically(url, size);

/*const crawlers = require('crawler-user-agents');
console.log(crawlers);*/
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
  "Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) GSA/6.0.51363 Mobile/12H321 Safari/600.1.4",
  "Mozilla/5.0 (iPad; CPU OS 8_1_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B436 Safari/600.1.4",
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36",
  "Mozilla/5.0 (Windows; U; Windows NT 5.1; zh-CN) AppleWebKit/530.19.2 (KHTML, like Gecko) Version/4.0.2 Safari/530.19.1",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H321",
  "Mozilla/5.0 (Linux; U; Android 4.0.3; en-ca; KFTT Build/IML74K) AppleWebKit/537.36 (KHTML, like Gecko) Silk/3.68 like Chrome/39.0.2171.93 Safari/537.36",
  "Mozilla/5.0 (Windows NT 5.1; rv:30.0) Gecko/20100101 Firefox/30.0",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.130 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:40.0) Gecko/20100101 Firefox/40.0.2 Waterfox/40.0.2",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:38.0) Gecko/20100101 Firefox/38.0",
  "Mozilla/5.0 (Windows NT 6.3; Win64; x64; Trident/7.0; LCJB; rv:11.0) like Gecko",
  "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; NISSC; rv:11.0) like Gecko",
  "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.118 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9) AppleWebKit/537.71 (KHTML, like Gecko) Version/7.0 Safari/537.71",
  "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.125 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Trident/7.0; MALC; rv:11.0) like Gecko",
];

module.exports = router;
