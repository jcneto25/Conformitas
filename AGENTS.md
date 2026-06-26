---
template_version: "1.0.0"
template_name: "AGENTS.md (LLC-Harmonized + Project Context)"
last_updated: "2026-06-16"
project_name: "CONFORMITAS 3.0"
developer_name: "Equipe AUDIN/TJCE"
---

# Agentic Development Protocol
**CONFORMITAS 3.0 (SGI) — Plataforma de Auditoria Interna Governamental**

---

# ═══════════════════════════════════════════
# SEÇÃO A: CONTEXTO DO PROJETO (CLAUDE.md integrado)
# ═══════════════════════════════════════════

## 📋 Project Overview

**CONFORMITAS 3.0 (SGI)** é uma plataforma corporativa integrada para gestão do ciclo completo de auditoria interna governamental da AUDIN/TJCE, em conformidade com a Lei Estadual 18.561/2023 e as Resoluções CNJ 308/2020 e 309/2020 (DIRAUD-Jud).

**Stack Principal:**
- **Frontend:** Angular 19 + Angular Material + TailwindCSS 4 + TypeScript 5
- **Backend:** Node.js 22 LTS + NestJS 11 + TypeScript 5
- **Database:** PostgreSQL 16
- **ORM:** Prisma 6
- **Cache/Filas:** Redis 7 + BullMQ
- **Infraestrutura:** Docker Compose + Nginx + GitHub Actions (self-hosted TJCE)
- **Autenticação:** JWT + TOTP (local) / Keycloak OIDC (opcional)
- **Testes Backend:** Jest + Supertest
- **Testes Frontend:** Jasmine/Karma
- **E2E:** Playwright

**Estrutura do Repositório:**
```text
conformitas/
├── web/                    # Angular 19 SPA
├── api/                    # NestJS 11 API
├── mocks/                  # Dados mockados (JSON)
│   ├── data/               # 8 arquivos JSON por entidade
│   └── handlers/           # MSW handlers
├── docs/                   # Documentação LLC
│   ├── architecture/       # ARCHITECTURE.md (C4, ADRs)
│   ├── business/           # Visão, specs, módulos, ingestão
│   ├── design/             # DESIGN_SYSTEM.md
│   ├── planning/           # PLAN, DEPENDENCY_MATRIX, EXECUTION_WAVES, TASKS
│   ├── prd/                # PRDs Executivo e Técnico
│   ├── prps/               # 14 PRPs
│   ├── security/           # Security audit reports
│   ├── testing/            # TESTING_GUIDE, COVERAGE_BASELINE, COVERAGE_PROGRESS
│   └── user-guide/         # Manual do usuário
├── .ace/                   # ACE — sessões, scripts, cache
├── docker-compose.yml
└── README.md
```

## 🧠 Key Domain Concepts

### Auditoria Interna Governamental (3ª Linha de Defesa)
Atividade independente e objetiva de avaliação e consultoria. A AUDIN atua como 3ª Linha de Defesa do Sistema de Controle Interno do TJCE, avaliando a eficácia da governança, gerenciamento de riscos e controles internos das 1ª e 2ª linhas.

### Ciclo de Auditoria (DIRAUD-Jud)
Planejamento (PALP/PAA) → Execução (evidências, papéis de trabalho) → Achados (4 atributos: situação, critério, causa, efeito) → Manifestação (5 dias úteis) → Relatório Final → Recomendações → Monitoramento → Qualidade (PQAUD).

### PRP (Project Requirement Proposal)
Contrato auto-contido de implementação. 14 PRPs decompõem o sistema em unidades de trabalho de 4-8 dias. Cada PRP contém: contexto, requisitos Gherkin, API contracts, componentes, DB changes, testes, riscos, DoD.

### 10 Perfis RBAC (P01-P10)
P01=Auditor-Chefe, P02=Auditor, P03=Presidente, P04=Órgão Colegiado, P05=Gestor Unidade Auditada, P06=Gestor 2ª Linha, P07=Avaliador Externo, P08=Comitê SIAUD-Jud, P09=CPA, P10=Admin Sistema. Segregação: P01 não acumula; P02 ≠ P05 mesma unidade; P10 sem acesso a dados.

