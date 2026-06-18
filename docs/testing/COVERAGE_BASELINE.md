# Baseline de Cobertura — CONFORMITAS 3.0

**Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Baseline Inicial (pré-execução)

---

## 1. Como Estabelecer a Baseline

Execute os comandos na raiz do projeto:

```bash
# Backend (NestJS)
cd api && npm run test:cov

# Frontend (Angular)
cd web && ng test --watch=false --code-coverage
```

O relatório será gerado em `api/coverage/lcov-report/index.html` e `web/coverage/index.html`.

---

## 2. Baseline por Aplicação

### 2.1 Backend — API NestJS

| Métrica | Baseline | Alvo | Tool |
|---------|----------|------|------|
| Statements | 0% | ≥ 80% | Jest |
| Branches | 0% | ≥ 70% | Jest |
| Functions | 0% | ≥ 80% | Jest |
| Lines | 0% | ≥ 80% | Jest |

**Comando:** `npm run test:api:cov`

### 2.2 Frontend — Angular

| Métrica | Baseline | Alvo | Tool |
|---------|----------|------|------|
| Statements | 0% | ≥ 80% | Jasmine/Karma |
| Branches | 0% | ≥ 70% | Jasmine/Karma |
| Functions | 0% | ≥ 80% | Jasmine/Karma |
| Lines | 0% | ≥ 80% | Jasmine/Karma |

**Comando:** `ng test --watch=false --code-coverage`

### 2.3 Integração (Backend)

| Métrica | Baseline | Alvo | Tool |
|---------|----------|------|------|
| Statements | 0% | ≥ 70% | Jest + Supertest |
| Branches | 0% | ≥ 60% | Jest + Supertest |
| Functions | 0% | ≥ 70% | Jest + Supertest |
| Lines | 0% | ≥ 70% | Jest + Supertest |

**Comando:** `npm run test:api:e2e:cov`

### 2.4 E2E (Fluxos Críticos)

| Fluxo | Status | Tool |
|-------|--------|------|
| Login → Dashboard → Abrir Auditoria | ⏳ | Playwright |
| Criar PAA → Submeter → Aprovar | ⏳ | Playwright |
| Registrar Achado → Manifestação → Consolidar | ⏳ | Playwright |
| Emitir Relatório → Recomendação → Cumprir | ⏳ | Playwright |

---

## 3. Infraestrutura de Teste

| Ferramenta | Versão | Aplicação | Status |
|------------|--------|-----------|--------|
| Jest | 29+ | API NestJS (unitários) | ⏳ |
| Supertest | 6+ | API NestJS (integração) | ⏳ |
| Jasmine/Karma | 5+ / 6+ | Angular (unitários) | ⏳ |
| Playwright | 1.40+ | E2E | ⏳ |
| Prisma | 6+ | DB migrations teste | ⏳ |
| SQLite (in-memory) | — | Testes de integração | ⏳ |

---

## 4. Baseline Consolidada

| Aplicação | Statements | Branches | Functions | Lines | Data |
|-----------|------------|----------|-----------|-------|------|
| API NestJS | — | — | — | — | ⏳ |
| Angular | — | — | — | — | ⏳ |
| Integração API | — | — | — | — | ⏳ |

**Primeira medição pendente:** executar após implementação dos primeiros testes na Onda 1.

---

## 5. Known Failures e Known Skips

| ID | Arquivo | Motivo | Severidade | Status |
|----|---------|--------|------------|--------|
| — | — | Nenhum no momento | — | — |

---

**Versão:** 1.0 | **Data:** 2026-06-16
