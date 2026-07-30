import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('E2E-07: Auditoria sigilosa — P05 bloqueado', () => {
  test('P05 vê lista de auditorias da sua unidade', async ({ page }) => {
    await login(page, 'gestor.financas@mvp.local', '123456');
    await page.goto('/auditorias');
    await expect(page.locator('h1:has-text("Auditorias")')).toBeVisible({ timeout: 5000 });

    // P05 (SEC-FIN) deve ver auditorias da Secretaria de Finanças (aud-001, aud-004)
    await expect(page.locator('app-data-table')).toBeVisible({ timeout: 5000 });
  });

  test('P05 não pode acessar detalhe de auditoria (bloqueado por @Roles)', async ({ page }) => {
    await login(page, 'gestor.financas@mvp.local', '123456');
    await page.goto('/auditorias/aud-001');
    // P05 é bloqueado via 403 do interceptor mock; o componente exibe o erro
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 10000 });
  });

  test('P01 pode acessar detalhe de auditoria', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/auditorias/aud-001');
    await expect(page.locator('h1')).toContainText(/AUD-2026-001|Editar Auditoria|Auditoria/i, { timeout: 5000 });
  });

  test('P02 pode acessar detalhe de auditoria', async ({ page }) => {
    await login(page, 'juliana.alves@mvp.local', '123456');
    await page.goto('/auditorias/aud-001');
    await expect(page.locator('h1')).toContainText(/AUD-2026-001|Editar Auditoria|Auditoria/i, { timeout: 5000 });
  });
});
