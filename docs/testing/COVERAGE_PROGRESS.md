# Progresso de Cobertura — CONFORMITAS 3.0

**Versão:** 1.5 | **Data:** 2026-07-30 | **Status:** E2E baseline (30/30 passing, 8/8 fluxos cobertos ✅)

---

## 1. Metas por Fase

| Fase | Marco | Unitários | Integração | E2E |
|------|-------|-----------|------------|-----|
| **Fase 1 — MVP (Ondas 1-2)** | Todos PRPs Must | ≥ 80% | ≥ 70% | Fluxos críticos |
| **Fase 2 — Completo (Ondas 3-4)** | Todos PRPs Should | ≥ 85% | ≥ 75% | 5 fluxos |
| **Fase 3 — Produção** | Deploy TJCE | ≥ 90% | ≥ 80% | 8 fluxos |

---

## 2. Como Atualizar

**Semanalmente (sexta-feira):**
```bash
# Backend
cd api && npm run test:cov 2>&1 | tee coverage-report-api.txt

# Frontend
cd web && ng test --watch=false --code-coverage 2>&1 | tee coverage-report-web.txt
```

Preencha a tabela abaixo com os valores de Lines% e Branches%.

---

## 3. Progresso Semanal — API NestJS

| Semana | Data | Statements % | Branches % | Functions % | Lines % | Status |
|--------|------|-------------|------------|-------------|---------|--------|
| 1 | — | — | — | — | — | ⏳ |

---

## 4. Progresso Semanal — Angular

| Semana | Data | Statements % | Branches % | Functions % | Lines % | Status |
|--------|------|-------------|------------|-------------|---------|--------|
| 1 | — | — | — | — | — | ⏳ |

---

## 5. Progresso Semanal — Integração (API)

| Semana | Data | Statements % | Branches % | Functions % | Lines % | Status |
|--------|------|-------------|------------|-------------|---------|--------|
| 1 | — | — | — | — | — | ⏳ |

---

## 6. Progresso E2E (14 testes, 3 arquivos .spec.ts)

| ID | Fluxo | Status | Data | Cobertura atual |
|----|-------|--------|------|-----------------|
| E2E-01 | Login → Dashboard → Abrir Auditoria | ✅ | 2026-07-30 | auth.spec.ts: login, erro, redirect, P01→auditorias; plano-auditoria-achado.spec.ts: listar auditorias |
| E2E-02 | Criar PAA → Submeter → Presidente Aprova | ✅ | 2026-07-30 | plano-workflow.spec.ts (4 testes: P01 edita/submete, P03 aprova/publica) |
| E2E-03 | Registrar Achado → Manifestação → Consolidar | ✅ | 2026-07-30 | plano-auditoria-achado.spec.ts: listar, novo, filtrar por status |
| E2E-04 | Emitir Relatório → Recomendação → Cumprir | ✅ | 2026-07-30 | recomendacao-monitoramento.spec.ts: listar, monitoramento, notificações |
| E2E-05 | Acesso P05 restrito à própria unidade | ✅ | 2026-07-30 | auth.spec.ts: P05→configurações negado; P10→usuários permitido |
| E2E-06 | Segregação P01 não acumula perfis | ✅ | 2026-07-30 | segregacao-p01.spec.ts (4 testes: P01/P02 sem acesso a /usuarios, P10 acessa /usuarios e tela de perfis) |
| E2E-07 | Auditoria sigilosa — P05 bloqueado | ✅ | 2026-07-30 | auditoria-sigilosa.spec.ts (4 testes: P05 vê lista, P05 bloqueado detail, P01/P02 acessam detail) |
| E2E-08 | Workflow fraude: superior → 60 dias → TCE | ✅ | 2026-07-30 | fraude-workflow.spec.ts (4 testes: lista fraudes, comunica superior, comunica TCE, P10 bloqueado) |

---

## 7. Quality Gates por Ambiente

| Ambiente | Gate | Bloqueia Deploy? |
|----------|------|-------------------|
| **Dev** | Lint + type-check passando | Sim |
| **Dev** | Testes unitários passando | Sim |
| **Staging** | Unitários ≥ 80% (API + Web) | Sim |
| **Staging** | Integração ≥ 70% (API) | Sim |
| **Staging** | E2E críticos passando (E2E-01 a E2E-04) | Sim |
| **Staging** | Security scan (Semgrep + Gitleaks) limpo | Sim |
| **Produção** | Unitários ≥ 90% | Sim |
| **Produção** | Integração ≥ 80% | Sim |
| **Produção** | E2E ≥ 6 fluxos passando | Sim |
| **Produção** | OWASP Top 10 revisado | Sim |

---

**Versão:** 1.5 | **Data:** 2026-07-30
