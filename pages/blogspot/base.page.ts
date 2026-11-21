import type { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Resolves against the project's baseURL, which comes from the active env file.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

export type DialogCapture = {
  type: string;
  message: string;
};
