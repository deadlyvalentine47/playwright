import { expect, test } from '@playwright/test';
import { ProductTablePage, type ProductRow } from '../../pages/blogspot/productTable.page.js';
import { getTestData } from '../../utils/dataProvider.js';

type ProductTable = {
  rowsPerPage: number;
  expectedHeaders: string[];
  pricePattern: string;
  selection: { select: string; leaveChecked: string };
};

const tables = getTestData<ProductTable>('testdata/blogspot/productTable.json');

test.describe('Product table', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new ProductTablePage(page);
    await ui.goto();
    await expect(ui.table).toBeVisible();
  });

  for (const data of tables) {
    const pricePattern = new RegExp(data.pricePattern);

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
        expect(row.id, `id should be positive: ${JSON.stringify(row)}`).toBeGreaterThan(0);
        expect(row.name, 'name should not be blank').not.toBe('');
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

      await ui.selectRow(data.selection.select);

      await expect(ui.rowByName(data.selection.select).locator('input')).toBeChecked();
      expect(await ui.rowByName(data.selection.leaveChecked).locator('input').isChecked()).toBe(false);
    });

    test('pagination covers every page without repeating a product', async ({ page }) => {
      const ui = new ProductTablePage(page);
      const pages = await ui.pageNumbers();

      expect(pages.length).toBeGreaterThan(1);

      const names = new Set<string>();
      const ids: number[] = [];

      for (const pageNumber of pages) {
        await ui.goToPage(pageNumber);
        await expect(ui.pageLink(pageNumber)).toHaveClass(/\bactive\b/);

        const rows = await ui.readRows();
        expect(rows).toHaveLength(data.rowsPerPage);

        for (const row of rows) {
          expect(names.has(row.name), `"${row.name}" appears on more than one page`).toBe(false);
          names.add(row.name);
          ids.push(row.id);
        }
      }

      expect(new Set(ids).size).toBe(ids.length);
    });
  }
});
