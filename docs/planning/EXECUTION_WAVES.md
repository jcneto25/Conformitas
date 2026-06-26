# Execution Waves — Ondas de Execução

> **Versão:** 1.1 | **Data:** 2026-06-25 | **Status:** Atualizado (Pós Onda-0)
> **Projeto:** CONFORMITAS 3.0 | **Autor:** IA (Step 4)
> **Referências:** `DEPENDENCY_MATRIX.md`, `PLAN.md`, `docs/prps/PRP-*.md`

---

## 1. Visão Geral da Execução

### 1.1 Propósito
Este documento define o plano tático de execução em 5 ondas (Onda 0 concluída, Ondas 1-4 planejadas), detalhando para cada onda: PRPs incluídos, pré-condições, time alocado, riscos e critérios de saída.

### 1.2 Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Ondas planejadas | 5 (Onda 0 ✅ concluída) |
| PRPs totais | 14 |
| Dias total (paralelo — 3 devs) | 48 (inclui ~3 dias Onda 0) |
| Dias com folga 20% | 58 |
| PRPs sem dependências na Onda 1 | 2 (PRP-001 e após PRP-002, PRP-003/005/009 em paralelo) |
| Máximo PRPs simultâneos | 3 (Onda 1: PRP-003 + PRP-005 + PRP-009) |

---

## 2. Ondas de Execução

---

### Onda 0: Setup e Scaffolding (Concluída)

#### 2.0 Metadados

| Atributo | Valor |
|----------|-------|
| **PRPs** | Transversal (nenhum) |
| **Pré-condição** | — |
| **Paralelo** | Até 3 tarefas simultâneas (dev, dev, dev) |
| **Duração real** | ~3 dias |
| **Status** | ✅ Concluída (8/9 tarefas executadas, 1 parcial) |

#### 2.0 Resultados Entregues

| Item | Status | Detalhe |
|------|--------|---------|
| Git + estrutura de pastas | ✅ | Repositório, .gitignore, pastas api/web/docs/mocks |
| Docker Compose | ✅ | PostgreSQL 16, Redis 7, API NestJS, Web Angular, Nginx, Keycloak |
| ESLint + TypeScript | ✅ | ESLint configurado com prettier plugin, tsconfig strict |
| CI/CD GitHub Actions | ✅ | Pipeline lint, type-check, test, build |
| Scaffolding NestJS | ✅ | 20 módulos, guards (auth, roles), interceptors, decorators, pipes, Swagger |
| Scaffolding Angular | ✅ | App bootstrap, rotas, login component, layout shell, auth interceptor |
| Schema Prisma | ✅ | 645 linhas, ~30 entidades, datasource PostgreSQL |
| Mock data | ✅ | 8 arquivos JSON, 16 usuários (P01-P10) |
| Keycloak | ✅ | Docker configurado, strategy OIDC com JWKS validation |

---

### Onda 1: Fundação e Core (Must)

#### 2.1 Metadados

| Atributo | Valor |
|----------|-------|
| **PRPs** | 001, 002, 003, 004, 005, 006, 009 |
| **Pré-condição** | Stack definido (PRD Técnico §5), ambiente dev disponível |
| **Paralelo** | Até 3 PRPs simultâneos |
| **Duração estimada** | 22 dias (4-5 semanas) |
| **Status** | Planejada |

#### 2.2 Sequência de Execução

**Semana 1-2 (PRP-001 + PRP-002):**
- PRP-001 (8d): Dev 1 — Banco, autenticação JWT, MFA TOTP, CRUD usuários
- PRP-002 (5d): Dev 2 — inicia após PRP-001 ~60% concluído. Perfis, RBAC, mandatos, configs

**Semana 3-4 (paralelo PRP-003 + PRP-005 + PRP-009):**
- PRP-003 (6d): Dev 1 — Universo auditável, matriz de priorização
- PRP-005 (8d): Dev 2 — Auditorias, evidências, papéis de trabalho (depende de PRP-004 parcial)
- PRP-009 (4d): Dev 3 — Ética, sigilo, impedimentos

**Semana 4-5:**
- PRP-004 (8d): Dev 1 — PALP/PAA (inicia após PRP-003)
- PRP-006 (5d): Dev 2 — Achados (inicia após PRP-005)

#### 2.3 Critérios de Saída

- [ ] Login com MFA funcional para P01, P02, P10
- [ ] RBAC com 10 perfis aplicado em todos os endpoints
- [ ] PAA pode ser criado, submetido por P01 e aprovado por P03
- [ ] Auditoria pode ser aberta, evidências uploaded, papéis de trabalho criados
- [ ] Achados registrados com 4 atributos e enviados para manifestação
- [ ] Documentos classificáveis por sigilo

