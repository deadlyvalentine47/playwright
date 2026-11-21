import { expect, test } from '@playwright/test';
import { DatePickerPage } from '../../pages/blogspot/datePicker.page.js';

test.describe('Date picker', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new DatePickerPage(page);
    await ui.goto();
    await ui.open();
  });

  test('opens the calendar on the current month with a full month of days', async ({ page }) => {
    const ui = new DatePickerPage(page);

    await expect(ui.calendar).toBeVisible();
    expect(await ui.currentMonthLabel()).toMatch(/^[A-Z][a-z]+ \d{4}$/);
    expect(await ui.days.count()).toBeGreaterThanOrEqual(28);
  });

  test('advances to the next month', async ({ page }) => {
    const ui = new DatePickerPage(page);

    const before = await ui.currentMonthLabel();
    const after = await ui.goToNextMonth();

    expect(after).not.toBe(before);
  });

  test('selecting a day writes a date into the input', async ({ page }) => {
    const ui = new DatePickerPage(page);

    await ui.selectDay(15);

    await expect(ui.calendar).toBeHidden();
    expect(await ui.value()).toMatch(/^\d{2}\/15\/\d{4}$/);
  });
});
