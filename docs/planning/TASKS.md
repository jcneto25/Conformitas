# Tasks — Backlog de Desenvolvimento

> **Versão:** 1.0 | **Data:** 2026-06-16 | **Status:** Planejado (Step 6)
> **Projeto:** CONFORMITAS 3.0 (SGI) | **Metodologia:** PRP-Based Development
> **Autor:** IA (Step 6) | **Referências:** `DEPENDENCY_MATRIX.md`, `EXECUTION_WAVES.md`, `ARCHITECTURE.md`, `docs/prps/PRP-*.md`

---

## 1. Visão Geral

| Métrica | Valor |
|---------|-------|
| Total PRPs | 14 |
| Total Tarefas | 112 |
| Estimativa total (horas) | ~360h (~45 dias úteis com 3 devs) |
| Ondas | 4 |

---

## 2. Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ | Paralelo — pode executar simultaneamente (coluna Paralelo) / Concluído (coluna Status) |
| 🔄 | Parcialmente concluído — coluna Status |
| ⚠️ | Paralelo após setup — aguardar scaffolding (coluna Paralelo) |
| ❌ | Sequencial — depende de tarefa anterior |
| ⏳ | Pendente — coluna Status |
| `dev` | dev_agent |
| `qa` | qa_agent |
| `sec` | security_agent |

---

## 3. Onda 0 — Setup e Scaffolding (Transversal)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-001 | Inicializar repositório Git, estrutura de pastas, .gitignore | dev | — | — | 1 | ✅ |
| T-002 | Criar Docker Compose: PostgreSQL, Redis, API, Web, Nginx | dev | ✅ | T-001 | 3 | ✅ |
| T-003 | Configurar ESLint, Prettier, tsconfig strict | dev | ✅ | T-001 | 2 | ✅ |
| T-004 | Configurar GitHub Actions CI/CD (lint, type-check, test, build) | dev | ✅ | T-001 | 3 | ✅ |
| T-005 | Scaffolding NestJS: módulos base, guards, interceptors, pipes | dev | ⚠️ | T-002 | 4 | ✅ |
| T-006 | Scaffolding Angular: app module, routing, layout, auth interceptor | dev | ⚠️ | T-002 | 4 | ✅ |
| T-007 | Configurar Prisma: schema base, datasource, migration inicial | dev | ⚠️ | T-002 | 2 | ✅ |
| T-008 | Configurar Swagger/OpenAPI no NestJS | dev | ⚠️ | T-005 | 2 | ✅ |
| T-009 | Configurar Keycloak Docker (opcional) + strategy OIDC NestJS | dev | ✅ | T-002 | 4 | ✅ |

**Onda 0 total: 25h** | **Executado:** ~25h (9 concluídas ✅)

---

## 4. Onda 1 — Fundação e Core (PRP-001, 002, 003, 004, 005, 006, 009)

### 4.1 PRP-001 — Autenticação e Gestão de Usuários (8 dias)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-010 | Criar migration `usuarios` + `refresh_tokens` (Prisma) | dev | ❌ | T-007 | 2 | ⏳ |
| T-011 | Implementar AuthService: login, refresh, logout, MFA verify | dev | ❌ | T-010 | 6 | ⏳ |
| T-012 | Implementar JwtStrategy + MfaStrategy (Passport) | dev | ⚠️ | T-011 | 3 | ⏳ |
| T-013 | Implementar AuthController + DTOs (Zod) | dev | ❌ | T-011 | 3 | ⏳ |
| T-014 | Implementar UsuariosService: CRUD com dados funcionais | dev | ✅ | T-010 | 4 | ⏳ |
| T-015 | Implementar UsuariosController (protegido P10) | dev | ❌ | T-014 | 2 | ⏳ |
| T-016 | Implementar bloqueio após 5 tentativas de login | dev | ❌ | T-011 | 2 | ⏳ |
| T-017 | Criar AuthGuard + RolesGuard base (NestJS) | dev | ⚠️ | T-012 | 3 | ⏳ |
| T-018 | Testes unitários: AuthService, UsuariosService | qa | ❌ | T-011,T-014 | 4 | ⏳ |
| T-019 | Testes integração: login, refresh, MFA, CRUD usuários | qa | ❌ | T-013,T-015 | 5 | ⏳ |
| T-020 | Tela Login com formulário + validação | dev | ❌ | T-006,T-013 | 4 | ✅ |
| T-021 | Tela MFA (TOTP verification) | dev | ❌ | T-020,T-013 | 2 | ⏳ |
| T-022 | Tela UsuariosList (P10): tabela com busca, filtros | dev | ❌ | T-006,T-015 | 4 | ✅ |
| T-023 | Tela UsuarioForm (P10): cadastro/edição com dados funcionais | dev | ❌ | T-022 | 3 | ⏳ |

