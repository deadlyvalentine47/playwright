import { expect, test } from '@playwright/test';
import { BASE_URL } from '../../pages/blogspot/base.page.js';
import { HeaderComponent } from '../../components/header.component.js';
import { NavigationComponent } from '../../components/navigation.component.js';

const PAGES = [BASE_URL, `${BASE_URL}p/playwrightpractice.html`];

test.describe('Site chrome', () => {
  for (const url of PAGES) {
    const label = url.replace(BASE_URL, '/');

    test(`header renders on ${label}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const header = new HeaderComponent(page);

      await expect(header.title).toHaveText('Automation Testing Practice');
      await expect(header.description).toContainText('For Selenium, Cypress & Playwright');
    });

    test(`navigation exposes the practice links on ${label}`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'domcontentloaded' });

      const nav = new NavigationComponent(page);
      const labels = await nav.linkLabels();

      expect(labels).toContain('Home');
      expect(labels).toContain('PlaywrightPractice');
      expect(labels.length).toBeGreaterThanOrEqual(5);

      await expect(nav.linkByLabel('PlaywrightPractice')).toHaveAttribute(
        'href',
        /playwrightpractice/,
      );
    });
  }
});
