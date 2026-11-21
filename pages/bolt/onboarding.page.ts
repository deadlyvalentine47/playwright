import type { Locator, Page } from '@playwright/test';
import { env } from '../../utils/env.js';

export type DateOfBirth = {
  year: number;
  month: number;
  day: number;
};

export class BoltOnboardingPage {
  readonly page: Page;
  readonly birthDate: Locator;
  readonly datePicker: Locator;
  readonly monthSelect: Locator;
  readonly yearSelect: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly progress: Locator;

  constructor(page: Page) {
    this.page = page;
    this.birthDate = page.locator('#birthDate');
    this.datePicker = page.locator('.react-datepicker');
    this.monthSelect = this.datePicker.locator('.react-datepicker__month-select');
    this.yearSelect = this.datePicker.locator('.react-datepicker__year-select');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.progress = page.getByText(/\d+\s*\/\s*8/);
  }

  async goto(): Promise<void> {
    await this.page.goto(new URL('/onboarding/application-form', env.boltBaseUrl).toString(), {
      waitUntil: 'networkidle',
    });
    await this.birthDate.waitFor({ state: 'visible' });
  }

  async openDatePicker(): Promise<void> {
    await this.birthDate.click();
    await this.datePicker.waitFor({ state: 'visible' });
  }

  async selectDateOfBirth({ year, month, day }: DateOfBirth): Promise<void> {
    await this.openDatePicker();
    await this.yearSelect.selectOption(String(year));
    await this.monthSelect.selectOption(String(month));
    await this.datePicker
      .locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first()
      .click();
    await this.datePicker.waitFor({ state: 'hidden' });
  }

  async birthDateValue(): Promise<string> {
    return this.birthDate.inputValue();
  }

  async monthOptionCount(): Promise<number> {
    return this.monthSelect.locator('option').count();
  }

  async yearOptionCount(): Promise<number> {
    return this.yearSelect.locator('option').count();
  }
}
