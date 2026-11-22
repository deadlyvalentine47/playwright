import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page.js';

export type ProductRow = {
  id: number;
  name: string;
  price: string;
};

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

  async headerLabels(): Promise<string[]> {
    const labels = await this.headers.allTextContents();
    return labels.map((l) => l.trim());
  }

  /**
   * Reads every row from the DOM rather than comparing against a stored copy.
   * The table's contents belong to the site, so the specs assert on the shape of
   * this data, not on specific products.
   */
  async readRows(): Promise<ProductRow[]> {
    return this.rows.evaluateAll((trs) =>
      trs.map((tr) => {
        const cells = Array.from(tr.querySelectorAll('td'));
        return {
          id: Number(cells[0]?.textContent?.trim() ?? ''),
          name: cells[1]?.textContent?.trim() ?? '',
          price: cells[2]?.textContent?.trim() ?? '',
        };
      }),
    );
  }

  async productNames(): Promise<string[]> {
    const rows = await this.readRows();
    return rows.map((r) => r.name);
  }

  async pageNumbers(): Promise<number[]> {
    return this.pagination.evaluateAll((links) =>
      links.map((a) => Number(a.textContent?.trim() ?? '')),
    );
  }

  async selectRow(name: string): Promise<void> {
    await this.rowByName(name).locator('input').check();
  }

  async goToPage(n: number): Promise<void> {
    await this.pageLink(n).click();
  }
}
