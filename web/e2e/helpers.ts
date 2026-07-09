import { Page } from '@playwright/test';

/**
 * Limpa localStorage e navega para /login.
 * addInitScript roda antes de qualquer JS da página, então o AuthService
 * nunca encontra token sujo de retry anterior.
 */
export async function gotoLoginClean(page: Page): Promise<void> {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/login');
}

/**
 * Realiza login completo (incluindo MFA se necessário).
 * O mock backend aceita qualquer código TOTP de 6 dígitos.
 */
export async function login(
  page: Page,
  email: string,
  senha: string,
): Promise<void> {
  await gotoLoginClean(page);
  await page.fill('input[name="email"]', email);
  await page.fill('input[type="password"]', senha);
  await page.click('button[type="submit"]');

  // Se o usuário tem MFA habilitado, o mock redireciona para /mfa
  const mfaInput = page.locator('input[inputmode="numeric"]');
  const mfaVisible = await mfaInput.isVisible({ timeout: 3000 }).catch(() => false);

  if (mfaVisible) {
    await mfaInput.fill('123456');
    await page.click('button[type="submit"]');
  }

  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
}
