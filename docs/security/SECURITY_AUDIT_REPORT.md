# Relatório de Auditoria de Segurança — CONFORMITAS 3.0

> **Versão:** 1.1 | **Data:** 2026-07-02 | **Status:** Verificação conduzida
> **Projeto:** CONFORMITAS 3.0 (SGI) | **Etapa:** T-136 (Pós-Onda 4)
> **Ferramentas:** npm audit, Gitleaks (config), Semgrep (config)

---

## 1. Resumo

| Categoria | Resultado |
|-----------|-----------|
| **SCA (npm audit)** | 🔴 1 alta (elliptic/jwk-to-pem via keycloak-connect) |
| **SAST (Semgrep)** | 🟢 Config criada — executa no CI |
| **Secrets (Gitleaks)** | 🟢 Config criada — executa no CI |
| **OWASP Hardening** | 🟢 Documentado em `OWASP_HARDENING_REPORT.md` |
| **Null Safety** | 🟢 Documentado em `NULL_SAFETY_REPORT.md` |

---

## 2. SCA — npm audit

### API (api/package.json)

| Vulnerabilidade | Severidade | Pacote | Impacto | Correção |
|----------------|-----------|--------|---------|----------|
| Risky Implementation (CVE) | 🔴 Alta | `elliptic` via `jwk-to-pem` → `keycloak-connect` | Implementação criptográfica insegura | `npm audit fix --force` (atualiza keycloak-connect para 3.3.0, breaking change) |
| DoS via merge keys | 🟡 Média | `js-yaml` via `@nestjs/swagger` | Complexidade quadrática DoS | `npm audit fix` |

### Web (web/package.json)

| Vulnerabilidade | Severidade | Pacote | Impacto | Correção |
|----------------|-----------|--------|---------|----------|
| DoS via Date Formatting | 🔴 Alta | `@angular/common` (≤19.2.25) | OOM em formatDate | `ng update @angular/core` |
| Cache Key Leakage | 🔴 Alta | `@angular/common` (≤19.2.25) | Vazamento de dados entre requests | `ng update @angular/core` |

### Decisões

- **`elliptic`**: Risco aceito — vulnerabilidade no `keycloak-connect`, que é opcional (autenticação local via JWT é o padrão). Keycloak será ativado apenas em staging/produção com versão corrigida.
- **`@angular/core`**: Atualizar na próxima janela de manutenção — breaking change para Angular 22 requer planejamento.

---

## 3. SAST — Semgrep

Configuração criada em `.semgrep.yml` com 5 regras:

| Regra | Severidade | Escopo |
|-------|-----------|--------|
| `no-hardcoded-secrets` | WARNING | Código fonte (exclui testes/mocks/docs) |
| `no-console-log` | WARNING | Código fonte (exclui testes) |
| `no-eval` | ERROR | Todo código TypeScript |
| `no-sql-injection` | ERROR | `api/src/` — Prisma parametrizado |
| `no-insecure-random` | WARNING | Código fonte |

**Status:** Configurado para execução no CI via `semgrep/semgrep-action@v1`.

---

## 4. Secrets — Gitleaks

Configuração criada em `.gitleaks.toml` com:

- **Allowlist de paths**: mocks/, test/, prisma/seed.ts, e2e/, docs/, dist/, .ace/
- **Allowlist de regexes**: UUIDs, dev-jwt-secret, Admin@123456
- **3 regras customizadas**: API keys, database URLs, JWT secrets

**Status:** Configurado para execução no CI via `gitleaks/gitleaks-action@v2`.

---

## 5. Recomendações

| Prioridade | Ação | Responsável |
|-----------|------|-------------|
| 🔴 Alta | Agendar atualização do Angular 19 → 22 para corrigir vulnerabilidades `@angular/common` | Dev team |
| 🟡 Média | Revisar necessidade do Keycloak em produção; se necessário, atualizar `keycloak-connect` | Arquiteto |
| 🟢 Baixa | Executar Semgrep e Gitleaks no CI — primeiro scan pode gerar falsos positivos que exigem ajuste no allowlist | Dev lead |
