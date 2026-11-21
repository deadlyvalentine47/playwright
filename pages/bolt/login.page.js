import { expect } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';

export class BoltLoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByTestId('usernameOrEmail');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto() {
    await this.page.goto(process.env.BOLT_URL, { waitUntil: 'networkidle' });
    await expect(this.usernameInput).toBeVisible();
  }

  async loginAs(credentials) {
    await this.usernameInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async loginWithFirstFixture(fixturePath = 'testdata/bolt/login.json') {
    const [credentials] = getTestData(fixturePath);
    await this.loginAs(credentials);
    return credentials;
  }

  async expectAuthenticated() {
    await expect(this.page).not.toHaveURL(/\/login/, { timeout: 15000 });
  }

  async expectLoginRejected() {
    await expect(this.page).toHaveURL(/\/login/, { timeout: 15000 });
  }
}
