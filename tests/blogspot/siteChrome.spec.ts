import { expect, test } from '@playwright/test';
import { HeaderComponent } from '../../components/header.component.js';
import { NavigationComponent } from '../../components/navigation.component.js';
import { fixtures } from '../../utils/fixtures.js';

const data = fixtures.siteChrome();

test.describe('Site chrome', () => {
  for (const target of data.pages) {
    const path = target.path ? `/${target.path}` : '/';

    test(`header renders on ${target.label}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const header = new HeaderComponent(page);

      await expect(header.title).toHaveText(data.expectedTitle);
      await expect(header.description).toContainText(data.expectedDescription);
    });

    test(`navigation exposes the practice links on ${target.label}`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const nav = new NavigationComponent(page);
      const labels = await nav.linkLabels();

      expect(labels, 'every expected nav label should be present').toEqual(
        expect.arrayContaining(data.expectedNavLabels),
      );

      await expect(nav.linkByLabel(data.linkWithHref.label)).toHaveAttribute(
        'href',
        new RegExp(data.linkWithHref.hrefPattern),
      );
    });
  }
});