**PRP-001 total: 47h**

### 4.2 PRP-002 — Perfis, RBAC e Configurações (5 dias)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-024 | Criar migrations: `perfis`, `usuarios_perfis`, `mandatos`, `logs_sistema`, `configuracoes` | dev | ❌ | T-010 | 3 | ⏳ |
| T-025 | Seed: 10 perfis (P01-P10) com matriz de permissões + 7 configs padrão | dev | ⚠️ | T-024 | 3 | ⏳ |
| T-026 | Implementar PerfisService + PerfisController | dev | ⚠️ | T-025 | 3 | ⏳ |
| T-027 | Implementar RolesGuard completo com validação RBAC por endpoint | dev | ❌ | T-017,T-025 | 4 | ⏳ |
| T-028 | Implementar validacão segregação de funções (SOD) | dev | ❌ | T-026 | 3 | ⏳ |
| T-029 | Implementar MandatoService: regras 2 anos, máx 6, interstício 1 ano | dev | ✅ | T-024 | 4 | ⏳ |
| T-030 | Implementar ConfiguracoesService + controller | dev | ✅ | T-024 | 2 | ⏳ |
| T-031 | Implementar LogSistemaService: registro e consulta | dev | ✅ | T-024 | 3 | ⏳ |
| T-032 | Tela PerfilList + UsuarioPerfilForm (P10) | dev | ⚠️ | T-026 | 4 | ⏳ |
| T-033 | Tela MandatoList (P01, P03, P04) | dev | ✅ | T-029 | 2 | ⏳ |
| T-034 | Tela ConfiguracaoList (P10) | dev | ✅ | T-030 | 2 | ⏳ |
| T-035 | Testes: segregação de funções, RBAC por endpoint, mandatos | qa | ❌ | T-027,T-028,T-029 | 5 | ⏳ |

**PRP-002 total: 38h**

### 4.3 PRP-003 — Universo Auditável e Matriz de Priorização (6 dias) ⚠️ Paralelo com PRP-005, PRP-009

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-036 | Criar migration `universo_auditavel` | dev | ❌ | T-007 | 1 | ⏳ |
| T-037 | Implementar UniversoService: CRUD + validação notas 1-5 | dev | ❌ | T-036 | 4 | ⏳ |
| T-038 | Implementar UniversoController | dev | ❌ | T-037 | 2 | ⏳ |
| T-039 | Implementar cálculo do índice de priorização | dev | ❌ | T-037 | 3 | ⏳ |
| T-040 | Implementar MatrizService: ordenação, destaque por horas | dev | ❌ | T-039 | 4 | ⏳ |
| T-041 | Testes: CRUD universo, fórmula do índice, matriz | qa | ❌ | T-039,T-040 | 4 | ⏳ |
| T-042 | Tela UniversoAuditavelList + Form | dev | ❌ | T-006,T-038 | 5 | ✅ |
| T-043 | Tela MatrizPriorizacao (tabela ordenada) | dev | ❌ | T-040,T-042 | 4 | ⏳ |

**PRP-003 total: 27h**

