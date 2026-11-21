import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ToggleButtonPage extends BasePage {
  constructor(page) {
    super(page);
    this.button = page.locator('button[name="start"], button[name="stop"]');
  }

  async expectStartState() {
    await expect(this.button).toHaveText('START');
    await expect(this.button).toHaveAttribute('name', 'start');
    await expect(this.button).toHaveClass(/\bstart\b/);
  }

  async expectStopState() {
    await expect(this.button).toHaveText('STOP');
    await expect(this.button).toHaveAttribute('name', 'stop');
    await expect(this.button).toHaveClass(/\bstop\b/);
  }

  async toggle() {
    await this.button.click();
  }
}
