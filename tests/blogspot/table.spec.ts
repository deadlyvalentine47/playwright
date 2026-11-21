import { expect, test } from '@playwright/test';
import { ProductTablePage } from '../../pages/blogspot/productTable.page.js';
import { fixtures } from '../../utils/fixtures.js';

const data = fixtures.productTable();
const pageOne = data.pages.find((p) => p.page === 1)!;

test.describe('Product table', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new ProductTablePage(page);
    await ui.goto();
    await expect(ui.table).toBeVisible();
  });

  test('renders the expected columns and rows', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.columnCount()).toBe(data.columnCount);
    expect(await ui.rowCount()).toBe(data.rowsPerPage);
    await expect(ui.headers).toHaveText(data.headers);
  });

  test('selects a single row by product name', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.productsOnPage()).toEqual(pageOne.products.map((p) => p.name));

    await ui.selectRow(data.selection.select);

    await expect(ui.rowByName(data.selection.select).locator('input')).toBeChecked();
    await expect(ui.rowByName(data.selection.leaveChecked).locator('input')).not.toBeChecked();
  });

  for (const pageData of data.pages) {
    test(`pagination renders page ${pageData.page}`, async ({ page }) => {
      const ui = new ProductTablePage(page);

      if (pageData.page > 1) {
        await ui.goToPage(pageData.page);
      }

      for (const product of pageData.products) {
        await expect(ui.rowByName(product.name)).toHaveCount(1);
        await expect(ui.rowByName(product.name)).toContainText(product.price);
      }

      expect(await ui.productsOnPage()).toEqual(pageData.products.map((p) => p.name));
      await expect(ui.pageLink(pageData.page)).toHaveClass(/\bactive\b/);
    });
  }
});
