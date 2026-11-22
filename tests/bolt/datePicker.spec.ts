import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';
import { testData } from '../../utils/testData.js';
import { env } from '../../utils/env.js';

const data = testData.onboarding();

test.use({ storageState: env.boltAuthState });

test.describe('Bolt — onboarding date picker', () => {
  test.beforeEach(async ({ page }) => {
    await new BoltOnboardingPage(page).goto();
  });

  test('opens a calendar with selectable month and year', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.openDatePicker();

    await expect(ui.datePicker).toBeVisible();
    expect(await ui.monthOptionCount()).toBeGreaterThanOrEqual(data.minimumMonthOptions);
    expect(await ui.yearOptionCount()).toBeGreaterThan(data.minimumYearOptions);
  });

  test('selecting a date of birth populates the field', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.selectDateOfBirth(data.dateOfBirth);

    expect(await ui.birthDateValue()).toBe(data.expectedBirthDate);
    await expect(ui.nextButton).toBeEnabled();
  });

  test('re-opening the picker keeps the selected date', async ({ page }) => {
    const ui = new BoltOnboardingPage(page);

    await ui.selectDateOfBirth(data.dateOfBirth);
    await ui.openDatePicker();

    await expect(ui.datePicker).toBeVisible();
    expect(await ui.birthDateValue()).toBe(data.expectedBirthDate);
  });
});
