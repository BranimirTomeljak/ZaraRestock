const puppeteer = require("puppeteer");
const xpath = require("xpath");
const { DOMParser } = require("xmldom");
const UserAgent = require("user-agents");

async function getSizes(url) {
  let browser;
  try {
    console.log("1")
    browser = await puppeteer.launch();
    console.log("2")
    const page = await browser.newPage();
    console.log("3")
    await page.setUserAgent(new UserAgent().toString());
    console.log("4")
    await page.goto(url);
    console.log("5")
    console.log(page);
    console.log(url);
    await page
      .waitForSelector(".product-size-info__main-label")
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
    console.log("11")
    browser = await puppeteer.launch();
    console.log("22")
    const page = await browser.newPage();
    console.log("33")
    await page.setUserAgent(new UserAgent().toString());
    console.log("44")
    await page.goto(url);
    console.log("55")
    console.log(page.html());

    await page
      .waitForSelector(".product-size-info__main-label")
      .catch(() => {
        throw new Error("Size label not found");
      });
    console.log("66")
    const html = await page.content();
    console.log("77")
    const parser = new DOMParser();
    console.log("88")
    const doc = parser.parseFromString(html, "text/html");
    console.log("99")
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
