import { expect, test } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';
import { HomePage } from '../../pages/bolt/homePage.js';
import { CreateAccount } from '../../pages/bolt/createAccountPage.js';

// SKIPPED: writes a real user to a third-party brokerage on every run. The original
// comment in this spec admits it: "we can add a delete function to delete data of user
// from db so the testcase will run for same data". Until there is teardown, this cannot
// be a repeatable test.
test.describe.skip('Bolt — create account', () => {
  const testData = getTestData('testdata/bolt/e2eTestData.json');

  for (const testcase of testData) {
    test(testcase.testName, async ({ page }) => {
      const homepage = new HomePage(page);
      const createAccountForm = new CreateAccount(page, testcase);

      await homepage.navigateToHomePage();
      await homepage.signUp();
      await createAccountForm.fillform();

      await expect(page).not.toHaveURL(/join/);
    });
  }
});
