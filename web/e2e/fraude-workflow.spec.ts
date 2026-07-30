import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('E2E-08: Workflow fraude — superior → TCE', () => {
  test('P01 vê registros de fraude na aba de governança', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/governanca');
    await expect(page.locator('h1:has-text("Governança")')).toBeVisible({ timeout: 5000 });

    // Click on "Registros de Fraude" tab
    await page.locator('.mat-mdc-tab').filter({ hasText: 'Fraude' }).click();

    // fraud-001 should be visible (no communications yet)
    await expect(page.locator('table:has-text("superfaturamento")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('table:has-text("conflito de interesses")')).toBeVisible({ timeout: 5000 });
  });

  test('P01 comunica fraud-001 ao superior', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/governanca');

    await page.locator('.mat-mdc-tab').filter({ hasText: 'Fraude' }).click();

    // fraud-001 has no communication dates yet → "Comunicar Superior" button visible
    const row = page.locator('tr', { hasText: 'superfaturamento' });
    await expect(row.locator('button:has-text("Comunicar Superior")')).toBeVisible();

    await row.locator('button:has-text("Comunicar Superior")').click();

    // After communication, button changes to "Comunicar TCE"
    await expect(row.locator('button:has-text("Comunicar TCE")')).toBeVisible({ timeout: 5000 });

    // Date column for "Comunicado Superior" should now show a date (not "—")
    await expect(row.locator('td', { hasText: /\d{2}\/\d{2}\/\d{4}/ }).first()).toBeVisible({ timeout: 5000 });
  });

  test('P01 comunica fraud-002 ao TCE (já comunicado ao superior)', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/governanca');

    await page.locator('.mat-mdc-tab').filter({ hasText: 'Fraude' }).click();

    // fraud-002: already communicated to superior → "Comunicar TCE" button
    const row = page.locator('tr', { hasText: 'conflito de interesses' });
    await expect(row.locator('button:has-text("Comunicar TCE")')).toBeVisible();

    await row.locator('button:has-text("Comunicar TCE")').click();

    // After TCE communication → "Concluído" badge
    await expect(row.locator('text=Concluído')).toBeVisible({ timeout: 5000 });
  });

  test('P10 não pode acessar governança', async ({ page }) => {
    await login(page, 'admin.sistema@mvp.local', '123456');
    await page.goto('/governanca');
    // P10 is not in the rolesGuard for /governanca
    await expect(page).not.toHaveURL(/\/governanca/, { timeout: 5000 });
  });
});
