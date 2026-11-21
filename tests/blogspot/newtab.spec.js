import { expect, test } from '@playwright/test';
import { PopupPage } from '../../pages/blogspot/popup.page.js';

test.describe('Popups and new tabs', () => {
  test.beforeEach(async ({ page }) => {
    await new PopupPage(page).goto();
  });

  test('opens both popup windows and resolves them by URL', async ({ page }) => {
    const ui = new PopupPage(page).trackPopups();

    await ui.triggerPopups();

    await expect
      .poll(() => ui.popupCount(), { message: 'waiting for 2 popups', timeout: 15000 })
      .toBe(2);

    await ui.waitForPopupsToLoad();

    await expect
      .poll(() => ui.popupUrls().sort().join(' '), { timeout: 15000 })
      .toContain('playwright.dev');
    expect(ui.popupUrls().sort().join(' ')).toContain('selenium.dev');

    const seleniumPopup = ui.popupByUrl('selenium.dev');
    const playwrightPopup = ui.popupByUrl('playwright.dev');

    expect(seleniumPopup).toBeTruthy();
    expect(playwrightPopup).toBeTruthy();

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
