import { test } from '@playwright/test';

// SKIPPED: the commission-split payment flow lives inside a deal, which requires an
// account past onboarding (this one is at step 2 of 8) plus a deal assigned to it.
// The original spec was also structurally broken — it read `testData.percent[i]` where
// testData is an array of objects. Re-enable when there is a seeded test tenant.
test.describe.skip('Bolt — payment flow', () => {
  test('adjusts commission splits', async () => {
    throw new Error('unreachable — needs an onboarded account with a deal');
  });
});
