import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';

test.use({ storageState: '.auth/bolt.json' });

test.describe('Bolt — onboarding date picker', () => {
  test.beforeEach(async ({ page }) => {
    await new BoltOnboardingPage(page).goto();
  });

  test('opens a calendar with selectable month and year', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.openDatePicker();

    await expect(ui.datePicker).toBeVisible();
    expect(await ui.monthSelect.locator('option').count()).toBe(12);
    expect(await ui.yearSelect.locator('option').count()).toBeGreaterThan(50);
  });

  test('selecting a date of birth populates the field', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.selectDateOfBirth({ year: 1999, month: 0, day: 15 });

    expect(await ui.birthDateValue()).toBe('01/15/1999');
    await expect(ui.nextButton).toBeEnabled();
  });

  test('re-opening the picker keeps the selected date', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.selectDateOfBirth({ year: 1999, month: 0, day: 15 });
    await ui.openDatePicker();

    await expect(ui.datePicker).toBeVisible();
    expect(await ui.birthDateValue()).toBe('01/15/1999');
  });
});
