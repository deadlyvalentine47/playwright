import { expect } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ProductTablePage extends BasePage {
  constructor(page) {
    super(page);
    this.table = page.locator('#productTable');
    this.headers = this.table.locator('thead th');
    this.rows = this.table.locator('tbody tr');
    this.pagination = page.locator('#pagination li a');
  }

  async expectLoaded() {
    await expect(this.table).toBeVisible();
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

  rowByName(name) {
    return this.rows.filter({ hasText: name });
  }

  async selectRow(name) {
    const row = this.rowByName(name);
    await expect(row).toHaveCount(1);
    await row.locator('input').check();
    await expect(row.locator('input')).toBeChecked();
  }

  async goToPage(n) {
    const link = this.pagination.filter({ hasText: new RegExp(`^${n}$`) });
    await link.click();
    await expect(link).toHaveClass(/\bactive\b/);
  }
}
