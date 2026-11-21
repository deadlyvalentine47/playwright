import { expect } from '@playwright/test';

export class HomePage {
  constructor(page, testcase) {
    this.page = page;
    this.testcase = testcase;
  }

  async navigateToHomePage() {
    await this.page.goto(process.env.BOLT_URL, { waitUntil: 'domcontentloaded' });
  }

  async expectLoginPage() {
    await expect(this.page).toHaveTitle('Login - Bolt');
  }

  async signUp() {
    await this.page.getByRole('link', { name: 'Join Real' }).click();
  }

  async login() {
    await this.page.getByTestId('usernameOrEmail').fill(this.testcase.email);
    await this.page.getByTestId('password').fill(this.testcase.password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