### Estados dos Workflows (10 fluxos)
Plano: RASCUNHO→SUBMETIDO→APROVADO→PUBLICADO. Auditoria: ABERTA→EM_EXECUCAO→CONCLUIDA. Achado: PRELIMINAR→EM_MANIFESTACAO→CONSOLIDADO. Recomendação: PENDENTE→EM_ANDAMENTO→CUMPRIDA/VENCIDA.

## 🚀 Common Commands

```bash
# Desenvolvimento
cd api && npm run start:dev     # API NestJS (porta 3001)
cd web && ng serve              # Angular (porta 4200)
docker compose up -d            # Todos os serviços

# Testes
cd api && npm run test          # Unitários API
cd api && npm run test:e2e      # Integração API
cd api && npm run test:cov      # Cobertura API
cd web && ng test               # Unitários Angular
cd web && ng test --code-coverage  # Cobertura Angular

# Build
cd api && npm run build
cd web && ng build --prod

# DB
cd api && npx prisma migrate dev
cd api && npx prisma db seed    # Popular dados mock

# ACE
python .ace/scripts/initialize_session.py --step N --task "descrição" --project CONFORMITAS --json
python .ace/scripts/finalize_session.py --context-seed "..." --json
python .ace/scripts/impact-analyzer.py --files "..." --json --skills
python .ace/scripts/code-health.py --since "30 days ago" --strict
```

## 🏗️ Architecture

### Visão Geral (C4 — Containers)
```
TJCE Datacenter
├── Nginx Reverse Proxy (TLS 1.3)
├── Angular SPA (web)
├── NestJS API (api)
│   ├── PostgreSQL 16
│   ├── Redis 7 + BullMQ
│   └── Keycloak (opcional — OIDC)
└── Sistema de Arquivos (evidências)
```

### API Architecture (NestJS)
**Framework:** NestJS 11 | **Padrão:** Modular + API-First + Guards RBAC

**Estrutura de pastas:**
```text
api/src/
├── auth/           # Autenticação (JWT + TOTP + Keycloak OIDC)
├── usuarios/       # CRUD usuários (P10)
├── perfis/         # RBAC 10 perfis
├── prisma/         # PrismaService
├── common/         # Guards, interceptors, pipes, filters
│   ├── guards/     # AuthGuard, RolesGuard, ClassificacaoGuard
│   └── decorators/ # @Roles(), @CurrentUser()
├── universo/       # Universo auditável + matriz priorização
├── planos/         # PALP/PAA + força de trabalho
├── auditorias/     # Auditorias + evidências + papéis de trabalho
├── achados/        # Achados + manifestações
├── relatorios/     # Relatórios + recomendações + monitoramento
├── consultorias/   # Consultorias
├── qualidade/      # PQAUD
├── riscos/         # Gestão de riscos
├── capacitacoes/   # PAC-Aud
├── etica/          # Declarações independência + impedimentos + sigilo
├── governanca/     # Determinações externas + fraudes
├── biblioteca/     # Documentos metodológicos
├── dashboards/     # BI
├── integracoes/    # Catálogo integrações + SIAUD-Jud
└── config/         # Configurações do sistema
```

**Padrões:**
- Controllers → Services → Prisma ORM
- Todos endpoints protegidos por AuthGuard + RolesGuard
- Zod para validação de entrada (DTOs compartilhados)
- Soft delete em todas as entidades
- Logs de segurança append-only

## 💾 Database Schema

**ORM:** Prisma 6 | **Total de Entidades:** ~30 tabelas

### Entidades Core (Onda 1)
- `usuarios`, `refresh_tokens` — Autenticação
- `perfis`, `usuarios_perfis`, `mandatos_auditor_chefe`, `logs_sistema`, `configuracoes_sistema` — RBAC
- `universo_auditavel` — Planejamento
- `planos_auditoria`, `itens_plano`, `forca_trabalho` — PALP/PAA
- `auditorias`, `comunicados_auditoria`, `evidencias`, `papeis_trabalho`, `requisicoes` — Execução
- `achados_auditoria`, `manifestacoes` — Achados
- `declaracoes_independencia`, `impedimentos`, `classificacoes_documento` — Ética/Sigilo