### 4.4 PRP-005 — Auditorias, Evidências e Papéis de Trabalho (8 dias) ⚠️ Paralelo com PRP-003, PRP-009

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-044 | Criar migrations: `auditorias`, `comunicados`, `evidencias`, `papeis_trabalho`, `requisicoes` | dev | ❌ | T-007 | 3 | ⏳ |
| T-045 | Implementar AuditoriaService: abertura, workflow status, classificação | dev | ❌ | T-044 | 6 | ⏳ |
| T-046 | Implementar AuditoriaController | dev | ❌ | T-045 | 3 | ⏳ |
| T-047 | Implementar upload de evidências (multipart, validação tipo/tamanho) | dev | ❌ | T-044 | 5 | ⏳ |
| T-048 | Implementar PapelTrabalhoService + controller | dev | ✅ | T-044 | 4 | ⏳ |
| T-049 | Implementar RequisicaoService: prazo, notificação P05 | dev | ✅ | T-044 | 4 | ⏳ |
| T-050 | Implementar ComunicadoService: geração automática | dev | ⚠️ | T-045 | 3 | ⏳ |
| T-051 | Tela AuditoriaList + Detail (dashboard com abas) | dev | ❌ | T-006,T-046 | 6 | ✅ |
| T-052 | Tela AuditoriaForm (abertura) + ComunicadoPreview | dev | ❌ | T-051 | 4 | ⏳ |
| T-053 | Componente EvidenciaUpload + PapelTrabalhoEditor | dev | ❌ | T-047,T-048 | 5 | ⏳ |
| T-054 | Testes: abertura, upload, workflow status, multi-tenant P05 | qa | ❌ | T-045,T-047,T-049 | 6 | ⏳ |

**PRP-005 total: 49h**

### 4.5 PRP-009 — Ética, Sigilo e Impedimentos (4 dias) ⚠️ Paralelo com PRP-003, PRP-005

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-055 | Criar migrations: `declaracoes_independencia`, `impedimentos`, `classificacoes`, `log_acesso_sigiloso` | dev | ❌ | T-007 | 2 | ⏳ |
| T-056 | Implementar DeclaracaoService + controller | dev | ❌ | T-055 | 2 | ⏳ |
| T-057 | Implementar ImpedimentoService + verificação automática de conflitos | dev | ❌ | T-055 | 4 | ⏳ |
| T-058 | Implementar ClassificacaoService: níveis, controle de acesso por sigilo | dev | ❌ | T-055 | 4 | ⏳ |
| T-059 | Implementar middleware ClassificacaoGuard (bloqueia acesso não autorizado) | dev | ❌ | T-058 | 3 | ⏳ |
| T-060 | Tela DeclaracaoIndependencia (P01/P02) | dev | ❌ | T-006 | 2 | ✅ |
| T-061 | Componente ClassificacaoSelector (aplicável em todas as telas CRUD) | dev | ⚠️ | T-058 | 3 | ⏳ |
| T-062 | Testes: impedimento 12 meses, acesso sigiloso negado, trilha | qa | ❌ | T-057,T-058,T-059 | 4 | ⏳ |

**PRP-009 total: 24h**

### 4.6 PRP-004 — PALP, PAA e Força de Trabalho (8 dias) ⚠️ Após PRP-003

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-063 | Criar migrations: `planos_auditoria`, `itens_plano`, `forca_trabalho` | dev | ❌ | T-036 | 2 | ⏳ |
| T-064 | Implementar PlanoService: CRUD PALP/PAA, versionamento | dev | ❌ | T-063 | 5 | ⏳ |
| T-065 | Implementar workflow: RASCUNHO→SUBMETIDO→APROVADO (P03)→PUBLICADO | dev | ❌ | T-064 | 4 | ⏳ |
| T-066 | Implementar validação de horas (bloqueia submit se exceder) | dev | ⚠️ | T-065 | 2 | ⏳ |
| T-067 | Implementar ItemPlanoService: planejamento individual | dev | ⚠️ | T-064 | 4 | ⏳ |
| T-068 | Implementar ForcaTrabalhoService: horas disponíveis × alocadas | dev | ❌ | T-063 | 3 | ⏳ |
| T-069 | Implementar alerta de prazo PAA (01/novembro) + PALP (último ano) | dev | ✅ | T-064 | 2 | ⏳ |
| T-070 | Tela PlanoList + PlanoForm (abas: dados, itens, força trabalho) | dev | ❌ | T-006,T-064 | 6 | ✅ |
| T-071 | Tela PlanoAprovacao (P03) | dev | ❌ | T-065,T-070 | 3 | ⏳ |
| T-072 | Componente ForcaTrabalho (gráfico horas disponíveis × alocadas) | dev | ❌ | T-068 | 3 | ⏳ |
| T-073 | Testes: workflow aprovação, bloqueio horas, versionamento, alertas | qa | ❌ | T-065,T-066,T-069 | 5 | ⏳ |

