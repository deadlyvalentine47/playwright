import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { BoltLoginPage } from '../../pages/bolt/login.page.js';

test('authenticate to Bolt', async ({ page }) => {
  const authFile = path.resolve(process.env.BOLT_AUTH_STATE ?? '.auth/bolt.json');
  fs.mkdirSync(path.dirname(authFile), { recursive: true });

  const login = new BoltLoginPage(page);
  await login.goto();
  await login.loginWithFirstFixture();
  await login.waitForAuthenticated();

  await expect(page.locator('body')).not.toBeEmpty();

  await page.context().storageState({ path: authFile });
});
