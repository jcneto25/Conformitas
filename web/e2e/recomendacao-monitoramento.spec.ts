import { test, expect } from '@playwright/test';

test.describe('Fluxo: Recomendações e Monitoramento', () => {
  test.beforeEach(async ({ page }) => {
    // Login como P01
    await page.goto('/login');
    await page.fill('input[name="email"]', 'auditor-chefe@audin.tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  });

  test('deve listar recomendações', async ({ page }) => {
    await page.goto('/recomendacoes');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Recomendações')).toBeVisible();
  });

  test('deve acessar painel de monitoramento', async ({ page }) => {
    await page.goto('/painel-monitoramento');
    await page.waitForTimeout(500);
    await expect(page.locator('text=Painel de Monitoramento')).toBeVisible();
  });

  test('deve exibir notificações de recomendações vencidas no header', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(500);
    // O badge de notificações deve estar visível na toolbar
    await expect(page.locator('[aria-label="Recomendações vencidas"]')).toBeVisible();
  });
});
