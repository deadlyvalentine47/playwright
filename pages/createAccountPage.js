require("dotenv").config();

class CreateAccount {
  constructor(page, testcase) {
    this.page = page;
    this.testcase = testcase;
  }

  async fillform() {
    await this.page.getByTestId("firstName").fill(this.testcase.firstName);
    await this.page.getByTestId("lastName").fill(this.testcase.lastName);
    await this.page.getByTestId("username").fill(this.testcase.userName);
    await this.page.getByTestId("emailAddress").fill(this.testcase.email);

    await this.page.getByTestId("password").fill(this.testcase.password);
    await this.page.getByTestId("confirmPassword").fill(this.testcase.password);

    await this.page.getByRole("checkbox", { name: "terms" }).check();
    await this.page.getByRole("checkbox", { name: "permission" }).check();

    await this.page.getByTestId("country").click();

    await this.page.$$(".mantine-Select-item");
    await this.page.getByRole("option", { name: "United States" }).click();

    await this.page.getByRole("button", { name: "Create Account" }).click();

    await this.page.waitForTimeout(3000);
  }
}

module.exports = { CreateAccount };
