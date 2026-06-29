# Execution Waves — Ondas de Execução

> **Versão:** 1.2 | **Data:** 2026-06-29 | **Status:** Atualizado (Pós Onda-1 e Onda-2)
> **Projeto:** CONFORMITAS 3.0 | **Autor:** IA (Step 4)
> **Referências:** `DEPENDENCY_MATRIX.md`, `PLAN.md`, `docs/prps/PRP-*.md`

---

## 1. Visão Geral da Execução

### 1.1 Propósito
Este documento define o plano tático de execução em 5 ondas (Onda 0 concluída, Ondas 1-4 planejadas), detalhando para cada onda: PRPs incluídos, pré-condições, time alocado, riscos e critérios de saída.

### 1.2 Resumo Executivo

| Métrica | Valor |
|---------|-------|
| Ondas planejadas | 5 (Onda 0 ✅, Onda 1 ✅, Onda 2 ✅ concluídas) |
| Ondas em andamento | 2 (Onda 3 🔄, Onda 4 🔄) |
| PRPs totais | 14 |
| PRPs concluídos | 10 (001-010) |
| PRPs em andamento | 4 (011-014 — backend sem testes) |
| Progresso geral | ~71% |
| Dias total (paralelo — 3 devs) | 48 (inclui ~3 dias Onda 0) |
| Dias com folga 20% | 58 |
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

### Onda 1: Fundação e Core (Must) — Concluída ✅

#### 2.1 Metadados

| Atributo | Valor Planejado | Valor Real |
|----------|----------------|------------|
| **PRPs** | 001, 002, 003, 004, 005, 006, 009 | 001, 002, 003, 004, 005, 006, 009 |
| **Pré-condição** | Stack definido, ambiente dev | Ok |
| **Paralelo** | Até 3 PRPs simultâneos | 3 (PRP-003 + PRP-005 + PRP-009) |
| **Duração real** | 22 dias | ~20 dias |
| **Status** | 🔄 Em andamento | ✅ Concluída |

#### 2.2 PRPs Implementados

| PRP | Nome | Estimativa (dias) | Real (dias) | Status | Testes |
|-----|------|-------------------|-------------|--------|--------|
| 001 | Autenticação e Usuários | 8 | 8 | ✅ | service + controller |
| 002 | Perfis, RBAC e Configurações | 5 | 5 | ✅ | service + controller |
| 003 | Universo Auditável e Matriz | 6 | 5 | ✅ | service |
| 004 | PALP, PAA e Força de Trabalho | 8 | 7 | ✅ | service + controller |
| 005 | Auditorias, Evidências e Papéis | 8 | 8 | ✅ | service + controller |
| 006 | Achados e Manifestações | 5 | 5 | ✅ | service |
| 009 | Ética, Sigilo e Impedimentos | 4 | 3 | ✅ | service + controller |

#### 2.3 Critérios de Saída

- [x] Login com MFA funcional para P01, P02, P10
- [x] RBAC com 10 perfis aplicado em todos os endpoints
- [x] PAA pode ser criado, submetido por P01 e aprovado por P03
- [x] Auditoria pode ser aberta, evidências uploaded, papéis de trabalho criados
- [x] Achados registrados com 4 atributos e enviados para manifestação
- [x] Documentos classificáveis por sigilo

---

### Onda 2: Relatórios e Monitoramento (Must) — Concluída ✅

#### 2.1 Metadados

| Atributo | Valor Planejado | Valor Real |
|----------|----------------|------------|
| **PRPs** | 007, 008, 010 | 007, 008, 010 |
| **Pré-condição** | Onda 1 concluída | Ok |
| **Paralelo** | PRP-007 + PRP-010 | PRP-007 + PRP-010 |
| **Duração real** | 8 dias | ~7 dias |
| **Status** | Planejada | ✅ Concluída |

#### 2.2 PRPs Implementados

