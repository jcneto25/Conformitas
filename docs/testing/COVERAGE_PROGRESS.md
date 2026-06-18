# Progresso de Cobertura — CONFORMITAS 3.0

**Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Aguardando primeira medição

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

## 6. Progresso E2E

| ID | Fluxo | Status | Data |
|----|-------|--------|------|
| E2E-01 | Login → Dashboard → Abrir Auditoria | ⏳ | — |
| E2E-02 | Criar PAA → Submeter → Presidente Aprova | ⏳ | — |
| E2E-03 | Registrar Achado → Manifestação → Consolidar | ⏳ | — |
| E2E-04 | Emitir Relatório → Recomendação → Cumprir | ⏳ | — |
| E2E-05 | Acesso P05 restrito à própria unidade | ⏳ | — |
| E2E-06 | Segregação P01 não acumula perfis | ⏳ | — |
| E2E-07 | Auditoria sigilosa — P05 bloqueado | ⏳ | — |
| E2E-08 | Workflow fraude: superior → 60 dias → TCE | ⏳ | — |

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

**Versão:** 1.0 | **Data:** 2026-06-16