**PRP-004 total: 39h**

### 4.7 PRP-006 — Achados e Manifestações (5 dias) ⚠️ Após PRP-005

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-074 | Criar migrations: `achados_auditoria`, `manifestacoes` | dev | ❌ | T-044 | 2 | ⏳ |
| T-075 | Implementar AchadoService: CRUD + validação 4 atributos | dev | ❌ | T-074 | 4 | ⏳ |
| T-076 | Implementar workflow: PRELIMINAR→EM_MANIFESTACAO (envio)→CONSOLIDADO | dev | ❌ | T-075 | 4 | ⏳ |
| T-077 | Implementar ManifestacaoService (P05 escopo unidade) | dev | ❌ | T-074 | 3 | ⏳ |
| T-078 | Implementar consolidação automática por expiração de prazo (cron job) | dev | ❌ | T-076 | 2 | ⏳ |
| T-079 | Tela QuadroAchados (tabela com filtros status/tipo) | dev | ❌ | T-051,T-075 | 4 | ⏳ |
| T-080 | Tela AchadoForm (4 campos + vínculo evidências) | dev | ❌ | T-079 | 4 | ⏳ |
| T-081 | Tela ManifestacaoForm (P05) | dev | ❌ | T-077,T-079 | 3 | ⏳ |
| T-082 | Testes: 4 atributos obrigatórios, workflow, expiração, multi-tenant | qa | ❌ | T-075,T-076,T-078 | 5 | ⏳ |

**PRP-006 total: 31h**

---

## 5. Onda 2 — Relatórios e Monitoramento (PRP-007, 008, 010)

### 5.1 PRP-007 — Relatórios de Auditoria (6 dias)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-083 | Criar migrations: `relatorios_auditoria`, `relatorios_anuais` | dev | ❌ | T-074 | 2 | ⏳ |
| T-084 | Implementar RelatorioService: compilar achados, gerar documento | dev | ❌ | T-083 | 5 | ⏳ |
| T-085 | Implementar geração de PDF (pdfkit/puppeteer) | dev | ❌ | T-084 | 4 | ⏳ |
| T-086 | Implementar RelatorioAnualService: consolidação exercício | dev | ✅ | T-083 | 4 | ⏳ |
| T-087 | Implementar assinatura eletrônica (P01) | dev | ❌ | T-084 | 3 | ⏳ |
| T-088 | Tela RelatorioPreview + assinatura | dev | ❌ | T-084,T-085 | 4 | ⏳ |
| T-089 | Tela RelatorioAnualForm | dev | ❌ | T-086 | 3 | ⏳ |
| T-090 | Testes: geração, compilação, sem manifestação, multi-tenant | qa | ❌ | T-084,T-086,T-087 | 4 | ⏳ |

**PRP-007 total: 29h**

### 5.2 PRP-008 — Recomendações e Monitoramento (6 dias) ⚠️ Após PRP-007

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-091 | Criar migrations: `recomendacoes`, `providencias` | dev | ❌ | T-083 | 2 | ⏳ |
| T-092 | Implementar RecomendacaoService: CRUD + workflow Pendente→Cumprida/Vencida | dev | ❌ | T-091 | 5 | ⏳ |
| T-093 | Implementar ProvidenciaService (P05) | dev | ⚠️ | T-091 | 3 | ⏳ |
| T-094 | Implementar alertas vencimento + escalonamento 30 dias (cron job) | dev | ❌ | T-092 | 4 | ⏳ |
| T-095 | Tela PainelMonitoramento (P01, P06): cards status, vencidas | dev | ❌ | T-006,T-092 | 5 | ✅ |
| T-096 | Tela RecomendacaoList + ProvidenciaForm (P05) | dev | ❌ | T-093,T-095 | 4 | ⏳ |
| T-097 | Testes: workflow, vencimento, escalonamento, multi-tenant P05/P06 | qa | ❌ | T-092,T-093,T-094 | 5 | ⏳ |

