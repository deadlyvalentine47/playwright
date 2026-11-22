import type { Locator, Page } from '@playwright/test';

export class NavigationComponent {
  readonly page: Page;
  readonly links: Locator;

  constructor(page: Page) {
    this.page = page;
    this.links = page.locator('#PageList1 a, #PageList2 a');
  }

  async linkLabels(): Promise<string[]> {
    const labels = await this.links.allTextContents();
    return labels.map((l) => l.trim());
  }

  linkByLabel(label: string): Locator {
    return this.links.filter({ hasText: new RegExp(`^${label}$`) });
  }

  async followLink(label: string): Promise<void> {
    await this.linkByLabel(label).click();
  }
}
