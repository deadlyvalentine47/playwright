import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { defineConfig, devices } from '@playwright/test';

/**
 * The only file that reads process.env.
 *
 * `??` gives every value a concrete type, so nothing downstream writes `!`.
 * `baseURL` and `storageState` live on the project, which is why page objects
 * navigate with relative paths and specs never import an env module.
 *
 * ENV_FILE selects which file to load, so `ENV_FILE=.env.qa npm test` works.
 * `import 'dotenv/config'` cannot do this — it always reads `.env`.
 */
export const ENV_FILE = process.env.ENV_FILE ?? '.env';
loadEnv({ path: path.resolve(ENV_FILE), quiet: true });

const BLOGSPOT_BASE_URL =
  process.env.BLOGSPOT_BASE_URL ?? 'https://testautomationpractice.blogspot.com/';
const BOLT_BASE_URL = process.env.BOLT_BASE_URL ?? 'https://bolt.playrealbrokerage.com';
const BOLT_AUTH_STATE = process.env.BOLT_AUTH_STATE ?? '.auth/bolt.json';
const SAUCE_DEMO_URL = process.env.SAUCE_DEMO_URL;

/**
 * No "fail if unset in CI" check here on purpose. This module is re-evaluated
 * inside every worker process, where argv and the selected project are not
 * reliably visible — a project-scoped guard in this file misfires and reports
 * the wrong variable. scripts/check-env.ts is the pipeline step for that, run
 * once before the suite.
 */

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { outputFolder: 'reports', open: 'never' }]],
  use: {
    // Without these, one stuck action consumes the whole test timeout and the
    // report only says "Test timeout exceeded", with no indication of which step.
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
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BOLT_BASE_URL,
      },
      // every run writes the same auth state file; concurrent runs tear it
      fullyParallel: false,
      workers: 1,
    },
    {
      name: 'blogspot',
      testDir: './tests/blogspot',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BLOGSPOT_BASE_URL,
      },
    },
    {
      name: 'bolt',
      testDir: './tests/bolt',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BOLT_BASE_URL,
        // the session written by bolt-auth; specs inherit it, no test.use needed
        storageState: BOLT_AUTH_STATE,
      },
      dependencies: ['bolt-auth'],
      // the bolt app invalidates the session when one token is used by several
      // concurrent contexts, so these specs must run one at a time
      fullyParallel: false,
      workers: 1,
    },
    {
      name: 'sauce',
      testDir: './tests/sauce',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: SAUCE_DEMO_URL,
      },
    }
  ],
  outputDir: 'screenshots',
  /**
   * Top level, not per project. Playwright resolves the run-level count from
   * config.workers or defaults to 50% of cores, and a project's workers cannot
   * exceed it. On a 4-core CI runner that silently capped every project at 2.
   */
  workers: Number(process.env.WORKERS ?? (process.env.CI ? 1 : 4)),
  retries: Number(process.env.RETRIES ?? (process.env.CI ? 2 : 0)),
});
