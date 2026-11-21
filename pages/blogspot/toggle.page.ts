import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ToggleButtonPage extends BasePage {
  readonly button: Locator;

  constructor(page: Page) {
    super(page);
    this.button = page.locator('button[name="start"], button[name="stop"]');
  }

  async toggle(): Promise<void> {
    await this.button.click();
  }
}
