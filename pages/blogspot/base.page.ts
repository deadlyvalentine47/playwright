import type { Page } from '@playwright/test';
import { env } from '../../utils/env.js';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Resolves against BLOGSPOT_BASE_URL, read at call time so the config file
   * does not need it in order to load.
   */
  async goto(path = '/'): Promise<void> {
    await this.page.goto(new URL(path, env.blogspotBaseUrl).toString(), {
      waitUntil: 'domcontentloaded',
    });
  }
}

export type DialogCapture = {
  type: string;
  message: string;
};
