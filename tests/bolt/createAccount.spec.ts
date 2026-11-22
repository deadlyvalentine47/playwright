import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';
import { testData } from '../../utils/testData.js';
import { env } from '../../utils/env.js';

const data = testData.onboarding();

test.use({ storageState: env.boltAuthState });

test.describe('Bolt — onboarding', () => {
  test('lands on the expected application form step', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.goto();

    await expect(page).toHaveURL(new RegExp(data.expectedOnboardingUrl));
    await expect(ui.progress).toHaveText(new RegExp(data.expectedProgress.replace('/', '\\s*\\/\\s*')));
  });

  test('shows every step of the onboarding progress rail', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.goto();

    for (const step of data.expectedNavLabels) {
      await expect(page.getByText(step).first()).toBeVisible();
    }
  });
});
