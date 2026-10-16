const { expect } = require('@playwright/test');
const BasePage = require('./BasePage');

// Locators
const tab = (page, name) => page.getByRole('button', { name: new RegExp(`^${name}`) }).first();
const searchBox = (page) => page.getByRole('textbox', { name: /^Search/ });

class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Actions
  async openTab(name) { await tab(this.page, name).click(); }

  // Assertions
  async expectChatsHomeVisible() {
    await expect(tab(this.page, 'Chats')).toBeVisible();
    await expect(tab(this.page, 'Groups')).toBeVisible();
    await expect(searchBox(this.page)).toBeVisible();
  }
}

module.exports = HomePage;
