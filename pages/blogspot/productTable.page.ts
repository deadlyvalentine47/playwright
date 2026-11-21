import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export class ProductTablePage extends BasePage {
  readonly table: Locator;
  readonly headers: Locator;
  readonly rows: Locator;
  readonly pagination: Locator;

  constructor(page: Page) {
    super(page);
    this.table = page.locator('#productTable');
    this.headers = this.table.locator('thead th');
    this.rows = this.table.locator('tbody tr');
    this.pagination = page.locator('#pagination li a');
  }

  rowByName(name: string): Locator {
    return this.rows.filter({ hasText: name });
  }

  pageLink(n: number): Locator {
    return this.pagination.filter({ hasText: new RegExp(`^${n}$`) });
  }

  async columnCount(): Promise<number> {
    return this.headers.count();
  }

  async rowCount(): Promise<number> {
    return this.rows.count();
  }

  async productsOnPage(): Promise<string[]> {
    const names = await this.rows.locator('td:nth-child(2)').allTextContents();
    return names.map((n) => n.trim());
  }

  async selectRow(name: string): Promise<void> {
    await this.rowByName(name).locator('input').check();
  }

  async goToPage(n: number): Promise<void> {
    await this.pageLink(n).click();
  }
}
