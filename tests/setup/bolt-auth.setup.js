import { test as setup, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { BoltLoginPage } from '../../pages/bolt/login.page.js';

export const AUTH_FILE = path.join('.auth', 'bolt.json');

setup('authenticate to Bolt', async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });

  const login = new BoltLoginPage(page);
  await login.goto();
  await login.loginWithFirstFixture();
  await login.expectAuthenticated();

  await expect(page.locator('body')).not.toBeEmpty();

  await page.context().storageState({ path: AUTH_FILE });
});