---

### Onda 2: Relatórios e Monitoramento (Must)

#### 2.1 Metadados

| Atributo | Valor |
|----------|-------|
| **PRPs** | 007, 008, 010 |
| **Pré-condição** | Onda 1 concluída, achados funcionais |
| **Paralelo** | PRP-007 + PRP-010 simultâneos; PRP-008 após PRP-007 |
| **Duração estimada** | 8 dias (2 semanas) |
| **Status** | Planejada |

#### 2.2 Sequência

- PRP-007 (6d): Dev 1 — Relatórios Preliminar e Final, Relatório Anual
- PRP-010 (4d): Dev 2 — Consultorias (paralelo, depende de PRP-004 já pronto)
- PRP-008 (6d): Dev 1 — Recomendações e Monitoramento (após PRP-007)

#### 2.3 Critérios de Saída

- [ ] Relatório Preliminar e Final gerados com compilação de achados
- [ ] Recomendações com workflow Pendente→Cumprida→Vencida
- [ ] Alertas de vencimento e escalonamento funcional
- [ ] Consultorias solicitáveis por P05

---

### Onda 3: Qualidade e Governança (Should)

#### 2.1 Metadados

| Atributo | Valor |
|----------|-------|
| **PRPs** | 011, 012, 013 |
| **Pré-condição** | Onda 2 concluída, recomendações e relatórios funcionais |
| **Paralelo** | PRP-012 independente; PRP-011 e PRP-013 compartilham dependências |
| **Duração estimada** | 8 dias (2 semanas) |
| **Status** | Planejada |

#### 2.2 Sequência

- PRP-012 (6d): Dev 1 — Riscos, Competências, Biblioteca (independente, roda desde Onda 1 se houver capacidade)
- PRP-011 (5d): Dev 2 — PQAUD (após PRP-005 e PRP-007)
- PRP-013 (4d): Dev 3 — Governança e Fraudes (após PRP-007 e PRP-008)

#### 2.3 Critérios de Saída

- [ ] Autoavaliação PQAUD funcional
- [ ] Matriz de riscos com níveis calculados
- [ ] PAC-Aud com alerta de meta 40h
- [ ] Workflow de fraude: superior → 60 dias → TCE

---

### Onda 4: Dashboards e Integrações (Should/Could)

#### 2.1 Metadados

| Atributo | Valor |
|----------|-------|
| **PRPs** | 014 |
| **Pré-condição** | Ondas 1-3 concluídas |
| **Duração estimada** | 7 dias (1-2 semanas) |
| **Status** | Planejada |

#### 2.2 Sequência

- PRP-014 (7d): Dev 1 e Dev 2 — Dashboards (back + front), catálogo integrações, webhook SIAUD-Jud

#### 2.3 Critérios de Saída

- [ ] 5 dashboards funcionais com exportação PDF/XLSX
- [ ] Catálogo de integrações com health check
- [ ] Ações Coordenadas SIAUD-Jud recebíveis via webhook

---

## 3. Análise de Paralelismo

Execução sequencial: 77 dias (inclui 3 dias Onda 0)

Execução em paralelo com 3 devs: 48 dias

**Economia: 38% (29 dias)**

| Semana | Dev 1 | Dev 2 | Dev 3 |
|--------|-------|-------|-------|
| 0 | Onda 0 — Setup + Scaffolding ✅ | Onda 0 — Setup + Scaffolding ✅ | Onda 0 — Setup + Scaffolding ✅ |
| 1-2 | PRP-001 (Auth) | PRP-002 (RBAC) — após PRP-001 60% | — |
| 3-4 | PRP-003 (Universo) | PRP-005 (Auditorias) | PRP-009 (Ética/Sigilo) |
| 4 | PRP-004 (PALP/PAA) | PRP-005 (cont.) | — |
| 5 | PRP-004 (cont.) | PRP-006 (Achados) | — |
| 6 | PRP-007 (Relatórios) | PRP-010 (Consultorias) | PRP-012 (Riscos/Comp) |
| 7 | PRP-008 (Recomendações) | PRP-011 (Qualidade) | PRP-012 (cont.) |
| 8 | PRP-008 (cont.) | PRP-013 (Governança) | — |
| 9-10 | PRP-014 (Dashboards back) | PRP-014 (Dashboards front) | PRP-014 (Integrações) |

---

**Versão:** 1.1 | **Data:** 2026-06-25
