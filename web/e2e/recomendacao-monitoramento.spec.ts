import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Fluxo: Recomendações e Monitoramento', () => {
  test.beforeEach(async ({ page }) => {
    // P01 (romulo.ribeiro) tem MFA habilitado
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
  });

  test('deve listar recomendações', async ({ page }) => {
    await page.goto('/recomendacoes');
    await expect(page.locator('h1:has-text("Recomendações")')).toBeVisible({ timeout: 5000 });
  });

  test('deve acessar painel de monitoramento', async ({ page }) => {
    await page.goto('/painel-monitoramento');
    await expect(page.locator('h1:has-text("Painel de Monitoramento")')).toBeVisible({ timeout: 5000 });
  });

  test('deve exibir notificações de recomendações vencidas no header', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[aria-label="Recomendações vencidas"]')).toBeVisible({ timeout: 5000 });
  });
});
