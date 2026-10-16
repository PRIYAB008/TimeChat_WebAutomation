// Used only by the Playwright agents (planner / generator / healer).
// The real regression suite runs through Cucumber (npm test / mvn test).
require('dotenv').config();
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './src/test/js/agents',
  outputDir: 'reports/playwright-agents',
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'https://timechat-web-ui-dev-341409913064.asia-south1.run.app/',
    headless: process.env.HEADLESS !== 'false',
    viewport: { width: 1280, height: 800 },
  },
});
