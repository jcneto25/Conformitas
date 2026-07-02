import { test, expect } from '@playwright/test';

test.describe('Fluxo de Autenticação', () => {
  test('deve exibir tela de login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toContainText(/login|entrar/i);
  });

  test('deve exibir erro com credenciais inválidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'invalido@teste.com');
    await page.fill('input[type="password"]', 'senha_errada');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    const erro = page.locator('text=erro, text=inválido, text=incorreto');
    await expect(erro).toBeVisible();
  });

  test('deve redirecionar para dashboard após login', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'auditor-chefe@audin.tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});

test.describe('Navegação por Perfis', () => {
  test('P01 deve acessar auditorias', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'auditor-chefe@audin.tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.goto('/auditorias');
    await expect(page).toHaveURL(/\/auditorias/);
  });

  test('P10 deve acessar usuários', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'admin@audin.tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.goto('/usuarios');
    await expect(page).toHaveURL(/\/usuarios/);
  });

  test('P05 não deve acessar configurações', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"], input[placeholder*="email" i]', 'gestor@tjce.gov.br');
    await page.fill('input[type="password"]', 'Admin@123456');
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/);
    await page.goto('/configuracoes');
    await expect(page.locator('text=acesso negado, text=403, text=proibido')).toBeVisible();
  });
});
