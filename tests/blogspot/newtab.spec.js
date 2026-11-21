import { expect, test } from '@playwright/test';
import { PopupPage } from '../../pages/blogspot/popup.page.js';

test.describe('Popups and new tabs', () => {
  test.beforeEach(async ({ page }) => {
    await new PopupPage(page).goto();
  });

  test('opens both popup windows and resolves them by URL', async ({ page }) => {
    const ui = new PopupPage(page);

    const popups = await ui.openTwoPopups();
    expect(popups).toHaveLength(2);

    const seleniumPopup = ui.popupByUrl(popups, 'selenium.dev');
    const playwrightPopup = ui.popupByUrl(popups, 'playwright.dev');

    await expect(seleniumPopup).toHaveTitle('Selenium');
    await expect(playwrightPopup).toHaveTitle(/Playwright/);
  });

  test('New Tab button opens exactly one popup', async ({ page }) => {
    const ui = new PopupPage(page);

    const popup = await ui.openSinglePopup('New Tab');

    await expect(popup).toHaveTitle(/.+/);
    expect(popup.url()).not.toBe(page.url());
  });
});
