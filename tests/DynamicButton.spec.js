import { test, expect } from '@playwright/test';

test('Toggle START/STOP button', async ({ page }) => {
  // Go to the page containing your button
  await page.goto('https://testautomationpractice.blogspot.com/');

  // Find the START button (by text, class, or role)
  const button = page.locator('button', { hasText: 'START' });

  // Assert initial state is START
  await expect(button).toHaveText('START');
  await expect(button).toHaveAttribute('name', 'start');
  await expect(button).toHaveClass(/start/); // regex because it may have multiple classes

  // Click the button to toggle to STOP
  await button.click();

  // Re-select the button to reflect updated DOM
  const stopButton = page.locator('button', { hasText: 'STOP' });

  // Assert it toggled correctly to STOP
  await expect(stopButton).toHaveText('STOP');
  await expect(stopButton).toHaveAttribute('name', 'stop');
  await expect(stopButton).toHaveClass(/stop/);

  // Click again to toggle back to START
  await stopButton.click();

  // Final assertions for START again
  const startButton = page.locator('button', { hasText: 'START' });
  await expect(startButton).toHaveText('START');
  await expect(startButton).toHaveAttribute('name', 'start');
  await expect(startButton).toHaveClass(/start/);
});
