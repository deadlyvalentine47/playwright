export const BASE_URL = 'https://testautomationpractice.blogspot.com/';

export class BasePage {
  constructor(page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  }
}
