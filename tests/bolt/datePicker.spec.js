import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import { HomePage } from '../../pages/bolt/homePage.js';

// SKIPPED: third-party brokerage. Original had zero assertions — it clicked the date
// input and printed the month options to the console.
test.describe.skip('Bolt — date picker', () => {
  const testData = getTestData('testdata/bolt/datePicker.json');

  for (const testcase of testData) {
    test('opens the birth date picker', async ({ page }) => {
      const hp = new HomePage(page, testcase);

      await hp.navigateToHomePage();
      await hp.login();

      await page.locator('#birthDate').click();
      await expect(page.locator('.react-datepicker__month-select').first()).toBeVisible();
    });
  }
});
