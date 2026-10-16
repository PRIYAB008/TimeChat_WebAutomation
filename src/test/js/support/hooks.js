const fs = require('fs');
const { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } = require('@cucumber/cucumber');
const playwright = require('playwright');
const config = require('./config');

setDefaultTimeout(config.timeout * 2);

let browser;

BeforeAll(async () => {
  fs.mkdirSync('reports/screenshots', { recursive: true });
  browser = await playwright[config.browser].launch({
    headless: config.headless,
    slowMo: config.slowMo,
  });
});

AfterAll(async () => {
  await browser?.close();
});

Before(async function () {
  this.context = await browser.newContext({
    baseURL: config.baseUrl,
    viewport: { width: 1280, height: 720 },
  });
  this.context.setDefaultTimeout(config.timeout);
  this.page = await this.context.newPage();
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const png = await this.page.screenshot({ fullPage: true });
    this.attach(png, 'image/png');
  }
  await this.page?.close();
  await this.context?.close();
});
