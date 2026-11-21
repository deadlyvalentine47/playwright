export class BoltOnboardingPage {
  constructor(page) {
    this.page = page;
    this.birthDate = page.locator('#birthDate');
    this.datePicker = page.locator('.react-datepicker');
    this.monthSelect = this.datePicker.locator('.react-datepicker__month-select');
    this.yearSelect = this.datePicker.locator('.react-datepicker__year-select');
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.previousButton = page.getByRole('button', { name: 'Previous' });
    this.progress = page.getByText(/\d+\s*\/\s*8/);
  }

  async goto() {
    await this.page.goto('/onboarding/application-form', { waitUntil: 'networkidle' });
    await this.birthDate.waitFor({ state: 'visible' });
  }

  async openDatePicker() {
    await this.birthDate.click();
    await this.datePicker.waitFor({ state: 'visible' });
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
    await this.datePicker.waitFor({ state: 'hidden' });
  }

  async birthDateValue() {
    return this.birthDate.inputValue();
  }

  async monthOptionCount() {
    return this.monthSelect.locator('option').count();
  }

  async yearOptionCount() {
    return this.yearSelect.locator('option').count();
  }
}
