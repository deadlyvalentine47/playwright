import type { Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Relative navigation. The project config supplies baseURL, so no page object
   * knows or cares which host it runs against.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }
}

export type DialogCapture = {
  type: string;
  message: string;
};
