class BasePage {
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto( process.env.BASE_URL+ url);
  }

  async waitForElement(selector) {
    await this.page.waitForSelector(selector);
  }

  async click(selector) {
    await this.page.click(selector);
  }

  async fill(selector, text) {
    await this.page.fill(selector, text);
  }

  async getText(selector) {
    return await this.page.textContent(selector);
  }

  async isVisible(selector) {
    return await this.page.isVisible(selector);
  }

  async waitForNavigation() {
    //
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = BasePage;