const { expect } = require("@playwright/test");
require("dotenv").config();

class HomePage {
  constructor(page, testcase) {
    this.page = page;
    this.testcase = testcase;
  }

  async navigateToHomePage() {
    console.log(process.env.BOLT_URL);
    await this.page.goto(process.env.BOLT_URL);

    expect(this.page).toHaveTitle("Login - Bolt");
  }

  async signUp() {
    await this.page.getByRole("link", { name: "Join Real" }).click();
  }

  async login() {
    await this.page
      .getByTestId("usernameOrEmail")
      .type(this.testcase.email, { delay: 100 });

    await this.page.getByTestId("password").fill(this.testcase.password);
    // await this.page.getByTestId('password-input-toggle').click();
    // await this.page.waitForTimeout(3000)

    await this.page.getByRole("button", { name: "Login" }).click();

    await this.page.waitForTimeout(3000);
  }
}

module.exports = { HomePage };
