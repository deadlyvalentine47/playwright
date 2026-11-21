import { expect, test } from '@playwright/test';
import { BoltLoginPage } from '../../pages/bolt/login.page.js';
import { fixtures } from '../../utils/fixtures.js';

const credentials = fixtures.boltLogin();
const first = credentials[0]!;

test.describe('Bolt — login', () => {
  for (const testcase of credentials) {
    test(`${testcase.testName} — valid credentials reach onboarding`, async ({ page }) => {
      const login = new BoltLoginPage(page);

      await login.goto();
      await login.loginAs(testcase);
      await login.waitForAuthenticated();

      expect(page.url()).toMatch(/onboarding|dashboard/);
      await expect(page.locator('body')).not.toBeEmpty();
    });
  }

  test('rejects a wrong password', async ({ page }) => {
    const login = new BoltLoginPage(page);

    await login.goto();
    await login.loginAs({ email: first.email, password: 'definitely-not-the-password' });
    await login.waitForRejected();

    expect(page.url()).toMatch(/\/login/);
  });
});
