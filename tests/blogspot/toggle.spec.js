import { expect, test } from '@playwright/test';
import { ToggleButtonPage } from '../../pages/blogspot/toggle.page.js';

test.describe('Toggle button', () => {
  test.beforeEach(async ({ page }) => {
    await new ToggleButtonPage(page).goto();
  });

  test('starts in START state', async ({ page }) => {
    const ui = new ToggleButtonPage(page);

    await expect(ui.button).toHaveText('START');
    await expect(ui.button).toHaveAttribute('name', 'start');
    await expect(ui.button).toHaveClass(/\bstart\b/);
  });

  test('toggles START -> STOP -> START', async ({ page }) => {
    const ui = new ToggleButtonPage(page);

    await expect(ui.button).toHaveAttribute('name', 'start');

    await ui.toggle();
    await expect(ui.button).toHaveText('STOP');
    await expect(ui.button).toHaveAttribute('name', 'stop');
    await expect(ui.button).toHaveClass(/\bstop\b/);

    await ui.toggle();
    await expect(ui.button).toHaveText('START');
    await expect(ui.button).toHaveAttribute('name', 'start');
  });
});
