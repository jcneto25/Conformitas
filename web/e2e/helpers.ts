import { Page, expect } from '@playwright/test';

export async function login(
  page: Page,
  email: string,
  senha: string,
): Promise<void> {
  await page.goto('/login');
  await page.waitForSelector('mat-card-title:has-text("Conformitas")', { timeout: 10000 });

  await page.evaluate(() => localStorage.clear());

  await page.fill('input[name="email"]', email);
  await page.fill('input[type="password"]', senha);
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL(/\/mfa|\/dashboard/, { timeout: 15000 });

  if (page.url().includes('/mfa')) {
    const mfaInput = page.locator('input[inputmode="numeric"]');
    await mfaInput.fill('123456');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
  }
}
