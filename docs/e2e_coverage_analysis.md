# Relatório de Cobertura e Análise de Testes E2E (Playwright)

**Data da Análise:** 2026-07-09  
**Status Consolidado:** 14 Testes Executados | **6 Passados** | **8 Falhados**  
**Taxa de Sucesso:** 42.8%

---

## 1. Resumo da Execução de Testes

Os testes foram executados nos 3 arquivos de especificação (`.spec.ts`) presentes no diretório `web/e2e/`. Abaixo está a listagem detalhada de cada fluxo testado:

| Arquivo Spec | Nome do Caso de Teste | Status | Tempo |
|--------------|-----------------------|--------|-------|
| `auth.spec.ts` | deve exibir tela de login | ❌ Falhou | 12.4s |
| `auth.spec.ts` | deve exibir erro com credenciais inválidas | ❌ Falhou | 14.7s |
| `auth.spec.ts` | deve redirecionar para dashboard após login | ✅ Passou | 1.4s |
| `auth.spec.ts` | P01 deve acessar auditorias | ✅ Passou | 1.5s |
| `auth.spec.ts` | P10 deve acessar usuários | ❌ Falhou | 13.4s |
| `auth.spec.ts` | P05 não deve acessar configurações | ❌ Falhou | 13.7s |
| `plano-auditoria-achado.spec.ts` | deve listar planos de auditoria | ✅ Passou | 2.1s |
| `plano-auditoria-achado.spec.ts` | deve listar auditorias | ❌ Falhou | 4.6s |
| `plano-auditoria-achado.spec.ts` | deve listar achados | ✅ Passou | 2.1s |
| `plano-auditoria-achado.spec.ts` | deve abrir formulário de novo achado | ❌ Falhou | 14.5s |
| `plano-auditoria-achado.spec.ts` | deve filtrar achados por status | ❌ Falhou | 16.3s |
| `recomendacao-monitoramento.spec.ts` | deve listar recomendações | ❌ Falhou | 4.8s |
| `recomendacao-monitoramento.spec.ts` | deve acessar painel de monitoramento | ✅ Passou | 2.1s |
| `recomendacao-monitoramento.spec.ts` | deve exibir notificações de recomendações vencidas no header | ✅ Passou | 1.9s |

---

## 2. Diagnóstico Técnico das Falhas

As falhas mapeadas nos testes E2E decorrem de três causas principais:

### Causa A: Violação de Modo Estrito (*Strict Mode*) do Playwright
O Playwright por padrão adota o modo estrito em seletores como `locator('text=...')` ou `.locator()`. Se a página contiver múltiplos elementos idênticos, a asserção quebra ao invés de buscar o primeiro ou falhar silenciosamente.

* **Casos afetados:**
  1. `plano-auditoria-achado.spec.ts` -> **deve listar auditorias**: `locator('text=Auditorias')` resolveu para 4 elementos na tela (link de menu lateral, breadcrumb, título `h1` e subtítulo).
  2. `recomendacao-monitoramento.spec.ts` -> **deve listar recomendações**: `locator('text=Recomendações')` resolveu para 4 elementos na tela (menu lateral, link específico de recomendações, breadcrumb e título `h1`).

### Causa B: Diferença de Textos/Elementos na UI Real vs Esperada no Teste
Os testes esperam elementos de texto específicos que podem ter sido atualizados na interface real do frontend.

* **Casos afetados:**
  1. `auth.spec.ts` -> **deve exibir tela de login**: O teste busca o elemento `h2` contendo `/login|entrar/i`. Ele falhou pois esse elemento `h2` não existe ou seu texto mudou (ex: um título `h1` ou um elemento estilizado com outra tag).
  2. `auth.spec.ts` -> **deve exibir erro com credenciais inválidas**: O seletor `locator('text=erro, text=inválido, text=incorreto')` falhou, indicando que a interface real não está exibindo um toast de erro ou o texto exibido é diferente (ex: "Credenciais incorretas" ou "Usuário ou senha incorretos").
  3. `auth.spec.ts` -> **P05 não deve acessar configurações**: Busca `locator('text=acesso negado, text=403, text=proibido')` na tentativa de acessar `/configuracoes` com perfil Gestor. Falhou por não achar essa mensagem de bloqueio (talvez o redirecionamento automático seja feito ou o texto da mensagem de erro seja outro).

### Causa C: Timeouts por Ausência de Elementos de Fluxos Específicos
Alguns elementos de UI específicos de fluxos complexos não foram renderizados ou o teste falhou ao navegar até a página.

* **Casos afetados:**
  1. `auth.spec.ts` -> **P10 deve acessar usuários**: Redirecionou de volta para `/dashboard` ou o seletor do menu de usuários falhou.
  2. `plano-auditoria-achado.spec.ts` -> **deve abrir formulário de novo achado**: Espera o elemento `text=Novo Achado` na rota `/achados/novo`. Falhou pois o formulário de criação de achado não está presente, ou o título é diferente.
  3. `plano-auditoria-achado.spec.ts` -> **deve filtrar achados por status**: Falha ao localizar o componente `<app-data-table>` na listagem de achados após aplicar o filtro.

---

## 3. Plano de Ação Recomendado para Correção

1. **Refatorar os seletores com Strict Mode:**
   * Substituir seletores genéricos de texto por seletores mais específicos como `page.getByRole('heading', { name: 'Auditorias' })` ou usar `page.locator('h1:has-text("Auditorias")')` para assegurar que apenas um elemento principal seja retornado.

2. **Alinhar Textos de Validação:**
   * Inspecionar o componente real de login do Angular para conferir o título exato (se é `h1` ou `h2` e se diz "Identificação" ou "Acesso").
   * Verificar o texto correto exibido pelo toast ou modal de erro nas tentativas de login inválido.

3. **Garantir Rotas e Redirecionamentos:**
   * Ajustar o comportamento do middleware ou dos guards do Angular para o perfil `P05` e `P10` a fim de bater exatamente com as rotas testadas (`/usuarios` e `/configuracoes`).
