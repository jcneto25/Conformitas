# PRP-004 — PALP, PAA e Força de Trabalho

> **ID:** PRP-004 | **Onda:** 1 | **Estimativa:** 8 dias | **Status:** ⏳ Pending
> **Prioridade:** Alto | **Complexidade:** Alta | **Módulo:** MOD-PLN-001
> **Depende de:** PRP-001, PRP-002, PRP-003 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A DIRAUD-Jud exige PALP quadrienal e PAA anual baseados em riscos. Este PRP entrega a criação, edição, versionamento e workflow de aprovação dos planos, dimensionamento da força de trabalho, e planejamento individual de cada auditoria com escopo, equipe, cronograma, questões de auditoria e testes.

- [ ] PALP quadrienal: criação, edição, versionamento, aprovação
- [ ] PAA anual: criação, edição, versionamento, aprovação
- [ ] Workflow: Rascunho → Submetido (P01) → Aprovado (P03) → Publicado → Revisado
- [ ] Força de trabalho com horas disponíveis × alocadas
- [ ] Planejamento individual de cada auditoria

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-004.1 | Criar PALP | **Dado** que P01 acessa planejamento, **Quando** cria PALP para 2025-2028 com itens selecionados da matriz, **Então** o PALP é salvo como RASCUNHO | Must |
| RF-004.2 | Submeter PAA ao Presidente | **Dado** que o PAA 2026 está em RASCUNHO com itens e horas balanceadas, **Quando** P01 clica "Submeter", **Então** status muda para SUBMETIDO e P03 recebe notificação | Must |
| RF-004.3 | Presidente aprova PAA | **Dado** que P03 revisou o PAA submetido, **Quando** clica "Aprovar", **Então** status muda para APROVADO e data de aprovação registrada | Must |
| RF-004.4 | Bloquear PAA com excesso de horas | **Dado** que horas alocadas (2500h) > horas disponíveis (2000h), **Quando** P01 tenta submeter, **Então** sistema bloqueia: "Horas alocadas excedem a força de trabalho" | Must |
| RF-004.5 | Planejamento individual | **Dado** que um item do PAA está selecionado, **Quando** P01 define escopo, questões de auditoria, testes, equipe e cronograma, **Então** os dados são salvos no item do plano | Must |
| RF-004.6 | Alerta de prazo PAA | **Dado** que a data é 01/novembro e o PAA não foi submetido, **Quando** P01 acessa o sistema, **Então** exibe alerta "PAA deve ser submetido até 30/novembro" | Should |
| RF-004.7 | Versionamento | **Dado** que um plano foi publicado e o contexto mudou, **Quando** P01 cria revisão com justificativa, **Então** nova versão rascunho é criada e versão anterior preservada | Should |

---

## 3. API Contracts

### GET/POST /api/v1/planos
**Role:** P01, P02 (R) | Query: `?tipo=PALP|PAA&ano=&status=`

### POST /api/v1/planos/{id}/submeter
**Role:** P01 | Valida: horas alocadas ≤ disponíveis, ao menos 1 item

### POST /api/v1/planos/{id}/aprovar
**Role:** P03 | Valida: status = SUBMETIDO

### GET/POST /api/v1/planos/{id}/itens
**Role:** P01 (CUD), P02 (R)

### GET /api/v1/forca-trabalho?plano_id=&ano=
**Role:** P01

---

## 4. Database Changes

| Operação | Tabela | Campos |
|----------|--------|--------|
| CREATE | `planos_auditoria` | id, tipo (PALP/PAA), ano_inicio, ano_fim, status (RASCUNHO/SUBMETIDO/APROVADO/PUBLICADO/REVISADO), versao, data_submissao, data_aprovacao, data_publicacao, criado_por (FK) |
| CREATE | `itens_plano` | id, plano_id (FK), universo_auditavel_id (FK), tipo_auditoria, forma_execucao, horas_estimadas, equipe_ids (JSONB), escopo, objetivo, resultados_esperados, questoes_auditoria (JSONB), testes_previstos (JSONB), cronograma_inicio, cronograma_fim, prioridade |
| CREATE | `forca_trabalho` | id, plano_id (FK), usuario_id (FK), horas_disponiveis_ano, horas_alocadas_auditoria, horas_alocadas_consultoria, horas_alocadas_capacitacao, ano |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Criar PALP com itens e submeter → status SUBMETIDO | Integração |
| 2 | P03 aprova PAA → status APROVADO | Integração |
| 3 | Submeter PAA com horas excedentes → 422 Unprocessable | Integração |
| 4 | Devolver plano → status RASCUNHO + notificação | Integração |
| 5 | Versionamento: criar revisão de plano publicado | Integração |
| 6 | Alerta de prazo em 01/novembro | Unitário |

---

## 6. Definition of Done

- [ ] PALP e PAA com CRUD e workflow de aprovação completos
- [ ] Validação de horas no submit
- [ ] Planejamento individual com campos completos
- [ ] Alertas de prazo funcionais
- [ ] Versionamento preservando histórico
- [ ] Cobertura ≥ 80% unitários, ≥ 70% integração
- [ ] PR revisado
