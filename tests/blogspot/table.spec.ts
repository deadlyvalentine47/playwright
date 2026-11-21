import { expect, test } from '@playwright/test';
import { ProductTablePage } from '../../pages/blogspot/productTable.page.js';

const PAGE_ONE = ['Smartphone', 'Laptop', 'Tablet', 'Smartwatch', 'Wireless Earbuds'];

test.describe('Product table', () => {
  test.beforeEach(async ({ page }) => {
    const ui = new ProductTablePage(page);
    await ui.goto();
    await expect(ui.table).toBeVisible();
  });

  test('renders the expected columns and rows', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.columnCount()).toBe(4);
    expect(await ui.rowCount()).toBe(5);
    await expect(ui.headers).toHaveText(['ID', 'Name', 'Price', 'Select']);
  });

  test('selects a single row by product name', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.productsOnPage()).toEqual(PAGE_ONE);

    await ui.selectRow('Smartphone');

    await expect(ui.rowByName('Smartphone').locator('input')).toBeChecked();
    await expect(ui.rowByName('Laptop').locator('input')).not.toBeChecked();
  });

  test('pagination swaps the visible page and marks it active', async ({ page }) => {
    const ui = new ProductTablePage(page);

    expect(await ui.productsOnPage()).toEqual(PAGE_ONE);

    await ui.goToPage(2);

    await expect(ui.pageLink(2)).toHaveClass(/\bactive\b/);
    await expect(ui.pageLink(1)).not.toHaveClass(/\bactive\b/);

    const pageTwo = await ui.productsOnPage();
    expect(pageTwo).not.toEqual(PAGE_ONE);
    expect(pageTwo).toHaveLength(5);
  });
});
