# PRP-006 — Achados de Auditoria e Manifestações

> **ID:** PRP-006 | **Onda:** 1 | **Estimativa:** 5 dias | **Status:** ⏳ Pending
> **Prioridade:** Crítico | **Complexidade:** Média | **Módulo:** MOD-ACH-001
> **Depende de:** PRP-001, PRP-002, PRP-005 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A DIRAUD-Jud exige que todo achado de auditoria seja estruturado nos 4 atributos obrigatórios (situação, critério, causa, efeito). Este PRP entrega o registro de achados, vinculação a evidências, classificação positivo/negativo, envio à unidade auditada para manifestação e consolidação do quadro de achados.

- [ ] Registro de achado com 4 atributos e classificação
- [ ] Envio à unidade auditada com prazo de 5 dias úteis
- [ ] Coleta de manifestações (esclarecimento, justificativa, concordância, discordância)
- [ ] Consolidação automática após manifestação ou expiração
- [ ] Quadro consolidado de achados

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-006.1 | Registrar achado | **Dado** que auditoria está em execução, **Quando** P02 cria achado com situação, critério, causa, efeito e vincula evidências, **Então** achado é salvo como PRELIMINAR | Must |
| RF-006.2 | Bloquear sem 4 atributos | **Dado** que P02 tenta salvar achado sem preencher "critério", **Quando** clica Salvar, **Então** exibe erro "Critério é obrigatório (CNJ 309 art. 46)" | Must |
| RF-006.3 | Enviar para manifestação | **Dado** que achado está PRELIMINAR com 4 atributos, **Quando** P02 clica "Enviar para manifestação", **Então** status muda para EM_MANIFESTACAO, P05 notificado, prazo 5 dias úteis inicia | Must |
| RF-006.4 | Registrar manifestação | **Dado** que P05 recebeu achado para manifestação, **Quando** registra resposta com tipo JUSTIFICATIVA, **Então** manifestação é vinculada ao achado e P02 notificado | Must |
| RF-006.5 | Consolidação automática | **Dado** que prazo de 5 dias úteis expirou sem manifestação, **Quando** sistema executa verificação diária, **Então** achado consolida com ressalva "sem manifestação" | Should |
| RF-006.6 | Quadro de achados | **Dado** que auditoria tem 8 achados em diferentes status, **Quando** P01 acessa o quadro, **Então** vê tabela com código, tipo, status e pode filtrar | Must |

---

## 3. API Contracts

### POST /api/v1/auditorias/{id}/achados
**Role:** P02
```json
{ "tipo": "NEGATIVO", "situacao_encontrada": "...", "criterio": "...", "causa": "...", "efeito": "...", "evidencia_ids": ["uuid"] }
```

### POST /api/v1/achados/{id}/enviar-manifestacao
**Role:** P02 | Transição: PRELIMINAR → EM_MANIFESTACAO

### POST /api/v1/achados/{id}/manifestacoes
**Role:** P05 (escopo: unidade do achado)
```json
{ "conteudo": "string", "tipo": "JUSTIFICATIVA" }
```

### GET /api/v1/auditorias/{id}/achados
**Role:** P01, P02, P05 (própria unidade)

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `achados_auditoria` | id, auditoria_id (FK), codigo, tipo (POSITIVO/NEGATIVO), situacao_encontrada, criterio, causa, efeito, status (PRELIMINAR/EM_MANIFESTACAO/CONSOLIDADO), evidencia_ids (JSONB), autor_id (FK), prazo_manifestacao, data_consolidacao |
| `manifestacoes` | id, achado_id (FK), conteudo, tipo (ESCLARECIMENTO/JUSTIFICATIVA/CONCORDANCIA/DISCORDANCIA), autor_id (FK), data_manifestacao |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Criar achado com 4 atributos → 201 | Integração |
| 2 | Criar achado sem critério → 422 | Integração |
| 3 | Enviar para manifestação → P05 notificado | Integração |
| 4 | P05 registra manifestação → achado consolidado | Integração |
| 5 | Prazo expira → consolidação automática | Integração (mock de data) |
| 6 | P05 não vê achados de outra unidade | Integração |

---

## 6. Definition of Done

- [ ] CRUD de achados com validação dos 4 atributos
- [ ] Workflow PRELIMINAR → EM_MANIFESTACAO → CONSOLIDADO
- [ ] Manifestações com 4 tipos
- [ ] Consolidação automática por expiração de prazo
- [ ] Quadro de achados com filtros
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
