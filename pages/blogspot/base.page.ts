import type { Page } from '@playwright/test';

export const BASE_URL = 'https://testautomationpractice.blogspot.com/';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(): Promise<void> {
    await this.page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  }
}

export type DialogCapture = {
  type: string;
  message: string;
};
