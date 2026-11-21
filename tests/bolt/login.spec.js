import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import { BoltLoginPage } from '../../pages/bolt/login.page.js';

test.describe('Bolt — login', () => {
  const testData = getTestData('testdata/bolt/login.json');

  for (const testcase of testData) {
    test(`${testcase.testName} — valid credentials reach onboarding`, async ({ page }) => {
      const login = new BoltLoginPage(page);

      await login.goto();
      await login.loginAs(testcase);
      await login.expectAuthenticated();

      await expect(page).toHaveURL(/onboarding|dashboard/);
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }

  test('rejects a wrong password', async ({ page }) => {
    const login = new BoltLoginPage(page);

    await login.goto();
    await login.loginAs({ email: testData[0].email, password: 'definitely-not-the-password' });

    await login.expectLoginRejected();
  });
});
