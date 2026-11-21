export class NavigationComponent {
  constructor(page) {
    this.page = page;
    this.links = page.locator('#PageList1 a, #PageList2 a');
  }

  async linkLabels() {
    const labels = await this.links.allTextContents();
    return labels.map((l) => l.trim());
  }

  linkByLabel(label) {
    return this.links.filter({ hasText: new RegExp(`^${label}$`) });
  }

  async followLink(label) {
    await this.linkByLabel(label).click();
  }
}
