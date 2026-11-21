import { BasePage } from './base.page.js';

export class ToggleButtonPage extends BasePage {
  constructor(page) {
    super(page);
    this.button = page.locator('button[name="start"], button[name="stop"]');
  }

  async toggle() {
    await this.button.click();
  }
}
