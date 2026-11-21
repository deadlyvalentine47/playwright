import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/bolt/homePage.js';

// SKIPPED: same third-party brokerage. The original asserted nothing — it opened the
// date picker and console.logged the month options.
test.describe.skip('Bolt — dropdown', () => {
  test('selects Canada from the country dropdown', async ({ page }) => {
    const homepage = new HomePage(page);

    await homepage.navigateToHomePage();
    await page.getByRole('link', { name: 'Join Real' }).click();
    await page.locator('.mantine-Select-input').click();

    await page.getByRole('option', { name: 'Canada' }).click();
    await expect(page.getByRole('option', { name: 'Canada' })).toBeHidden();
  });
});