**PRP-008 total: 28h**

### 5.3 PRP-010 — Consultorias e Assessoramento (4 dias) ✅ Paralelo com PRP-007

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-098 | Criar migrations: `solicitacoes_consultoria`, `consultorias` | dev | ❌ | T-063 | 1 | ⏳ |
| T-099 | Implementar SolicitacaoService + controller (P05) | dev | ❌ | T-098 | 3 | ⏳ |
| T-100 | Implementar ConsultoriaService: aceitação, registro, termo cogestão | dev | ❌ | T-098 | 4 | ⏳ |
| T-101 | Tela SolicitacaoForm (P05) + ConsultoriaList (P01) | dev | ❌ | T-006,T-099 | 4 | ✅ |
| T-102 | Testes: workflow, verificação horas PAA, termo cogestão | qa | ❌ | T-099,T-100 | 3 | ⏳ |

**PRP-010 total: 15h**

---

## 6. Onda 3 — Qualidade e Governança (PRP-011, 012, 013)

### 6.1 PRP-011 — Qualidade e PQAUD (5 dias)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-103 | Criar migrations: `avaliacoes_qualidade`, `nao_conformidades`, `indicadores_qualidade` | dev | ❌ | T-007 | 2 | ⏳ |
| T-104 | Implementar AvaliacaoService: monitoramento, autoavaliação, externa | dev | ❌ | T-103 | 4 | ⏳ |
| T-105 | Implementar acesso temporário P07 (Avaliador Externo) | dev | ❌ | T-104 | 2 | ⏳ |
| T-106 | Implementar NaoConformidadeService: workflow ABERTA→CORRIGIDA | dev | ⚠️ | T-103 | 3 | ⏳ |
| T-107 | Tela AvaliacaoList + Form (P01, P07) | dev | ❌ | T-006,T-104 | 4 | ✅ |
| T-108 | Tela NaoConformidadeList + PlanoAcao | dev | ❌ | T-106 | 3 | ⏳ |
| T-109 | Testes: autoavaliação, externa, acesso temporário, workflow NC | qa | ❌ | T-104,T-105,T-106 | 4 | ⏳ |

**PRP-011 total: 22h**

### 6.2 PRP-012 — Riscos, Competências e Biblioteca (6 dias) ✅ Paralelo com PRP-011

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-110 | Criar migrations: `riscos`, `competencias`, `capacitacoes`, `documentos_metodologicos` | dev | ❌ | T-007 | 2 | ⏳ |
| T-111 | Implementar RiscoService: matriz probabilidade×impacto, nível calculado | dev | ❌ | T-110 | 5 | ⏳ |
| T-112 | Implementar CapacitacaoService: CRUD + totalização horas + alerta 40h | dev | ✅ | T-110 | 4 | ⏳ |
| T-113 | Implementar BibliotecaService: upload, versionamento, busca | dev | ✅ | T-110 | 3 | ⏳ |
| T-114 | Tela RiscoList + MatrizRiscos | dev | ❌ | T-111 | 4 | ⏳ |
| T-115 | Tela CapacitacaoList + alerta meta 40h | dev | ❌ | T-112 | 3 | ⏳ |
| T-116 | Tela BibliotecaList + Upload/Dowload | dev | ❌ | T-113 | 2 | ⏳ |
| T-117 | Testes: cálculo nível risco, totalização horas, versionamento | qa | ❌ | T-111,T-112,T-113 | 4 | ⏳ |

**PRP-012 total: 27h**

