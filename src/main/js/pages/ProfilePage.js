const BasePage = require('./BasePage');

// Locators
const logoutButton = (page) => page.getByRole('button', { name: /Log out/ }).first();
// The confirmation dialog's button shares its name with the Profile button; the dialog's is last.
const confirmLogoutButton = (page) => page.getByRole('button', { name: /^Log out$/ }).last();
const cancelButton = (page) => page.getByRole('button', { name: /^Cancel$/ });

class ProfilePage extends BasePage {
  constructor(page) {
    super(page);
  }

  // Actions
  async clickLogout() { await logoutButton(this.page).click(); }
  async confirmLogout() { await confirmLogoutButton(this.page).click(); }
  async cancelLogout() { await cancelButton(this.page).click(); }
}

module.exports = ProfilePage;