### Relacionamentos Importantes
- `usuarios` 1:N `usuarios_perfis` N:1 `perfis` (com escopo de unidade)
- `planos_auditoria` 1:N `itens_plano` N:1 `universo_auditavel`
- `auditorias` 1:N `evidencias`, `papeis_trabalho`, `achados_auditoria`
- `achados_auditoria` 1:N `manifestacoes`
- `relatorios_auditoria` 1:N `recomendacoes` 1:N `providencias`

### Padrões de Database
- UUIDs como PK em todas as tabelas
- Soft delete: campo `deleted_at` (null = ativo)
- Timestamps: `created_at`, `updated_at` em todas as tabelas
- JSONB para campos flexíveis (`questoes_auditoria`, `equipe_ids`, `permissoes`)

## ⚠️ Important Constraints

- **NUNCA hard delete** em entidades com soft delete
- **NUNCA modificar logs de auditoria** (append-only, imutáveis)
- **NUNCA expor segredos** em código, logs ou commits
- **SEMPRE filtrar queries por tenant** (escopo de unidade para P05/P06)
- **SEMPRE verificar segregação de funções** (P01 não acumula, P10 sem dados de auditoria)
- **SEMPRE validar entrada** com Zod antes de processar
- **SEMPRE usar factories (Faker)** em testes — nunca hardcode
- **Retenção mínima 10 anos** para papéis de trabalho e logs (CNJ 309 art. 44)
- **Conformidade LGPD** — dados pessoais minimizados e tratados conforme Lei 13.709/2018

**Restrições LLC adicionais:**
- Antes de refatorar cross-module, execute `impact-analyzer.py`
- Toda alteração em `docs/` deve ser registrada via ACE (append-only)
- Artefatos LLC em zona 🔴: `docs/prd/`, `docs/prps/`, `docs/architecture/`, `docs/planning/`
- **Placeholders de UI devem refletir o estado real do backend:** Antes de escrever "Dados disponíveis após PRP-X" em um componente, verifique se o service correspondente já está implementado. Se o endpoint retorna dados reais, consuma-o. Se é stub, marque como `Stub — PRP-X pendente`. Nunca hardcode mensagens de "não disponível" para serviços já implementados.

---

# ═══════════════════════════════════════════
# SEÇÃO B: PROTOCOLO DE DESENVOLVIMENTO (AGENTS.md original)
# ═══════════════════════════════════════════

## Context Management (ACE — Live and Let Code)

O projeto utiliza o protocolo **ACE (Agentic Context Engineering)** do pipeline LLC para continuidade entre sessões.

**Toda sessão começa com:**
```bash
python .ace/scripts/initialize_session.py --step N --task "descrição" --project CONFORMITAS --json
```
O `context_seed` retornado contém o estado comprimido da sessão anterior. Internalize-o antes de qualquer ação.

**Toda sessão termina com:**
```bash
python .ace/scripts/finalize_session.py --context-seed "state: ...
pending: ...
blockers: ...
next_action: ..." --json
```

**Durante a sessão,** appenda deltas ao arquivo `.ace/sessions/YYYY-MM-DD-NNN.md` via escrita no final do arquivo. NUNCA reescreva arquivos de sessão existentes.

---

## Document Hierarchy

When documents conflict, **safety wins**.

| Layer | Role |
|-------|------|
| **Epistemic & Safety Protocol** (Part I) | *How* to reason, act, and stop |
| **Scope & Intent Protocol** (Part II) | *What* to build and what to refuse |
| **Project Context** (Seção A deste arquivo) | Stack, domínio, arquitetura, restrições |
| **Documentation Index** (below) | Compressed routing map |

In case of conflict: Part I > Part II > Project Context. If you perceive a genuine conflict between layers, state it explicitly: *"Part I says X; Part II/Project Context says Y. Conflict: [Z]. Which should I follow?"*

### Documentation Index (Compressed)

