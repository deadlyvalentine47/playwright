import { expect, test } from '@playwright/test';
import { DialogPage } from '../../pages/blogspot/dialog.page.js';

test.describe('Dialogs', () => {
  test.beforeEach(async ({ page }) => {
    await new DialogPage(page).goto();
  });

  test('simple alert shows a message and accepts', async ({ page }) => {
    const ui = new DialogPage(page);

    const dialog = await ui.triggerSimpleAlert();

    expect(dialog.type).toBe('alert');
    expect(dialog.message).toBe('I am an alert box!');
  });

  test('confirmation alert is dismissed', async ({ page }) => {
    const ui = new DialogPage(page);

    const dialog = await ui.triggerConfirmation(false);
    expect(dialog.type).toBe('confirm');

    await expect(ui.result).toHaveText('You pressed Cancel!');
  });

  test('confirmation alert is accepted', async ({ page }) => {
    const ui = new DialogPage(page);

    await ui.triggerConfirmation(true);

    await expect(ui.result).toHaveText('You pressed OK!');
  });

  test('prompt echoes the entered text', async ({ page }) => {
    const ui = new DialogPage(page);

    const dialog = await ui.triggerPrompt('asdasd');
    expect(dialog.type).toBe('prompt');

    await expect(ui.result).toHaveText('Hello asdasd! How are you today?');
  });
});
