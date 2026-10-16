// Seed test: the agents start from the state this leaves the app in (logged in, on Chats).
const { test, expect } = require('@playwright/test');

test('seed', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /Phone number/ }).fill(process.env.TEST_PHONE || '1234567890');
  await page.getByRole('button', { name: /^Continue/ }).click();
  await page.getByRole('textbox', { name: /Verification code/ }).fill(process.env.TEST_OTP || '123456');
  await expect(page.getByRole('button', { name: /^Chats/ }).first()).toBeVisible();
});
