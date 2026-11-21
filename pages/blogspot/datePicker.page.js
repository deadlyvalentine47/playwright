import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class DatePickerPage extends BasePage {
  constructor(page) {
    super(page);
    this.input = page.locator('#datepicker');
    this.calendar = page.locator('.ui-datepicker');
    this.calendarTitle = this.calendar.locator('.ui-datepicker-title');
    this.previousButton = this.calendar.locator('.ui-datepicker-prev');
    this.nextButton = this.calendar.locator('.ui-datepicker-next');
    this.days = this.calendar.locator('.ui-datepicker-calendar td a');
  }

  async open() {
    await this.input.click();
    await expect(this.calendar).toBeVisible();
  }

  async currentMonthLabel() {
    return (await this.calendarTitle.textContent()).replace(/\s+/g, ' ').trim();
  }

  async goToNextMonth() {
    const before = await this.currentMonthLabel();
    await this.nextButton.click();
    await expect(this.calendarTitle).not.toHaveText(before);
    return this.currentMonthLabel();
  }

  async selectDay(day) {
    await this.days.filter({ hasText: new RegExp(`^${day}$`) }).first().click();
    await expect(this.calendar).toBeHidden();
  }

  async value() {
    return this.input.inputValue();
  }
}
