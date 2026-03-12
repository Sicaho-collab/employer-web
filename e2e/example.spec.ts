import { test, expect } from '@playwright/test';

test('app loads and shows landing page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Alumable/i);
});
