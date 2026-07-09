import { test, expect } from '@playwright/test';

test.describe('Fluxo: Plano → Auditoria → Achado', () => {
  test.beforeEach(async ({ page }) => {
    // Login como P01 (Auditor-Chefe)
    await page.goto('/login');
    await page.fill('input[name="email"]', 'auditor-chefe@audin.tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test('deve listar planos de auditoria', async ({ page }) => {
    await page.goto('/planos');
    await page.waitForTimeout(500);
    // Verifica se a página carregou com o título e cards de plano
    await expect(page.locator('text=Planos de Auditoria')).toBeVisible();
    // Deve haver ao menos 1 card de plano (mock: 3+ planos)
    await expect(page.locator('app-plano-list mat-card:has(mat-card-title)')).not.toHaveCount(0);
  });

  test('deve listar auditorias', async ({ page }) => {
    await page.goto('/auditorias');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Auditorias')).toBeVisible();
  });

  test('deve listar achados', async ({ page }) => {
    await page.goto('/achados');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Quadro de Achados')).toBeVisible();
  });

  test('deve abrir formulário de novo achado', async ({ page }) => {
    await page.goto('/achados/novo');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Novo Achado')).toBeVisible();
  });

  test('deve filtrar achados por status', async ({ page }) => {
    await page.goto('/achados');
    await page.waitForTimeout(500);
    // Seleciona "Consolidado" no filtro de status
    const filterCard = page.locator('app-quadro-achados .filter-bar').first();
    const select = filterCard.locator('mat-select').first();
    await select.click();
    await page.locator('mat-option', { hasText: 'Consolidado' }).click();
    await page.waitForTimeout(500);
    // A tabela deve recarregar com os dados filtrados
    await expect(page.locator('app-data-table')).toBeVisible();
  });
});
