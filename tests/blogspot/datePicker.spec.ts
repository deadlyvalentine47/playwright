import { expect, test } from '@playwright/test';
import { DatePickerPage } from '../../pages/blogspot/datePicker.page.js';
import { fixtures } from '../../utils/fixtures.js';

const cases = fixtures.datePicker();

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
        await ui.selectDay(testcase.day!);

        await expect(ui.calendar).toBeHidden();
        expect(await ui.value()).toMatch(new RegExp(testcase.expectedValuePattern!));
        return;
      }

      await expect(ui.calendar).toBeVisible();
      expect(await ui.currentMonthLabel()).toMatch(new RegExp(testcase.expectedMonthPattern!));
      expect(await ui.days.count()).toBeGreaterThanOrEqual(testcase.minimumDaysInMonth!);
    });
  }
});
