import type { Locator, Page } from '@playwright/test';
import { getTestData } from '../../utils/dataProvider.js';

export type BoltCredentials = {
  testName: string;
  email: string;
  password: string;
};

export class BoltLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByTestId('usernameOrEmail');
    this.passwordInput = page.getByTestId('password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'networkidle' });
    await this.usernameInput.waitFor({ state: 'visible' });
  }

  async loginAs(credentials: Pick<BoltCredentials, 'email' | 'password'>): Promise<void> {
    await this.usernameInput.fill(credentials.email);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }

  async loginWithFirstFixture(
    fixturePath = 'testdata/bolt/login.json',
  ): Promise<BoltCredentials> {
    const [credentials] = getTestData<BoltCredentials>(fixturePath);
    if (!credentials) {
      throw new Error(`No credentials found in ${fixturePath}`);
    }
    await this.loginAs(credentials);
    return credentials;
  }

  async waitForAuthenticated(): Promise<void> {
    await this.page.waitForURL(/onboarding|dashboard/, { timeout: 20000 });
  }

  async waitForRejected(): Promise<void> {
    await this.page.waitForURL(/\/login/, { timeout: 20000 });
  }
}
