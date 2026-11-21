import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';
import { fixtures } from '../../utils/fixtures.js';
import { env } from '../../utils/env.js';

const data = fixtures.onboarding();

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
