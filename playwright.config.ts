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
    // Without these, a single stuck action consumes the whole test timeout and
    // the report says only "Test timeout of 60000ms exceeded" — no indication of
    // which step hung. These turn that into a named failure in seconds.
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
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
    },
    {
      name: 'blogspot',
      testDir: './tests/blogspot',
      use: { ...devices['Desktop Chrome'] },
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
  /**
   * Set at the TOP level, not per project. Playwright resolves the run-level
   * count from config.workers or defaults to "50%" of cores, and a project's
   * workers cannot exceed it. On a 4-core CI runner the 50% default silently
   * capped every project at 2 regardless of its own setting.
   */
  workers: env.workers,
  retries: env.retries,
});
