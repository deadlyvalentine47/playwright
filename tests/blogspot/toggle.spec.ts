import { expect, test } from '@playwright/test';
import { ToggleButtonPage } from '../../pages/blogspot/toggle.page.js';
import { fixtures } from '../../utils/fixtures.js';

const states = fixtures.toggle();

test.describe('Toggle button', () => {
  test.beforeEach(async ({ page }) => {
    await new ToggleButtonPage(page).goto();
  });

  test('walks the full START -> STOP -> START cycle', async ({ page }) => {
    const ui = new ToggleButtonPage(page);

    for (let i = 0; i < states.length; i += 1) {
      const state = states[i]!;

      if (i > 0) {
        await ui.toggle();
      }

      await expect(ui.button, state.label).toHaveText(state.expectedText);
      await expect(ui.button, state.label).toHaveAttribute('name', state.expectedName);
      await expect(ui.button, state.label).toHaveClass(new RegExp(`\\b${state.expectedClass}\\b`));
    }
  });
});
