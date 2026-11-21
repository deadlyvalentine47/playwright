import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import { HomePage } from '../../pages/bolt/homePage.js';

// SKIPPED: targets bolt.playrealbrokerage.com, a third-party brokerage. Needs a real
// account, is rate-limited, and would create real state on someone else's system.
// Re-enable when pointed at a disposable environment.
test.describe.skip('Bolt — login', () => {
  const testData = getTestData('testdata/bolt/login.json');

  for (const testcase of testData) {
    test(testcase.testName, async ({ page }) => {
      const homePage = new HomePage(page, testcase);

      await homePage.navigateToHomePage();
      await homePage.login();

      await expect(page).not.toHaveURL(/login/);
    });
  }
});