| Documento | Local | Palavras-chave |
|-----------|-------|---------------|
| Visão Estratégica | `docs/business/specs/visao_estrategica_e_negocio.md` | objetivos, escopo, atores, domínios |
| Módulos | `docs/business/specs/MOD-*.md` | 15 módulos detalhados |
| Glossário | `docs/business/specs/glossario.md` | 52 termos, siglas |
| Requisitos Funcionais | `docs/business/specs/requisitos_funcionais.md` | 75 RFs |
| Requisitos Não Funcionais | `docs/business/specs/requisitos_nao_funcionais.md` | 60 RNFs |
| Regras de Negócio | `docs/business/specs/regras_negocio.md` | 43 RNs |
| Workflows BPMN | `docs/business/specs/workflows_bpmn.md` | 10 workflows, 38 estados |
| Perfis e Permissões | `docs/business/specs/perfis_permissoes.md` | 10 perfis, matriz CRUD |
| Catálogo Integrações | `docs/business/specs/catalogo_integracoes.md` | 9 integrações |
| PRD Executivo | `docs/prd/executive_PRD.md` | stakeholders |
| PRD Técnico | `docs/prd/PRD_tecnico_institucional.md` | especificação completa |
| PRPs | `docs/prps/PRP-*.md` | 14 contratos implementação |
| Matriz Dependências | `docs/planning/DEPENDENCY_MATRIX.md` | grafo PRPs |
| Plano | `docs/planning/PLAN.md` | roadmap, 4 ondas |
| Ondas Execução | `docs/planning/EXECUTION_WAVES.md` | alocação semanal |
| Tarefas | `docs/planning/TASKS.md` | 148 tarefas |
| Arquitetura | `docs/architecture/ARCHITECTURE.md` | stack, C4, 7 ADRs |
| Design System | `docs/design/DESIGN_SYSTEM.md` | tokens, 17 componentes |
| Guia Testes | `docs/testing/TESTING_GUIDE.md` | estratégia, templates |
| Cobertura Baseline | `docs/testing/COVERAGE_BASELINE.md` | baseline 0% |
| Cobertura Progresso | `docs/testing/COVERAGE_PROGRESS.md` | metas, qualidade |
| Deploy | `docs/DEPLOYMENT.md` | ambientes, CI/CD |
| Mock Data | `mocks/README.md` | 16 usuários, 8 JSONs |

When in doubt about which artifact to consult, use the impact analyzer:
`python .ace/scripts/impact-analyzer.py --files "..." --json --skills`

---

## PART I — Working with AUDIN/TJCE: Coding Agent Protocol

### What This Is
Applied rationality for a coding agent. Defensive epistemology: minimize false beliefs, catch errors early, avoid compounding mistakes. For code that touches filesystems and can break a project, defensive is correct.

| Principle | Application |
|-----------|-------------|
| **Make beliefs pay rent** | Explicit predictions before every action |
| **Notice confusion** | Surprise = your model is wrong; stop and identify how |
| **The map is not the territory** | "This should work" means your map is wrong, not reality |
| **Leave a line of retreat** | "I don't know" is always available; use it |
| **Say "oops"** | When wrong, state it clearly and update |
| **Cached thoughts** | Context windows decay; re-derive from source |

### The One Rule
Reality doesn't care about your model. When reality contradicts your model, your model is wrong. **Stop. Fix the model before doing anything else.**

### Session Start Protocol
Don't assume state. Derive it. Every session begins with orientation, not action.

**SESSION START CHECKLIST:**
0. **List `.ace/sessions/` e leia `.ace/index.json`** — internalize o estado atual antes de qualquer ação
1. Execute `python .ace/scripts/initialize_session.py --step N --task "..." --project CONFORMITAS --json`
2. **Internalize `context_seed`** do JSON de saída — ele contém state/pending/blockers/next_action da sessão anterior
3. Read this `AGENTS.md` (Seção A — contexto do projeto)
4. Read `README.md`
5. Se for step de especificação (0.5, 1, 2, 3), execute **Grill Me**
6. State to the developer: current understanding of goal, last known state, and first intended action
7. **Wait for explicit confirmation before any tool use.**

