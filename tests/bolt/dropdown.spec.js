import { test } from '@playwright/test';

// SKIPPED: the country dropdown was on the registration form. `/signup`, `/register`,
// `/join` and `/create-account` all render an empty shell now — the public signup flow
// has been removed, and the authenticated account is parked mid-onboarding, so this
// widget is not reachable. Comment kept so the intent survives.
test.describe.skip('Bolt — dropdown', () => {
  test('selects Canada from the country dropdown', async () => {
    throw new Error('unreachable — registration form no longer exists');
  });
});
