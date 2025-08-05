const { defineConfig, devices } = require('@playwright/test');
// import { defineConfig, devices } from '@playwright/test'

require('dotenv').config({ path: process.env.ENV_FILE || '.env' });

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  // retries: 3,
  reporter: [
    ['html', { outputFolder: 'reports', open: 'never' }],
    // ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
    // actionTimeout: 5000
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'Firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'WebKit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
  outputDir: 'screenshots', // For artifacts like screenshots

  // CI/CD specific settings
  workers: process.env.CI ? 1 : undefined,
  retries: process.env.CI ? 2 : 0,
});
