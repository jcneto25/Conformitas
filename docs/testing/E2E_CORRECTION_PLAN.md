# Plano de Correção dos Testes E2E (Playwright) — CONFORMITAS 3.0

Este documento apresenta o plano detalhado de correção dos testes de ponta a ponta (E2E) do frontend que falharam na suíte do Playwright. As falhas foram analisadas cruzando-se os componentes Angular do projeto com os dados do mock de usuários do MSW.

---

## 1. Mapeamento de Credenciais de Perfis (RBAC)

**Problema:** Os testes E2E de navegação de perfis de autenticação estavam tentando fazer login com e-mails fictícios (`admin@audin.tjce.gov.br`, `gestor@tjce.gov.br`) que não constam nos dados mockados de usuários em `mocks/data/users.json`. Isso impedia a correta autenticação e resultava em desvios de rota indevidos (como redirecionamento de volta ao `/dashboard` ou tela de login).

**Ajuste:** Atualizar os testes para utilizar as credenciais exatas presentes na base mock:

| Perfil | E-mail no Teste (Atual) | E-mail Mockado (Correto) | Senha Mockada | Nome do Usuário Mock |
|--------|-------------------------|--------------------------|---------------|----------------------|
| **P01** (Auditor-Chefe) | `auditor-chefe@audin.tjce.gov.br` | `romulo.ribeiro@mvp.local` | `123456` | Rômulo Pinheiro Ribeiro |
| **P02** (Auditor) | *(Não especificado em login)* | `carlos.pontes@mvp.local` | `123456` | Carlos André Melo Pontes |
| **P05** (Gestor) | `gestor@tjce.gov.br` | `gestor.financas@mvp.local` | `123456` | Fernando Gestor |
| **P10** (Administrador) | `admin@audin.tjce.gov.br` | `admin.sistema@mvp.local` | `123456` | Admin do Sistema |

---

## 2. Correções Específicas por Arquivo de Teste

### 2.1. Arquivo: `web/e2e/auth.spec.ts`

#### Falha 1: `deve exibir tela de login`
* **Erro:** Busca o título `h2` com texto `/login|entrar/i`. Porém, o `LoginComponent` utiliza a tag `<mat-card-title>` contendo o texto `"Conformitas"`.
* **Correção:**
  ```diff
  - await expect(page.locator('h2')).toContainText(/login|entrar/i);
  + await expect(page.locator('mat-card-title')).toContainText('Conformitas');
  ```

#### Falha 2: `deve exibir erro com credenciais inválidas`
* **Erro:** O seletor `locator('text=erro, text=inválido, text=incorreto')` falha porque os textos de erro do backend/mock mudaram.
* **Correção:** Utilizar a tag de alerta semântico `[role="alert"]` exibida na tela de login quando `error` é definido no componente:
  ```diff
  - const erro = page.locator('text=erro, text=inválido, text=incorreto');
  - await expect(erro).toBeVisible();
  + const erro = page.locator('[role="alert"]');
  + await expect(erro).toBeVisible();
  ```

#### Falha 3: `P10 deve acessar usuários` e `P05 não deve acessar configurações`
* **Erro:** Uso de e-mails inválidos que falham na validação do guard de rotas.
* **Correção:** Substituir pelas credenciais oficiais do mock:
  ```diff
    test('P10 deve acessar usuários', async ({ page }) => {
      await page.goto('/login');
  -   await page.fill('input[type="email"]...', 'admin@audin.tjce.gov.br');
  -   await page.fill('input[type="password"]', 'Admin@123456');
  +   await page.fill('input[type="email"]', 'admin.sistema@mvp.local');
  +   await page.fill('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
      await page.goto('/usuarios');
      await expect(page).toHaveURL(/\/usuarios/);
    });

    test('P05 não deve acessar configurações', async ({ page }) => {
      await page.goto('/login');
  -   await page.fill('input[type="email"]...', 'gestor@tjce.gov.br');
  -   await page.fill('input[type="password"]', 'Admin@123456');
  +   await page.fill('input[type="email"]', 'gestor.financas@mvp.local');
  +   await page.fill('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/);
      await page.goto('/configuracoes');
      await expect(page.locator('text=acesso negado, text=403, text=proibido')).toBeVisible();
    });
  ```

