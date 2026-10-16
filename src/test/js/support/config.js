require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'https://timechat-web-ui-dev-341409913064.asia-south1.run.app/',
  browser: process.env.BROWSER_NAME || 'chromium',
  headless: process.env.HEADLESS !== 'false',
  slowMo: Number(process.env.SLOW_MO) || 0,
  timeout: Number(process.env.TIMEOUT) || 30000,
  testPhone: process.env.TEST_PHONE || '1234567890',
  testOtp: process.env.TEST_OTP || '123456',
};
