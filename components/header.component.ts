import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly page: Page;
  readonly title: Locator;
  readonly description: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1.title').first();
    this.description = page.locator('p.description').first();
  }

  async titleText(): Promise<string> {
    return ((await this.title.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  }

  async descriptionText(): Promise<string> {
    return ((await this.description.textContent()) ?? '').replace(/\s+/g, ' ').trim();
  }
}
