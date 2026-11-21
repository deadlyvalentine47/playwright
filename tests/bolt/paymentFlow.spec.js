import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import { HomePage } from '../../pages/bolt/homePage.js';

// SKIPPED: third-party brokerage. Also structurally broken in the original — it read
// `testData.percent[i]` where testData is an array of objects, so both branches were
// undefined. Kept as a record of the intent, not as a passing test.
test.describe.skip('Bolt — payment flow', () => {
  const testData = getTestData('testdata/bolt/PaymentFlow.json');

  for (const testcase of testData) {
    test(testcase.testName, async ({ page }) => {
      const homepage = new HomePage(page, testcase);

      await homepage.navigateToHomePage();
      await homepage.login();

      await page.getByRole('button', { name: 'Details' }).click();
      await page.getByTestId('adjust-commission-splits').click();

      const amountInputs = page.locator('[id^="commissionParticipant"][id$=".money.amount"]');
      const count = await amountInputs.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i += 1) {
        await amountInputs.nth(i).fill(String(testcase.amount?.[i] ?? '0'));
      }

      await page.getByRole('button', { name: 'Save' }).click();
      await expect(page.getByRole('button', { name: 'Save' })).toBeDisabled({ timeout: 5000 });
    });
  }
});
