import { Page } from '@playwright/test';

/**
 * Realiza login completo (incluindo MFA se necessário).
 * O mock backend aceita qualquer código TOTP de 6 dígitos.
 */
export async function login(
  page: Page,
  email: string,
  senha: string,
): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[type="password"]', senha);
  await page.click('button[type="submit"]');

  // Aguarda redirecionamento para /mfa (se MFA habilitado) ou direto para /
  const mfaInput = page.locator('input[inputmode="numeric"]');
  const mfaVisible = await mfaInput.isVisible({ timeout: 3000 }).catch(() => false);

  if (mfaVisible) {
    await mfaInput.fill('123456');
    await page.click('button[type="submit"]');
  }

  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}
