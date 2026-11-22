import { expect, test } from '@playwright/test';
import { ProductTablePage, type ProductRow } from '../../pages/blogspot/productTable.page.js';
import { testData } from '../../utils/testData.js';

const data = testData.productTable();
const pricePattern = new RegExp(data.pricePattern);

/**
 * These specs assert on the structure and invariants of the table, not on the
 * products it happens to contain. The contents belong to the site; the schema,
 * the row count, the ID sequencing and the pagination behaviour are what we
 * actually depend on. Renaming a product must not fail them.
 */
test.describe('Product table', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new ProductTablePage(page);
    await ui.goto();
    await expect(ui.table).toBeVisible();
  });

  test('renders the expected columns and row count', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.headerLabels()).toEqual(data.expectedHeaders);
    expect(await ui.columnCount()).toBe(data.expectedHeaders.length);
    expect(await ui.rowCount()).toBe(data.rowsPerPage);
  });

  test('every row is well formed', async ({ page }) => {
    const ui = new ProductTablePage(page);
    const rows = await ui.readRows();

    expect(rows).toHaveLength(data.rowsPerPage);

    for (const row of rows) {
      expect(row.id, `row id should be a positive number: ${JSON.stringify(row)}`).toBeGreaterThan(0);
      expect(row.name, 'row name should not be blank').not.toBe('');
      expect(row.price, `price should match ${data.pricePattern}`).toMatch(pricePattern);
    }
  });

  test('row ids are unique on this page', async ({ page }) => {
    const ui = new ProductTablePage(page);
    const ids = (await ui.readRows()).map((r: ProductRow) => r.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  test('selecting one row checks only that row', async ({ page }) => {
    const ui = new ProductTablePage(page);
    const names = await ui.productNames();

    // a product we know exists, because we just read it from the page
    const target = names[0]!;
    const other = names[1]!;

    await ui.selectRow(target);

    await expect(ui.rowByName(target).locator('input')).toBeChecked();
    await expect(ui.rowByName(other).locator('input')).not.toBeChecked();
  });

  test('pagination swaps pages without repeating a product', async ({ page }) => {
    const ui = new ProductTablePage(page);
    const pages = await ui.pageNumbers();

    expect(pages.length).toBeGreaterThan(1);

    const seen = new Set<string>();
    const idsSeen: number[] = [];

    for (const pageNumber of pages) {
      await ui.goToPage(pageNumber);
      await expect(ui.pageLink(pageNumber)).toHaveClass(/\bactive\b/);

      const rows = await ui.readRows();
      expect(rows).toHaveLength(data.rowsPerPage);

      for (const row of rows) {
        expect(seen.has(row.name), `"${row.name}" appears on more than one page`).toBe(false);
        seen.add(row.name);
        idsSeen.push(row.id);
      }
    }

    // ids should be globally unique and ascending across the whole table
    expect(new Set(idsSeen).size).toBe(idsSeen.length);
  });
});
