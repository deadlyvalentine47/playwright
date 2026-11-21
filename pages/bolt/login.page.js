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
    await this.usernameInput.waitFor({ state: 'visible' });
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

  async waitForAuthenticated() {
    await this.page.waitForURL(/onboarding|dashboard/, { timeout: 20000 });
  }

  async waitForRejected() {
    await this.page.waitForURL(/\/login/, { timeout: 20000 });
  }
}
