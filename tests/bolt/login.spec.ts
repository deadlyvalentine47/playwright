import { expect, test } from '@playwright/test';
import { BoltLoginPage } from '../../pages/bolt/login.page.js';
import { getTestData } from '../../utils/dataProvider.js';

type BoltCredentials = {
  testName: string;
  email: string;
  password: string;
};

const credentials = getTestData<BoltCredentials>('testdata/bolt/login.json');

// The bolt project inherits the logged-in session from bolt-auth. These specs are
// about the login form itself, so they must start logged OUT.
test.use({ storageState: { cookies: [], origins: [] } });

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

    test(`rejects a wrong password for ${testcase.email}`, async ({ page }) => {
      const login = new BoltLoginPage(page);

      await login.goto();
      await login.loginAs({ email: testcase.email, password: 'definitely-not-the-password' });
      await login.waitForRejected();

      expect(page.url()).toMatch(/\/login/);
    });
  }
});
