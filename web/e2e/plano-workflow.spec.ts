import { test, expect } from '@playwright/test';
import { login } from './helpers';

test.describe('Fluxo E2E-02: Criar PAA → Submeter → Presidente Aprova', () => {
  test('P01 edita plano RASCUNHO', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/planos');
    await expect(page.locator('h1:has-text("Planos")')).toBeVisible({ timeout: 5000 });

    const planoCard = page.locator('app-plano-list mat-card', { hasText: 'PALP 2028-2031' });
    await expect(planoCard).toBeVisible({ timeout: 5000 });
    await expect(planoCard.locator('app-status-badge')).toContainText('RASCUNHO');

    await planoCard.locator('button', { hasText: 'Editar' }).click();

    await expect(page).toHaveURL(/\/planos\/plano-005/, { timeout: 5000 });
    await expect(page.locator('h1')).toContainText('Editar Plano', { timeout: 5000 });
  });

  test('P01 submete plano-005 (RASCUNHO → SUBMETIDO)', async ({ page }) => {
    await login(page, 'romulo.ribeiro@mvp.local', '123456');
    await page.goto('/planos');
    await expect(page.locator('h1:has-text("Planos")')).toBeVisible({ timeout: 5000 });

    const planoCard = page.locator('app-plano-list mat-card', { hasText: 'PALP 2028-2031' });
    await expect(planoCard).toBeVisible({ timeout: 5000 });
    await expect(planoCard.locator('app-status-badge')).toContainText('RASCUNHO');

    await planoCard.locator('button', { hasText: 'Submeter' }).click();

    const dialog = page.locator('mat-dialog-container');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await dialog.locator('button', { hasText: 'Submeter' }).click();

    await expect(planoCard.locator('app-status-badge')).toContainText('SUBMETIDO', { timeout: 10000 });
  });

  test('P03 aprova plano-004 (SUBMETIDO → APROVADO)', async ({ page }) => {
    await login(page, 'presidencia@mvp.local', '123456');
    await page.goto('/planos-aprovacao');
    await expect(page.locator('h1:has-text("Aprovação")')).toBeVisible({ timeout: 5000 });

    await page.locator('app-plano-aprovacao mat-card', { hasText: 'PAA 2027' })
      .locator('button', { hasText: 'Aprovar' }).click();

    const dialog = page.locator('mat-dialog-container');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await dialog.locator('button', { hasText: 'Aprovar' }).click();

    // Após aprovar, o plano some do filtro SUBMETIDO — troca para Todos
    await page.locator('mat-form-field mat-select').last().click();
    await page.locator('mat-option', { hasText: 'Todos' }).click();
    await page.locator('button', { hasText: 'Filtrar' }).click();

    await expect(
      page.locator('app-plano-aprovacao mat-card', { hasText: 'PAA 2027' })
        .locator('app-status-badge'),
    ).toContainText('APROVADO', { timeout: 10000 });
  });

  test('P03 publica plano-001 (APROVADO → PUBLICADO)', async ({ page }) => {
    await login(page, 'presidencia@mvp.local', '123456');
    await page.goto('/planos-aprovacao');

    // Filtra por status Aprovado para ver o PAA 2026
    await page.locator('mat-form-field mat-select').last().click();
    await page.locator('mat-option', { hasText: 'Aprovado' }).click();
    await page.locator('button', { hasText: 'Filtrar' }).click();

    await expect(page.locator('h1:has-text("Aprovação")')).toBeVisible({ timeout: 5000 });

    await page.locator('app-plano-aprovacao mat-card', { hasText: 'PAA 2026' })
      .locator('button', { hasText: 'Publicar' }).click();

    const dialog = page.locator('mat-dialog-container');
    await expect(dialog).toBeVisible({ timeout: 3000 });
    await dialog.locator('button', { hasText: 'Publicar' }).click();

    // Após publicar, o plano some do filtro APROVADO — troca para Todos
    await page.locator('mat-form-field mat-select').last().click();
    await page.locator('mat-option', { hasText: 'Todos' }).click();
    await page.locator('button', { hasText: 'Filtrar' }).click();

    await expect(
      page.locator('app-plano-aprovacao mat-card', { hasText: 'PAA 2026' })
        .locator('app-status-badge'),
    ).toContainText('PUBLICADO', { timeout: 10000 });
  });
});
