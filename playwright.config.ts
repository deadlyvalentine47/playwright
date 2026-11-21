import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { outputFolder: 'reports', open: 'never' }]],
  use: {
    baseURL: process.env.BOLT_URL ?? 'https://bolt.playrealbrokerage.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'bolt-auth',
      testMatch: /setup\/.*\.setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
      // every run writes the same .auth/bolt.json; concurrent runs tear the file
      fullyParallel: false,
      workers: 1,
    },
    {
      name: 'blogspot',
      testDir: './tests/blogspot',
      use: { ...devices['Desktop Chrome'], baseURL: 'https://testautomationpractice.blogspot.com' },
      // blogspot rate-limits concurrent connections; 4 is the sweet spot
      workers: process.env.CI ? 1 : 4,
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
  retries: process.env.CI ? 2 : 0,
});
