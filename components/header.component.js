export class HeaderComponent {
  constructor(page) {
    this.page = page;
    this.title = page.locator('h1.title').first();
    this.description = page.locator('p.description').first();
  }

  async titleText() {
    return (await this.title.textContent()).replace(/\s+/g, ' ').trim();
  }

  async descriptionText() {
    return (await this.description.textContent()).replace(/\s+/g, ' ').trim();
  }
}