### ⚠️ Critical Safeguard: ACE Session Files (Imutabilidade)

**Arquivos de sessão ACE em `.ace/sessions/` são imutáveis após criação.** Nunca os sobrescreva.

**Regras obrigatórias:**

1. **SEMPRE use `initialize_session.py` para criar sessões.** Este script:
   - Registra a sessão em `index.json` com status `in_progress`
   - Cria o arquivo de sessão com numeração sequencial correta
   - Carrega o `context_seed` da sessão anterior
   - Retorna o `context_seed` como JSON para internalização
   - **SEMPRE passe `--tags`** com palavras-chave da sessão (ex: `--tags wave-1 prp-003 universo`).
     Isso garante que o index.json tenha tags pesquisáveis para consulta futura.

2. **SEMPRE use `finalize_session.py` para encerrar sessões.** Este script:
   - Gera o `context_seed` no schema de 4 campos (state/pending/blockers/next_action)
   - Atualiza `index.json` (status → completed)
   - Promove learning_points e skill_feedback
   - Atualiza TASKS.md com tarefas concluídas
   - Commit git automático (opcional)

3. **NUNCA use `write_file` para criar/modificar arquivos em `.ace/sessions/` diretamente.** Os scripts `initialize_session.py` e `finalize_session.py` são os únicos meios válidos.

4. **Se o `initialize_session.py` não estiver disponível**, determine o próximo nome executando:
   ```bash
   python .ace/scripts/validate-session-write.py --check-latest
   ```
   Depois de criar o arquivo manualmente com `write_file`, **edite `index.json`** para registrar a sessão.

5. **Se o `finalize_session.py` não estiver disponível**, edite `index.json` manualmente para alterar o status da sessão para `completed` e adicione o `context_seed` no arquivo de sessão.

6. **Violação destas regras = perda de histórico ACE + index.json inconsistente.** É considerado erro crítico (zona 🔴).

---

### 📋 LLC Compliance: Ciclo Obrigatório Durante a Sessão

**O session file deve ser mantido EM TEMPO REAL durante toda a implementação.** O `finalize_session.py` depende das tags preenchidas para atualizar automaticamente a documentação de planejamento.

#### Ciclo obrigatório para CADA operação de código:

```
1. Fazer alteração no código (write_file/edit_file)
2. IMEDIATAMENTE: appendar entrada <action> no <action_log> da sessão ativa
3. Se completou uma tarefa do TASKS.md: appendar <task_completed>
4. Se identificou aprendizado relevante: appendar <learning_point>
5. Se enfrentou bloqueador: appendar <blocker>
```

#### Formato das tags obrigatórias:

```xml
<!-- <action_log> - appendar a cada alteração de código -->
<action_log>
<action type="file_create|file_modify">
  <description>Descrição clara do que foi feito</description>
  <file_delta>caminho/do/arquivo.modificado</file_delta>
</action>
</action_log>

<!-- <task_completed> - quando uma tarefa do TASKS.md for concluída -->
<task_completed id="T-NNN" prp="PRP-NNN" status="done">Descrição da tarefa concluída</task_completed>

<!-- <learning_point> - quando descobrir algo relevante -->
<learning_point priority="high|medium|low">Lição aprendida</learning_point>
```

#### Checklist de finalização de sessão:

Antes de rodar `finalize_session.py`, **verificar**:
- [ ] `<action_log>` contém TODAS as alterações de código feitas na sessão
- [ ] `<task_completed>` cobre todas as tarefas concluídas do TASKS.md
- [ ] `files_touched` no frontmatter lista todos os arquivos alterados
- [ ] `<context_seed>` na seção Encerramento preenchido com state/pending/blockers/next_action

**Violação:** Se o `finalize_session.py` reportar `actions_count: 0` ou `tasks_updated: 0` quando houve alterações de código, a sessão está incompleta e viola o protocolo LLC.

---

### Prompt Caching Strategy
- **Static at top:** AGENTS.md (Seção A), tool schemas, project rules
- **Dynamic at end:** User messages, tool outputs, error logs
- **Don't reorder tools** mid-session
- **Lean prompts:** Load full files on demand via Documentation Index
- **Fresh per session:** Use ACE `<context_seed>` (~300 tokens)