| PRP | Nome | Estimativa (dias) | Real (dias) | Status | Testes |
|-----|------|-------------------|-------------|--------|--------|
| 007 | Relatórios de Auditoria | 6 | 5 | ✅ | service + controller + PDF |
| 008 | Recomendações e Monitoramento | 6 | 6 | ✅ | service + controller + schedule |
| 010 | Consultorias e Assessoramento | 4 | 3 | ✅ | service |

#### 2.3 Critérios de Saída

- [x] Relatório Preliminar e Final gerados com compilação de achados
- [x] Recomendações com workflow Pendente→Cumprida→Vencida
- [x] Alertas de vencimento e escalonamento funcional
- [x] Consultorias solicitáveis por P05

---

### Onda 3: Qualidade e Governança (Should) — Em Andamento 🔄

#### 2.1 Metadados

| Atributo | Valor Planejado | Valor Real |
|----------|----------------|------------|
| **PRPs** | 011, 012, 013 | 011, 012, 013 |
| **Pré-condição** | Onda 2 concluída | Ok (backend implementado) |
| **Paralelo** | PRP-012 independente | Todos simultâneos |
| **Duração real** | 8 dias | ~4 dias (backend) |
| **Status** | Planejada | 🔄 Backend completo, sem testes |

#### 2.2 PRPs Implementados

| PRP | Nome | Estimativa (dias) | Real (dias) | Status | Testes |
|-----|------|-------------------|-------------|--------|--------|
| 011 | Qualidade e PQAUD | 5 | 4 | 🔄 | ❌ |
| 012 | Riscos, Competências e Biblioteca | 6 | 4 | 🔄 | ❌ |
| 013 | Governança e Fraudes | 4 | 3 | 🔄 | ❌ |

#### 2.3 Critérios de Saída

- [ ] Autoavaliação PQAUD funcional
- [ ] Matriz de riscos com níveis calculados
- [ ] PAC-Aud com alerta de meta 40h
- [ ] Workflow de fraude: superior → 60 dias → TCE

---

### Onda 4: Dashboards e Integrações (Should/Could) — Em Andamento 🔄

#### 2.1 Metadados

| Atributo | Valor Planejado | Valor Real |
|----------|----------------|------------|
| **PRPs** | 014 | 014 |
| **Pré-condição** | Ondas 1-3 concluídas | Ok (backend implementado) |
| **Duração real** | 7 dias | ~3 dias (backend) |
| **Status** | Planejada | 🔄 Backend completo, sem testes |

#### 2.2 PRPs Implementados

| PRP | Nome | Estimativa (dias) | Real (dias) | Status | Testes |
|-----|------|-------------------|-------------|--------|--------|
| 014 | Dashboards, BI e Integrações | 7 | 3 | 🔄 | ❌ |

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
| 1-2 | PRP-001 (Auth) ✅ | PRP-002 (RBAC) ✅ | — |
| 3-4 | PRP-003 (Universo) ✅ | PRP-005 (Auditorias) ✅ | PRP-009 (Ética/Sigilo) ✅ |
| 4 | PRP-004 (PALP/PAA) ✅ | PRP-005 (cont.) ✅ | — |
| 5 | PRP-004 (cont.) ✅ | PRP-006 (Achados) ✅ | — |
| 6 | PRP-007 (Relatórios) ✅ | PRP-010 (Consultorias) ✅ | PRP-012 (Riscos/Comp) 🔄 |
| 7 | PRP-008 (Recomendações) ✅ | PRP-011 (Qualidade) 🔄 | PRP-012 (cont.) 🔄 |
| 8 | PRP-008 (cont.) ✅ | PRP-013 (Governança) 🔄 | — |
| 9-10 | PRP-014 (Dashboards back) 🔄 | PRP-014 (Dashboards front) 🔄 | PRP-014 (Integrações) 🔄 |

---

**Versão:** 1.1 | **Data:** 2026-06-25
