import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class DatePickerPage extends BasePage {
  readonly input: Locator;
  readonly calendar: Locator;
  readonly calendarTitle: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly days: Locator;

  constructor(page: Page) {
    super(page);
    this.input = page.locator('#datepicker');
    this.calendar = page.locator('.ui-datepicker');
    this.calendarTitle = this.calendar.locator('.ui-datepicker-title');
    this.previousButton = this.calendar.locator('.ui-datepicker-prev');
    this.nextButton = this.calendar.locator('.ui-datepicker-next');
    this.days = this.calendar.locator('.ui-datepicker-calendar td a');
  }

  async open(): Promise<void> {
    await this.input.click();
    await this.calendar.waitFor({ state: 'visible' });
  }

  async currentMonthLabel(): Promise<string> {
    const label = await this.calendarTitle.textContent();
    return (label ?? '').replace(/\s+/g, ' ').trim();
  }

  async goToNextMonth(): Promise<string> {
    const before = await this.currentMonthLabel();
    await this.nextButton.click();
    await this.page.waitForFunction(
      (previous) => document.querySelector('.ui-datepicker-title')?.textContent?.trim() !== previous,
      before,
    );
    return this.currentMonthLabel();
  }

  async selectDay(day: number): Promise<void> {
    await this.days.filter({ hasText: new RegExp(`^${day}$`) }).first().click();
    await this.calendar.waitFor({ state: 'hidden' });
  }

  async value(): Promise<string> {
    return this.input.inputValue();
  }
}
