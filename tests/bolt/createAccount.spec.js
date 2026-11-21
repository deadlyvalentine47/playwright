import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';

test.use({ storageState: '.auth/bolt.json' });

test.describe('Bolt — onboarding', () => {
  test('lands on the application form at step 2 of 8', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.goto();

    await expect(page).toHaveURL(/onboarding\/application-form/);
    await expect(ui.progress).toHaveText(/2\s*\/\s*8/);
  });

  test('shows the onboarding progress rail', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.goto();

    for (const step of ['Create Account', 'Application Form', 'Application Fee', 'Join Boards']) {
      await expect(page.getByText(step).first()).toBeVisible();
    }
  });
});
