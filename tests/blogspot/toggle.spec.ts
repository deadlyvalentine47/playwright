import { expect, test } from '@playwright/test';
import { ToggleButtonPage } from '../../pages/blogspot/toggle.page.js';
import { getTestData } from '../../utils/dataProvider.js';

type ToggleState = {
  label: string;
  expectedText: string;
  expectedName: string;
  expectedClass: string;
};

type ToggleScenario = {
  testName: string;
  expectedStates: ToggleState[];
};

const scenarios = getTestData<ToggleScenario>('testdata/blogspot/toggle.json');

test.describe('Toggle button', () => {
  for (const scenario of scenarios) {
    test(scenario.testName, async ({ page }) => {
      const ui = new ToggleButtonPage(page);
      await ui.goto();

      for (let i = 0; i < scenario.expectedStates.length; i += 1) {
        const state = scenario.expectedStates[i]!;

        // the click happens between assertions: the sequence is the assertion
        if (i > 0) {
          await ui.toggle();
        }

        await test.step(state.label, async () => {
          await expect(ui.button).toHaveText(state.expectedText);
          await expect(ui.button).toHaveAttribute('name', state.expectedName);
          await expect(ui.button).toHaveClass(new RegExp(`\\b${state.expectedClass}\\b`));
        });
      }
    });
  }
});
