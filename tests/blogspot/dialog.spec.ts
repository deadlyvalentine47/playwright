import { expect, test } from '@playwright/test';
import { DialogPage } from '../../pages/blogspot/dialog.page.js';
import { testData } from '../../utils/testData.js';

const cases = testData.dialogs();

test.describe('Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await new DialogPage(page).goto();
  });

  for (const testcase of cases) {
    test(testcase.testName, async ({ page }) => {
      const ui = new DialogPage(page);

      const dialog = await (testcase.trigger === 'simple'
        ? ui.triggerSimpleAlert()
        : testcase.trigger === 'confirmation'
          ? ui.triggerConfirmation(testcase.accept ?? false)
          : ui.triggerPrompt(testcase.promptText ?? ''));

      expect(dialog.type).toBe(testcase.expectedType);
      expect(dialog.message).toBe(testcase.expectedMessage);

      if (testcase.expectedResult === null) {
        await expect(ui.result).toHaveText('');
      } else {
        await expect(ui.result).toHaveText(testcase.expectedResult);
      }
    });
  }
});
