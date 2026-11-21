import { BasePage } from './base.page.js';

export class ProductTablePage extends BasePage {
  constructor(page) {
    super(page);
    this.table = page.locator('#productTable');
    this.headers = this.table.locator('thead th');
    this.rows = this.table.locator('tbody tr');
    this.pagination = page.locator('#pagination li a');
  }

  rowByName(name) {
    return this.rows.filter({ hasText: name });
  }

  pageLink(n) {
    return this.pagination.filter({ hasText: new RegExp(`^${n}$`) });
  }

  async columnCount() {
    return this.headers.count();
  }

  async rowCount() {
    return this.rows.count();
  }

  async productsOnPage() {
    const names = await this.rows.locator('td:nth-child(2)').allTextContents();
    return names.map((n) => n.trim());
  }

  async selectRow(name) {
    await this.rowByName(name).locator('input').check();
  }

  async goToPage(n) {
    await this.pageLink(n).click();
  }
}
