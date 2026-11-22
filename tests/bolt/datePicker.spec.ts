import { expect, test } from '@playwright/test';
import { BoltOnboardingPage } from '../../pages/bolt/onboarding.page.js';
import { getTestData } from '../../utils/dataProvider.js';
import { env } from '../../utils/env.js';

type Onboarding = {
  testName: string;
  expectedOnboardingUrl: string;
  expectedProgress: string;
  expectedNavLabels: string[];
  dateOfBirth: { year: number; month: number; day: number };
  expectedBirthDate: string;
  minimumMonthOptions: number;
  minimumYearOptions: number;
};

const cases = getTestData<Onboarding>('testdata/bolt/onboarding.json');

test.use({ storageState: env.boltAuthState });

test.describe('Bolt — onboarding date picker', () => {
  test.beforeEach(async ({ page }) => {
    await new BoltOnboardingPage(page).goto();
  });

  for (const data of cases) {
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
  }
});
