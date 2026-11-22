import { expect, test } from '@playwright/test';
import { DatePickerPage } from '../../pages/blogspot/datePicker.page.js';
import { getTestData } from '../../utils/dataProvider.js';

type DatePickerCase = {
  testName: string;
  action: 'open' | 'nextMonth' | 'selectDay';
  day?: number;
  expectedMonthPattern?: string;
  minimumDaysInMonth?: number;
};

const cases = getTestData<DatePickerCase>('testdata/blogspot/datePicker.json');

test.describe('Date picker', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new DatePickerPage(page);
    await ui.goto();
    await ui.open();
  });

  for (const testcase of cases) {
    test(testcase.testName, async ({ page }) => {
      const ui = new DatePickerPage(page);

      if (testcase.action === 'nextMonth') {
        const before = await ui.currentMonthLabel();
        const after = await ui.goToNextMonth();
        expect(after, 'month should change').not.toBe(before);
        return;
      }

      if (testcase.action === 'selectDay') {
        const day = testcase.day!;

        await ui.selectDay(day);
        await expect(ui.calendar).toBeHidden();

        // derive the expectation from the field instead of hardcoding the day twice:
        // the value is MM/DD/YYYY, so the middle component must be the day clicked
        const value = await ui.value();
        expect(value, 'value should look like MM/DD/YYYY').toMatch(/^\d{2}\/\d{2}\/\d{4}$/);

        const [month, valueDay, year] = value.split('/');
        expect(Number(valueDay), `clicked ${day}, expected ${day} to be written`).toBe(day);
        expect(Number(month)).toBeGreaterThanOrEqual(1);
        expect(Number(month)).toBeLessThanOrEqual(12);
        expect(Number(year)).toBeGreaterThan(1900);
        return;
      }

      await expect(ui.calendar).toBeVisible();
      expect(await ui.currentMonthLabel()).toMatch(new RegExp(testcase.expectedMonthPattern!));
      expect(await ui.days.count()).toBeGreaterThanOrEqual(testcase.minimumDaysInMonth!);
    });
  }
});
