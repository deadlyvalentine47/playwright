import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class PopupPage extends BasePage {
  constructor(page) {
    super(page);
    this.popupTrigger = page.locator('#PopUp');
  }

  async openTwoPopups() {
    const context = this.page.context();
    const popups = [];
    context.on('page', (p) => popups.push(p));

    await this.popupTrigger.click();
    await expect.poll(() => popups.length, { message: 'waiting for 2 popups' }).toBe(2);

    await Promise.all(popups.map((p) => p.waitForLoadState()));
    return popups;
  }

  async openSinglePopup(buttonName) {
    const popupPromise = this.page.waitForEvent('popup');
    await this.page.getByRole('button', { name: buttonName }).click();
    const popup = await popupPromise;
    await popup.waitForLoadState();
    return popup;
  }

  popupByUrl(popups, fragment) {
    const match = popups.find((p) => p.url().includes(fragment));
    expect(match, `no popup matching "${fragment}" among ${popups.map((p) => p.url())}`).toBeTruthy();
    return match;
  }
}
