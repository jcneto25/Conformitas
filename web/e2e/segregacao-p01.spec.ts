import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('E2E-06: Segregação — P01 não acumula perfis', () => {
  test('P01 não pode acessar tela de usuários (restrita a P10)', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/usuarios');
    // P01 should be redirected away from usuarios (requires P10)
    await expect(page).not.toHaveURL(/\/usuarios/, { timeout: 5000 });
  });

  test('P10 pode acessar tela de usuários', async ({ page }) => {
    await login(page, 'admin.sistema@mvp.local', '123456');
    await page.goto('/usuarios');
    await expect(page).toHaveURL(/\/usuarios/, { timeout: 5000 });
  });

  test('P10 pode acessar tela de perfis de usuário', async ({ page }) => {
    await login(page, 'admin.sistema@mvp.local', '123456');
    await page.goto('/usuarios/mock-user-001/perfis');
    await expect(page.locator('app-page-header')).toContainText('Perfis', { timeout: 10000 });
    await expect(page.locator('mat-card')).toHaveCount(3, { timeout: 5000 });
  });

  test('P02 não pode acessar tela de usuários (restrita a P10)', async ({ page }) => {
    await login(page, 'juliana.alves@mvp.local', '123456');
    await page.goto('/usuarios');
    await expect(page).not.toHaveURL(/\/usuarios/, { timeout: 5000 });
  });
});
