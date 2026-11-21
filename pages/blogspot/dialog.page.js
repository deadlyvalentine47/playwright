import { BasePage } from './base.page.js';

export class DialogPage extends BasePage {
  constructor(page) {
    super(page);
    this.simpleAlert = page.getByRole('button', { name: 'Simple Alert' });
    this.confirmationAlert = page.getByRole('button', { name: 'Confirmation Alert' });
    this.promptAlert = page.getByRole('button', { name: 'Prompt Alert' });
    this.result = page.locator('#demo');
  }

  captureDialog(options) {
    return this.page.waitForEvent('dialog').then(async (dialog) => {
      const message = dialog.message();
      const type = dialog.type();
      if (options.accept) {
        await dialog.accept(options.text);
      } else {
        await dialog.dismiss();
      }
      return { message, type };
    });
  }

  async triggerSimpleAlert() {
    const dialogPromise = this.captureDialog({ accept: true });
    await this.simpleAlert.click();
    return dialogPromise;
  }

  async triggerConfirmation(accept) {
    const dialogPromise = this.captureDialog({ accept });
    await this.confirmationAlert.click();
    return dialogPromise;
  }

  async triggerPrompt(text) {
    const dialogPromise = this.captureDialog({ accept: true, text });
    await this.promptAlert.click();
    return dialogPromise;
  }
}
