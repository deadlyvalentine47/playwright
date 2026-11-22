import { expect, test } from '@playwright/test';
import { PopupPage } from '../../pages/blogspot/popup.page.js';
import { getTestData } from '../../utils/dataProvider.js';

type Popups = {
  popupUrls: string[];
  expectedTitles: Record<string, string>;
  expectedPopupCount: number;
  singlePopupButton: string;
};

const popupCases = getTestData<Popups>('testdata/blogspot/popups.json');

test.describe('Popups and new tabs', () => {
  test.beforeEach(async ({ page }) => {
    await new PopupPage(page).goto();
  });

  for (const data of popupCases) {
    test('opens every expected popup and resolves it by URL', async ({ page }) => {
      const ui = new PopupPage(page).trackPopups();

      await ui.triggerPopups();

      await expect
        .poll(() => ui.popupCount(), {
          message: `waiting for ${data.expectedPopupCount} popups`,
          timeout: 15000,
        })
        .toBe(data.expectedPopupCount);

      await ui.waitForPopupsToLoad();

      for (const fragment of data.popupUrls) {
        await expect
          .poll(() => ui.popupUrls().join(' '), {
            message: `waiting for a popup containing ${fragment}`,
            timeout: 15000,
          })
          .toContain(fragment);

        const popup = ui.popupByUrl(fragment);
        expect(popup).toBeTruthy();
        await expect(popup!).toHaveTitle(data.expectedTitles[fragment]!);
      }
    });

    test(`${data.singlePopupButton} opens exactly one popup`, async ({ page }) => {
      const ui = new PopupPage(page);

      const popup = await ui.openSinglePopup(data.singlePopupButton);

      await expect(popup).toHaveTitle(/.+/);
      expect(popup.url()).not.toBe(page.url());
    });
  }
});
