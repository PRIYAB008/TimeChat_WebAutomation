const { expect } = require('@playwright/test');

// Locators
const text = (page, value) => page.getByText(value).first();

class BasePage {
  constructor(page) {
    this.page = page;
  }

  button(name) {
    return this.page.getByRole('button', { name });
  }

  textbox(name) {
    return this.page.getByRole('textbox', { name });
  }

  // Assertions
  async expectTextVisible(value) { await expect(text(this.page, value)).toBeVisible(); }
}

module.exports = BasePage;
