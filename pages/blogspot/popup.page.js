import { BasePage } from './base.page.js';

export class PopupPage extends BasePage {
  constructor(page) {
    super(page);
    this.popupTrigger = page.locator('#PopUp');
    this.collectedPopups = [];
  }

  trackPopups() {
    this.page.context().on('page', (p) => this.collectedPopups.push(p));
    return this;
  }

  async triggerPopups() {
    // two concurrent page.waitForEvent('popup') calls both resolve with the FIRST popup,
    // so every page the context opens is collected instead
    await this.popupTrigger.click();
  }

  popupCount() {
    return this.collectedPopups.length;
  }

  popups() {
    return this.collectedPopups;
  }

  async waitForPopupsToLoad() {
    await Promise.all(this.collectedPopups.map((p) => p.waitForLoadState().catch(() => {})));
  }

  async openSinglePopup(buttonName) {
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: buttonName }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    return popup;
  }

  popupByUrl(fragment) {
    return this.collectedPopups.find((p) => p.url().includes(fragment));
  }

  popupUrls() {
    return this.collectedPopups.map((p) => p.url());
  }
}
