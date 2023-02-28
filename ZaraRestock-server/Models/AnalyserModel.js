const puppeteer = require("puppeteer");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");
const UserAgent = require("user-agents");

async function getSizes(url) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(new UserAgent().toString());
    await page.goto(url);
    await page
      .waitForSelector(".product-size-info__main-label", { timeout: 10000 })
      .catch(() => {
        throw new Error("Size label not found");
      });
    const html = await page.content();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const sizes = xpath.select(
      './/*[contains(@class, "product-size-info__main-label")]',
      doc
    );
    const sizesList = sizes.map((size) => size.textContent);
    if (!sizesList.length) {
      console.error("Can't get sizes.");
      return false;
    }
    return sizesList;
  } catch (error) {
    console.log(`${error}`);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function checkSizeAvailability(url, size) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent(new UserAgent().toString());
    await page.goto(url);
    await page
      .waitForSelector(".product-size-info__main-label", { timeout: 10000 })
      .catch(() => {
        throw new Error("Size label not found");
      });
    const html = await page.content();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const elements = xpath.select('//*[@data-qa-action="size-in-stock"]', doc);
    if (!elements.length) {
      return false;
    }
    for (const element of elements) {
      const sizeString = xpath.select(
        './/*[contains(@class, "product-size-info__main-label")]',
        element
      )[0].textContent;
      if (sizeString === size) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.log(`${error}`);
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  getSizes,
  checkSizeAvailability,
};
