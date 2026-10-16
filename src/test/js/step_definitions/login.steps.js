const { Given, When, Then } = require('@cucumber/cucumber');
const config = require('../support/config');
const LoginPage = require('../../../main/js/pages/LoginPage');
const HomePage = require('../../../main/js/pages/HomePage');
const ProfilePage = require('../../../main/js/pages/ProfilePage');

Given('I open the TimeChat app', async function () {
  this.pages.login = new LoginPage(this.page);
  this.pages.home = new HomePage(this.page);
  this.pages.profile = new ProfilePage(this.page);
  await this.pages.login.open();
});

When('I enter the test phone number', async function () {
  await this.pages.login.enterPhone(config.testPhone);
});

When('I tap Continue', async function () {
  await this.pages.login.clickContinue();
});

When('I enter the test OTP', async function () {
  await this.pages.login.enterOtp(config.testOtp);
});

Then('Continue should be disabled', async function () {
  await this.pages.login.expectContinueDisabled();
});

Then('Continue should be enabled', async function () {
  await this.pages.login.expectContinueEnabled();
});

Then('I should see the verification code field', async function () {
  await this.pages.login.expectOtpVisible();
});

Then('I should land on the Chats home screen', async function () {
  await this.pages.home.expectChatsHomeVisible();
});

When('I type {string} into the phone field', async function (text) {
  await this.pages.login.typePhone(text);
});

When('I press Enter in the phone field', async function () {
  await this.pages.login.pressEnterInPhone();
});

When('I type {string} into the verification code field', async function (text) {
  await this.pages.login.typeOtp(text);
});

When('I tap Verify Code', async function () {
  await this.pages.login.clickVerify();
});

When('I tap Resend', async function () {
  await this.pages.login.clickResend();
});

When('I tap Change number', async function () {
  await this.pages.login.clickChangeNumber();
});

When('I reload the app', async function () {
  await this.page.reload();
});

When('I log in with the test credentials', async function () {
  await this.pages.login.login(config.testPhone, config.testOtp);
  await this.pages.home.expectChatsHomeVisible();
});

When('I open the Profile tab', async function () {
  await this.pages.home.openTab('Profile');
});

When('I tap Log out', async function () {
  await this.pages.profile.clickLogout();
});

When('I confirm the logout', async function () {
  await this.pages.profile.confirmLogout();
});

When('I cancel the logout', async function () {
  await this.pages.profile.cancelLogout();
});

Then('the phone field should contain {string}', async function (value) {
  await this.pages.login.expectPhoneValue(value);
});

Then('the verification code field should contain {string}', async function (value) {
  await this.pages.login.expectOtpValue(value);
});

Then('I should see the text {string}', async function (text) {
  await this.pages.login.expectTextVisible(text);
});

Then('I should see the phone entry screen', async function () {
  // Flutter takes several seconds to boot after a reload.
  await this.pages.login.expectPhoneEntryVisible(config.timeout);
});

Then('the Verify Code button should be visible', async function () {
  await this.pages.login.expectVerifyVisible();
});

Then('the Change number button should be visible', async function () {
  await this.pages.login.expectChangeNumberVisible();
});

Then('Resend should be disabled', async function () {
  await this.pages.login.expectResendDisabled();
});

Then('Resend should become enabled within {int} seconds', async function (seconds) {
  await this.pages.login.expectResendEnabled(seconds * 1000);
});
