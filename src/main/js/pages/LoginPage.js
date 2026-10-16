const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

// Locators
const phoneInput = (page) => page.getByRole('textbox', { name: /Phone number/ });
const continueButton = (page) => page.getByRole('button', { name: /^Continue/ });
const otpInput = (page) => page.getByRole('textbox', { name: /Verification code/ });
const verifyButton = (page) => page.getByRole('button', { name: /Verify Code/ });
const resendButton = (page) => page.getByRole('button', { name: /^Resend/ });
const changeNumberButton = (page) => page.getByRole('button', { name: /Change number/ });

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Actions
  async open() {
    await this.page.goto('/');
    await phoneInput(this.page).waitFor();
  }

  async enterPhone(phone) { await phoneInput(this.page).fill(phone); }
  // Types key by key so the app's input filtering (non-digits, 10-digit cap) is exercised.
  async typePhone(text) {
    await phoneInput(this.page).click();
    await phoneInput(this.page).pressSequentially(text);
  }
  async pressEnterInPhone() { await phoneInput(this.page).press('Enter'); }
  async clickContinue() { await continueButton(this.page).click(); }
  // The app auto-submits once 6 digits are entered.
  async enterOtp(otp) { await otpInput(this.page).fill(otp); }
  async typeOtp(text) {
    await otpInput(this.page).click();
    await otpInput(this.page).pressSequentially(text);
  }
  async clickVerify() { await verifyButton(this.page).click(); }
  async clickResend() { await resendButton(this.page).click(); }
  async clickChangeNumber() { await changeNumberButton(this.page).click(); }

  async login(phone, otp) {
    await this.enterPhone(phone);
    await this.clickContinue();
    await this.enterOtp(otp);
  }

  // Assertions
  async expectContinueDisabled() { await expect(continueButton(this.page)).toBeDisabled(); }
  async expectContinueEnabled() { await expect(continueButton(this.page)).toBeEnabled(); }
  async expectOtpVisible() { await expect(otpInput(this.page)).toBeVisible(); }
  async expectPhoneEntryVisible(timeout) { await expect(phoneInput(this.page)).toBeVisible({ timeout }); }
  async expectPhoneValue(value) { await expect(phoneInput(this.page)).toHaveValue(value); }
  async expectOtpValue(value) { await expect(otpInput(this.page)).toHaveValue(value); }
  async expectVerifyVisible() { await expect(verifyButton(this.page)).toBeVisible(); }
  async expectChangeNumberVisible() { await expect(changeNumberButton(this.page)).toBeVisible(); }
  async expectResendDisabled() { await expect(resendButton(this.page)).toBeDisabled(); }
  async expectResendEnabled(timeout) { await expect(resendButton(this.page)).toBeEnabled({ timeout }); }
}

module.exports = LoginPage;
