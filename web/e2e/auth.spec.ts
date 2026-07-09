import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Fluxo de Autenticação', () => {
  test('deve exibir tela de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('mat-card-title')).toContainText('Conformitas');
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'invalido@teste.com');
    await page.fill('input[type="password"]', 'senha_errada');
    await page.click('button[type="submit"]');
    const erro = page.locator('[role="alert"]');
    await expect(erro).toBeVisible();
  });

  test('deve redirecionar para dashboard após login', async ({ page }) => {
    // Usando P05 (sem MFA) para login direto
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'gestor.financas@mvp.local');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Navegação por Perfis', () => {
  test('P01 deve acessar auditorias', async ({ page }) => {
    // P01 (romulo.ribeiro) tem MFA habilitado
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/auditorias');
    await expect(page).toHaveURL(/\/auditorias/);
  });

  test('P10 deve acessar usuários', async ({ page }) => {
    // P10 (admin.sistema) tem MFA habilitado
    await login(page, 'admin.sistema@mvp.local', '123456');
    await page.goto('/usuarios');
    await expect(page).toHaveURL(/\/usuarios/);
  });

  test('P05 não deve acessar configurações', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'gestor.financas@mvp.local');
    await page.fill('input[type="password"]', '123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.goto('/configuracoes');
    // O guard redireciona para /dashboard (P05 não tem role P10)
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
