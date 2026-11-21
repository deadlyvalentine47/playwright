import { expect } from '@playwright/test';

export class BoltOnboardingPage {
  constructor(page) {
    this.page = page;
    this.birthDate = page.locator('#birthDate');
    this.datePicker = page.locator('.react-datepicker');
    this.monthSelect = this.datePicker.locator('.react-datepicker__month-select');
    this.yearSelect = this.datePicker.locator('.react-datepicker__year-select');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
  }

  async goto() {
    await this.page.goto('/onboarding/application-form', { waitUntil: 'networkidle' });
    await expect(this.birthDate).toBeVisible();
  }

  async openDatePicker() {
    await this.birthDate.click();
    await expect(this.datePicker).toBeVisible();
  }

  async selectDateOfBirth({ year, month, day }) {
    await this.openDatePicker();
    await this.yearSelect.selectOption(String(year));
    await this.monthSelect.selectOption(String(month));
    await this.datePicker
      .locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)')
      .filter({ hasText: new RegExp(`^${day}$`) })
      .first()
      .click();
    await expect(this.datePicker).toBeHidden();
  }

  async birthDateValue() {
    return this.birthDate.inputValue();
  }
}
