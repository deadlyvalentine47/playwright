import type { Locator, Page } from '@playwright/test';
import { BasePage, type DialogCapture } from './base.page.js';

type CaptureOptions = {
  accept: boolean;
  text?: string;
};

export class DialogPage extends BasePage {
  readonly simpleAlert: Locator;
  readonly confirmationAlert: Locator;
  readonly promptAlert: Locator;
  readonly result: Locator;

  constructor(page: Page) {
    super(page);
    this.simpleAlert = page.getByRole('button', { name: 'Simple Alert' });
    this.confirmationAlert = page.getByRole('button', { name: 'Confirmation Alert' });
    this.promptAlert = page.getByRole('button', { name: 'Prompt Alert' });
    this.result = page.locator('#demo');
  }

  private captureDialog(options: CaptureOptions): Promise<DialogCapture> {
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

  async triggerSimpleAlert(): Promise<DialogCapture> {
    const dialogPromise = this.captureDialog({ accept: true });
    await this.simpleAlert.click();
    return dialogPromise;
  }

  async triggerConfirmation(accept: boolean): Promise<DialogCapture> {
    const dialogPromise = this.captureDialog({ accept });
    await this.confirmationAlert.click();
    return dialogPromise;
  }

  async triggerPrompt(text: string): Promise<DialogCapture> {
    const dialogPromise = this.captureDialog({ accept: true, text });
    await this.promptAlert.click();
    return dialogPromise;
  }
}
