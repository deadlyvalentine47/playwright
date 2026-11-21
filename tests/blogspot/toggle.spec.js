import { test } from '@playwright/test';
import { ToggleButtonPage } from '../../pages/blogspot/toggle.page.js';

test.describe('Toggle button', () => {
  test.beforeEach(async ({ page }) => {
    await new ToggleButtonPage(page).goto();
  });

  test('starts in START state', async ({ page }) => {
    const ui = new ToggleButtonPage(page);
    await ui.expectStartState();
  });

  test('toggles START -> STOP -> START', async ({ page }) => {
    const ui = new ToggleButtonPage(page);

    await ui.expectStartState();
    await ui.toggle();
    await ui.expectStopState();
    await ui.toggle();
    await ui.expectStartState();
  });
});
