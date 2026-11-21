import { defineConfig, devices } from '@playwright/test';
import { env } from './utils/env.js';

/**
 * No baseURL here on purpose. It would be resolved when this file loads, which
 * forces every run to define every URL. Each page object asks env for the base
 * URL of the site it drives, so a project only needs its own variables.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { outputFolder: 'reports', open: 'never' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'bolt-auth',
      testMatch: /setup\/.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // every run writes the same auth state file; concurrent runs tear it
      fullyParallel: false,
      workers: 1,
    },
    {
      name: 'blogspot',
      testDir: './tests/blogspot',
      use: { ...devices['Desktop Chrome'] },
      workers: env.workers,
    },
    {
      name: 'bolt',
      testDir: './tests/bolt',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['bolt-auth'],
      // the bolt app invalidates the session when one token is used by several
      // concurrent contexts, so these specs must run one at a time
      fullyParallel: false,
      workers: 1,
    },
  ],
  outputDir: 'screenshots',
  retries: env.retries,
});
