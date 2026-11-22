import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class PopupPage extends BasePage {
  readonly popupTrigger: Locator;
  readonly collectedPopups: Page[];

  constructor(page: Page) {
    super(page);
    this.popupTrigger = page.locator('#PopUp');
    this.collectedPopups = [];
  }

  trackPopups(): this {
    this.page.context().on('page', (p) => this.collectedPopups.push(p));
    return this;
  }

  async triggerPopups(): Promise<void> {
    // two concurrent page.waitForEvent('popup') calls both resolve with the FIRST popup,
    // so every page the context opens is collected instead
    await this.popupTrigger.click();
  }

  popupCount(): number {
    return this.collectedPopups.length;
  }

  popups(): Page[] {
    return this.collectedPopups;
  }

  async waitForPopupsToLoad(): Promise<void> {
    // external sites are asset-heavy; waiting for the full 'load' event under parallel
    // load can exceed the test timeout, and the URL is committed before assets finish
    await Promise.all(
      this.collectedPopups.map((p) =>
        p
          .waitForLoadState('domcontentloaded', { timeout: 15000 })
          .catch(() => undefined),
      ),
    );
  }

  async openSinglePopup(buttonName: string): Promise<Page> {
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: buttonName }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    return popup;
  }

  popupByUrl(fragment: string): Page | undefined {
    return this.collectedPopups.find((p) => p.url().includes(fragment));
  }

  popupUrls(): string[] {
    return this.collectedPopups.map((p) => p.url());
  }
}
