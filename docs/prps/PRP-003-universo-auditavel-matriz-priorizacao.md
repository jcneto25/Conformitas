# PRP-003 — Universo Auditável e Matriz de Priorização

> **ID:** PRP-003 | **Onda:** 1 | **Estimativa:** 6 dias | **Status:** ⏳ Pending
> **Prioridade:** Alto | **Complexidade:** Média | **Módulo:** MOD-PLN-001
> **Depende de:** PRP-001, PRP-002 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A AUDIN precisa gerenciar o universo de áreas, processos e temas auditáveis do TJCE e priorizá-los com critérios objetivos. Este PRP entrega o cadastro do universo auditável com notas de materialidade, relevância, criticidade e risco, e a matriz de priorização automatizada que ordena os objetos para composição do PAA.

- [ ] CRUD do universo auditável com 4 notas de 1-5 por item
- [ ] Cálculo automático do índice de priorização
- [ ] Matriz ordenada com destaque dos itens que cabem no PAA por horas disponíveis

❌ NÃO inclui: PALP/PAA completos → PRP-004, força de trabalho → PRP-004.

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-003.1 | Cadastrar área auditável | **Dado** que um Auditor (P02) acessa o universo, **Quando** cadastra "Secretaria de Finanças" com notas 4,3,5,2 e tipo PROCESSO, **Então** o item aparece na lista com índice calculado | Must |
| RF-003.2 | Gerar matriz de priorização | **Dado** que existem 20 itens no universo com notas preenchidas, **Quando** P01 solicita a matriz, **Então** o sistema calcula índice = (Mat×Rev×Crit×Risco)^(1/4) e exibe lista ordenada | Must |
| RF-003.3 | Destacar itens do PAA | **Dado** que a força de trabalho tem 2000h disponíveis, **Quando** a matriz é gerada, **Então** o sistema destaca os primeiros itens cuja soma de horas ≤ 2000 | Should |
| RF-003.4 | Atualizar notas e recalcular | **Dado** que um item teve relevância alterada de 3 para 5, **Quando** P02 salva, **Então** o índice é recalculado e a posição na matriz atualiza | Should |

---

## 3. API Contracts

### GET /api/v1/universo-auditavel
**Role:** P01, P02 | Query: `?tipo=&ativo=true&search=`

### POST /api/v1/universo-auditavel
**Role:** P01, P02
```json
// Request
{ "nome": "string", "descricao": "string", "tipo": "AREA|PROCESSO|TEMA|PROJETO", "unidade_responsavel": "string", "materialidade": 3, "relevancia": 4, "criticidade": 5, "risco": 3 }
// Response 201
{ "id": "uuid", ..., "indice_priorizacao": 3.66 }
```

### GET /api/v1/matriz-priorizacao
**Role:** P01, P02 | Response: array ordenado por indice_priorizacao DESC

---

## 4. Database Changes

| Operação | Tabela | Campos | Índice |
|----------|--------|--------|--------|
| CREATE | `universo_auditavel` | id, nome, descricao, tipo (enum), unidade_responsavel, materialidade (1-5), relevancia (1-5), criticidade (1-5), risco (1-5), indice_priorizacao, ativo, created_at, updated_at | idx_tipo, idx_ativo |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Criar item com todas as notas = 5 resulta índice = 5.0 | Unitário |
| 2 | Criar item com notas 1,1,1,1 resulta índice = 1.0 | Unitário |
| 3 | Listar universo filtra por tipo AREA | Integração |
| 4 | Matriz ordena corretamente por índice decrescente | Integração |
| 5 | P05 não tem acesso ao universo auditável | Unitário (guard) |

---

## 6. Definition of Done

- [ ] CRUD do universo auditável funcional
- [ ] Fórmula do índice validada com dados de teste
- [ ] Matriz de priorização com ordenação e destaque de horas
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
