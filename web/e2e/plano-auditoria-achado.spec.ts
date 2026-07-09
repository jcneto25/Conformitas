import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Fluxo: Plano → Auditoria → Achado', () => {
  test.beforeEach(async ({ page }) => {
    // Login como P02 (Auditor) — necessário para acessar /achados/novo
    await login(page, 'carlos.pontes@mvp.local', '123456');
  });

  test('deve listar planos de auditoria', async ({ page }) => {
    await page.goto('/planos');
    await expect(page.locator('h1:has-text("Planos")')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('app-plano-list mat-card:has(mat-card-title)')).not.toHaveCount(0);
  });

  test('deve listar auditorias', async ({ page }) => {
    await page.goto('/auditorias');
    await expect(page.locator('h1:has-text("Auditorias")')).toBeVisible({ timeout: 5000 });
  });

  test('deve listar achados', async ({ page }) => {
    await page.goto('/achados');
    await expect(page.locator('h1:has-text("Quadro de Achados")')).toBeVisible({ timeout: 5000 });
  });

  test('deve abrir formulário de novo achado', async ({ page }) => {
    await page.goto('/achados/novo');
    await expect(page.locator('h1:has-text("Novo Achado")')).toBeVisible({ timeout: 5000 });
  });

  test('deve filtrar achados por status', async ({ page }) => {
    await page.goto('/achados');
    await expect(page.locator('app-data-table')).toBeVisible({ timeout: 5000 });
    const filterCard = page.locator('app-quadro-achados .filter-bar').first();
    const select = filterCard.locator('mat-select').first();
    await select.click();
    await page.locator('mat-option', { hasText: 'Consolidado' }).click();
    await expect(page.locator('app-data-table')).toBeVisible({ timeout: 5000 });
  });
});