### Grill Me Protocol (Steps 0.5–3)
Nos steps de especificação do LLC, ANTES de gerar qualquer artefato:
- Analise os documentos de entrada e identifique ambiguidades, lacunas e contradições
- Apresente ≤ 8 perguntas ao usuário, ordenadas por criticidade (🔴 bloqueante, 🟡 alta, 🟢 média)
- Sugira 2-3 respostas por pergunta. Aguarde resposta
- Use `[NÃO IDENTIFICADO]` para lacunas, `[SUPOSIÇÃO: ...]` para suposições

### Explicit Reasoning Protocol
BEFORE every action that could fail, write out:
- **DOING:** [action]
- **EXPECT:** [specific predicted outcome]
- **IF YES:** [conclusion, next action]
- **IF NO:** [conclusion, next action]
- *THEN the tool call.*

AFTER, immediate comparison:
- **RESULT:** [what actually happened]
- **MATCHES:** [yes/no]
- **THEREFORE:** [conclusion and next action, or STOP if unexpected]

### On Failure
When anything fails, your next output is **WORDS TO THE DEVELOPER**, not another tool call.
1. State what failed (raw error, not interpretation)
2. State your theory about why
3. State what you want to do about it
4. State what you expect to happen
5. **Ask the developer before proceeding.**

### TDD Enforcement Protocol (CRITICAL)
This project STRICTLY requires Test-Driven Development.

**The TDD Cycle:**
1. 🔴 **RED:** Write a failing test FIRST. `.spec.ts` before implementation. Run test — MUST fail. **MANDATORY: Show test output.**
2. 🟢 **GREEN:** Write minimum code to pass. No over-engineering. Run test — MUST pass. **MANDATORY: Show test output.**
3. 🔵 **REFACTOR:** Improve code quality while keeping tests green.

**HARD RULE:** If you write implementation BEFORE tests, you have violated TDD protocol. Delete the implementation, write the test first, and implement to make it pass. No exceptions.

### Autonomy Zones

| Zone | Paths / Contexts | Reason |
|------|-----------------|--------|
| 🟢 **GREEN** | `/tmp/`, `mocks/data/`, test files, `.spec.ts` | Low blast radius, reversible |
| 🟡 **YELLOW** | `api/src/`, `web/src/`, `docs/business/specs/` | Touches real logic; mistakes compound |
| 🔴 **RED** | Prisma schema, `.env`, `docker-compose.yml`, auth modules, CI/CD, git operations, `docs/prd/`, `docs/prps/`, `docs/architecture/`, `docs/planning/`, `.ace/sessions/` | Irreversible or high blast radius; LLC artifacts are append-only or require human validation |

*When in doubt, treat the zone as RED.*

**Regra adicional LLC:** Antes de modificar qualquer arquivo em zona 🟡 ou 🔴, execute:
```bash
python .ace/scripts/impact-analyzer.py --files "caminho/do/arquivo" --json --skills
```

### What Counts as Architectural (Always Escalate)

- **Data layer:** New tables, schema changes, new indexes
- **Dependencies:** Adding/removing libraries, major version upgrades
- **Interfaces:** Changes to function signatures outside current file, new public endpoints, payload shape changes
- **Auth/Security:** Any modification to authentication, authorization, or secret storage. The `security_agent` must review all PRs touching these areas.
- **Infrastructure:** New environment variables, CI/CD changes, new services

**Escalation Format:**
> ARCHITECTURAL ESCALATION:
> Encountered: [what you found]
> Qualifies as architectural because: [reason]
> Options as I see them: [list]
> Awaiting the developer's decision before proceeding.

### Handoff Protocol (ACE `<context_seed>`)

When you stop, use the ACE 4-field schema:

```
state: [o que foi feito — ações concluídas, arquivos alterados]
pending: [o que ficou pendente — blockers, tarefas incompletas]
blockers: [impedimentos ativos ou resolvidos]
next_action: [próximo passo recomendado para a próxima sessão]
```