---

### 2.2. Arquivo: `web/e2e/plano-auditoria-achado.spec.ts`

#### Falha 1: `deve listar auditorias`
* **Erro:** Violação do *Strict Mode* do Playwright. O seletor `locator('text=Auditorias')` retorna 4 elementos na tela (menu lateral, breadcrumb, título h1 e descrição).
* **Correção:** Especificar que deve validar o título principal da página (`h1`):
  ```diff
  - await expect(page.locator('text=Auditorias')).toBeVisible();
  + await expect(page.locator('h1:has-text("Auditorias")')).toBeVisible();
  ```

#### Falha 2: `deve abrir formulário de novo achado`
* **Erro:** A rota `/achados/novo` possui restrição de perfil `canActivate: [rolesGuard(['P02'])]`. Porém, no bloco `beforeEach` do teste, o login é efetuado como `P01` (Auditor-Chefe). Isso provoca um bloqueio de acesso e redirecionamento, resultando na ausência do elemento `Novo Achado`.
* **Correção:**
  1. Alterar as credenciais do `beforeEach` para logar com o perfil `P02` (Auditor - `carlos.pontes@mvp.local`).
  2. Ajustar os testes de planos (`deve listar planos de auditoria`), pois `P02` também possui permissão para listá-los (está no `rolesGuard(['P01', 'P02', 'P03'])`).
  ```diff
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
  -   await page.fill('input[name="email"]', 'auditor-chefe@audin.tjce.gov.br');
  -   await page.fill('input[type="password"]', 'Admin@123456');
  +   await page.fill('input[name="email"]', 'carlos.pontes@mvp.local');
  +   await page.fill('input[type="password"]', '123456');
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    });
  ```

#### Falha 3: `deve filtrar achados por status`
* **Erro:** O tempo de espera estático (`await page.waitForTimeout(500)`) é insuficiente para aguardar a requisição HTTP terminar. Durante o loading do filtro, o elemento `<app-data-table>` é removido e substituído temporariamente por um `<mat-spinner>`, gerando falha no teste.
* **Correção:** Remover a espera estática e deixar o próprio Playwright aguardar de forma reativa a reexibição da tabela com timeout inteligente:
  ```diff
      await select.click();
      await page.locator('mat-option', { hasText: 'Consolidado' }).click();
  -   await page.waitForTimeout(500);
  -   await expect(page.locator('app-data-table')).toBeVisible();
  +   await expect(page.locator('app-data-table')).toBeVisible({ timeout: 5000 });
  ```

---

### 2.3. Arquivo: `web/e2e/recomendacao-monitoramento.spec.ts`

#### Falha 1: `deve listar recomendações`
* **Erro:** Violação do *Strict Mode* do Playwright. O seletor `locator('text=Recomendações')` retorna 4 elementos (links laterais, breadcrumb e título h1).
* **Correção:** Direcionar o validador para a tag de título principal (`h1`) da listagem de recomendações:
  ```diff
  - await expect(page.locator('text=Recomendações')).toBeVisible();
  + await expect(page.locator('h1:has-text("Recomendações")')).toBeVisible();
  ```

---

## 3. Próximos Passos de Execução

1. Editar os arquivos `.spec.ts` descritos em `web/e2e/` aplicando os patches recomendados acima.
2. Rodar novamente a suíte de testes E2E com `npm run test:e2e` na pasta `web` para validar se todos os 14 testes passam para 100% de sucesso.
3. Atualizar o relatório consolidado de progresso `docs/testing/COVERAGE_PROGRESS.md` marcando os fluxos E2E concluídos como funcionais.
