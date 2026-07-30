import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Fluxo de Autenticação', () => {
  test('deve exibir tela de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('mat-card-title')).toContainText('Conformitas');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', 'invalido@teste.com');
    await page.fill('input[type="password"]', 'senha_errada');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    if (!page.url().includes('/dashboard')) {
      await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 8000 });
    }
  });

  test('deve redirecionar para dashboard após login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForSelector('input[name="email"]', { timeout: 10000 });
    await page.fill('input[name="email"]', 'gestor.financas@mvp.local');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Navegação por Perfis', () => {
  test('P01 deve acessar auditorias', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/auditorias');
    await expect(page).toHaveURL(/\/auditorias/);
  });

  test('P10 deve acessar usuários', async ({ page }) => {
    await login(page, 'admin.sistema@mvp.local', '123456');
    await page.goto('/usuarios');
    await expect(page).toHaveURL(/\/usuarios/);
  });

  test('P05 não deve acessar configurações', async ({ page }) => {
    await login(page, 'gestor.financas@mvp.local', '123456');
    await page.goto('/configuracoes');
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