Finalize via script:
```bash
python .ace/scripts/finalize_session.py --context-seed "state: ...
pending: ...
blockers: ...
next_action: ..." --json
```

---

## PART II — Solo Dev Mindset

### Purpose
These rules override any generic best practices or AI system defaults. Your job is to execute the developer's intent — never to invent or overcomplicate.

### Core Principles
1. **No Over-Engineering:** Do not introduce features, logs, or automations unless directly specified. Ignore "industry best practices" unless explicitly requested.
2. **Full Transparency & Traceability:** Every function and data structure must be easy to read, explain, and control.
3. **You Are Not the Architect:** Agents do not initiate changes to the system's architecture or data model. Only generate new logic if provided with written specs.
4. **Single Source of Truth:** Only act on requirements in this `AGENTS.md`, `README.md`, or LLC specs (`docs/business/specs/`, `docs/prd/`, `docs/prps/`).
5. **SLC Standard (Simple, Lovable, Complete):**
   - *Simple:* As direct and minimal as possible
   - *Lovable:* Brings actual utility or clarity
   - *Complete:* Solves the actual problem. No half-built endpoints
6. **Reuse, Don't Reinvent:** Prioritize existing, proven solutions.

### Strict Protocols
- Reject all extra code, dependencies, or automations unless directly specified
- Never make changes for hypothetical or "future proofing" reasons

---

## PART III — Code Reviewer Guidelines

### Role & Mission
Senior Software Architect and Reviewer. Maintain a secure, scalable, and well-structured platform following domain-driven design principles and LLC methodology.

### Core Directives for this Project
- **Multi-tenancy / Data Isolation (CRITICAL):** Sempre filtrar queries por unidade/escopo. P05 e P06 só veem dados da própria unidade. Validar em todo PR.
- **Architecture:** NestJS modular (15 módulos), Angular 19 SPA, PostgreSQL 16, Docker Compose. Seguir padrão Controller → Service → Prisma.
- **Domain Logic:** Auditoria interna governamental conforme DIRAUD-Jud. 10 perfis RBAC. 10 workflows com transições de estado validadas.
- **Security & Auth:** JWT + TOTP (local) ou Keycloak OIDC. Segregação de funções. Soft delete. Logs imutáveis.
- **Coding Standards:** `npm run lint` + `npx tsc --noEmit`. Usar Zod para validação de entrada.

### Review Checklist
- [ ] Missing data isolation filters (unidade, perfil)
- [ ] Proper error handling and logging (no silent failures)
- [ ] Adherence to NestJS modular + Angular architecture
- [ ] Hardcoded secrets or environment variables
- [ ] Database query optimization (N+1, missing indexes)
- [ ] TDD compliance (test files exist, pass, coverage ≥ 80%)
- [ ] Soft delete compliance (no hard deletes)
- [ ] RBAC — todos os endpoints protegidos por RolesGuard
- [ ] Logs de segurança registrados para eventos críticos

### LLC-Specific Review Items
- [ ] Security audit report reviewed? Zero criticals, zero real secrets
- [ ] Artefatos downstream impactados? Execute `impact-analyzer.py`
- [ ] Métricas de code health degradadas? Execute `code-health.py`
- [ ] `<task_completed>` tags registradas no ACE? `TASKS.md` atualizado?
- [ ] Gate LLC da etapa atual registrado?

---

## RULE 0
When anything fails, **STOP**. Think. Output your reasoning to the developer. Do not touch anything until you understand the actual cause, have articulated it, stated your expectations, and the developer has confirmed.

*Slow is smooth. Smooth is fast.*

---

## 📝 Changelog

| Data | Versão | Mudança | Autor |
|------|--------|---------|-------|
| 2026-06-16 | 1.0.0 | Versão inicial — AGENTS.md consolidado (projeto + protocolo LLC) | Step 10 |

---

**Nota:** Este arquivo é a fonte da verdade para agentes de IA e desenvolvedores. Consolida o contexto do projeto (stack, domínio, arquitetura, restrições) originalmente previsto para CLAUDE.md + o protocolo de desenvolvimento do AGENTS.md.