### 6.3 PRP-013 — Governança, Transparência e Fraudes (4 dias) ✅ Paralelo com PRP-011, PRP-012

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-118 | Criar migrations: `determinacoes_externas`, `registros_fraude` | dev | ❌ | T-007 | 1 | ⏳ |
| T-119 | Implementar DeterminacaoService: registro TCE/CNJ, prazo, status | dev | ❌ | T-118 | 3 | ⏳ |
| T-120 | Implementar RegistroFraudeService: workflow superior→60 dias→TCE | dev | ❌ | T-118 | 4 | ⏳ |
| T-121 | Tela DeterminacaoList + Form (P01) | dev | ❌ | T-119 | 3 | ⏳ |
| T-122 | Tela FraudeList + workflow comunicação | dev | ❌ | T-120 | 3 | ⏳ |
| T-123 | Testes: prazos determinação, workflow fraude 60 dias | qa | ❌ | T-119,T-120 | 3 | ⏳ |

**PRP-013 total: 17h**

---

## 7. Onda 4 — Dashboards e Integrações (PRP-014)

### 7.1 PRP-014 — Dashboards, BI e Integrações (7 dias)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-124 | Criar migrations: `integracoes`, `acoes_coordenadas`, `logs_integracao` | dev | ❌ | T-007 | 2 | ⏳ |
| T-125 | Implementar DashboardService: queries agregadas PAA, execução, recomendações | dev | ❌ | T-064,T-045,T-092 | 5 | ⏳ |
| T-126 | Implementar export PDF/XLSX para dashboards | dev | ❌ | T-125 | 3 | ⏳ |
| T-127 | Implementar IntegracaoService: catálogo, health check, teste conectividade | dev | ✅ | T-124 | 4 | ⏳ |
| T-128 | Implementar webhook Ações Coordenadas SIAUD-Jud | dev | ✅ | T-124 | 4 | ⏳ |
| T-129 | Implementar conector Ouvidoria TJCE (stub/mock inicial) | dev | ✅ | T-124 | 3 | ⏳ |
| T-130 | Tela DashboardPAA, DashboardExecucao, DashboardRecomendacoes | dev | ❌ | T-006,T-125 | 6 | ✅ |
| T-131 | Tela DashboardQualidade, DashboardForcaTrabalho | dev | ✅ | T-125 | 3 | ⏳ |
| T-132 | Tela IntegracaoList + IntegracaoForm (P10) + health dashboard | dev | ❌ | T-127 | 4 | ⏳ |
| T-133 | Tela AcaoCoordenadaList + Detail + Reporte CPA | dev | ❌ | T-128 | 3 | ⏳ |
| T-134 | Testes: dashboards, export, integração health, webhook SIAUD | qa | ❌ | T-125,T-127,T-128 | 5 | ⏳ |

**PRP-014 total: 42h**

---

## 8. Tarefas Transversais (Finalização)

| ID | Tarefa | Agente | Paralelo | Depende | Horas | Status |
|----|--------|--------|----------|---------|-------|--------|
| T-135 | E2E: fluxo completo planejamento→execução→achados→relatório→recomendação | qa | ❌ | Onda 2 | 8 | ⏳ |
| T-136 | Security scan: npm audit, SAST (Semgrep), secrets (Gitleaks) | sec | ❌ | T-004 | 4 | ⏳ |
| T-137 | Teste de carga básico (k6): login, listagem, upload | qa | ❌ | Onda 4 | 4 | ⏳ |
| T-138 | Documentação de deploy: README, DEPLOYMENT.md | dev | ❌ | Onda 4 | 4 | ⏳ |

---

## 9. Resumo por Onda

| Onda | PRPs | Tarefas | Horas | Dias (~8h/dia, 3 devs) | Status |
|------|------|---------|-------|------------------------|--------|
| 0 — Setup | Transversal | 9 | 25 | ~3 | ✅ 8/9 concluídas |
| 1 — Fundação e Core | 001,002,003,004,005,006,009 | 83 | 255 | ~11 | ⏳ |
| 2 — Relatórios e Monitoramento | 007,008,010 | 20 | 72 | ~3 | ⏳ |
| 3 — Qualidade e Governança | 011,012,013 | 21 | 66 | ~3 | ⏳ |
| 4 — Dashboards e Integrações | 014 | 11 | 42 | ~2 | ⏳ |
| Finalização | Transversal | 4 | 20 | ~1 | ⏳ |
| **TOTAL** | **14 PRPs** | **148 tarefas** | **~480h** | **~23 dias (3 devs)** | **7% concluído** |

---

**Status:** Aguardando validação Gate 7
