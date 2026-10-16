const { setWorldConstructor, World } = require('@cucumber/cucumber');
const config = require('./config');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.config = config;
    this.browser = null;
    this.context = null;
    this.page = null;
    this.pages = {}; // lazily created page objects
  }
}

setWorldConstructor(CustomWorld);
