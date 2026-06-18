# PRP-011 — Qualidade e PQAUD

> **ID:** PRP-011 | **Onda:** 3 | **Estimativa:** 5 dias | **Status:** ⏳ Pending
> **Prioridade:** Média | **Complexidade:** Média | **Módulo:** MOD-QLD-001
> **Depende de:** PRP-001, PRP-002, PRP-005, PRP-007 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A DIRAUD-Jud exige Programa de Qualidade de Auditoria (PQAUD). Este PRP entrega monitoramento contínuo, autoavaliações periódicas, avaliações externas, não conformidades com planos de ação e indicadores de qualidade.

- [ ] Monitoramento contínuo (feedback, revisões, métricas)
- [ ] Autoavaliações periódicas
- [ ] Avaliações externas (com acesso temporário P07)
- [ ] Não conformidades com ações corretivas
- [ ] Indicadores de qualidade

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-011.1 | Criar autoavaliação | **Dado** que P01 acessa PQAUD, **Quando** cria autoavaliação para o período 2025 com nota 8.5, **Então** avaliação é registrada | Should |
| RF-011.2 | Registrar não conformidade | **Dado** que avaliador identificou falha, **Quando** registra não conformidade "Papéis sem evidência vinculada" com severidade ALTA, **Então** plano de ação é solicitado | Should |
| RF-011.3 | Avaliação externa | **Dado** que P07 (Avaliador Externo) tem acesso temporário, **Quando** registra avaliação externa no período, **Então** avaliação fica disponível para P01 com nota e recomendações | Should |
| RF-011.4 | Indicadores PQAUD | **Dado** que existem avaliações registradas, **Quando** P01 acessa indicadores, **Então** vê conformidade, notas médias e taxa de melhoria | Could |

---

## 3. API Contracts

### POST /api/v1/avaliacoes-qualidade
**Role:** P01, P07
```json
{ "tipo": "AUTOAVALIACAO", "periodo_inicio": "2025-01-01", "periodo_fim": "2025-12-31", "resultado": "...", "nota": 8.5 }
```

### POST /api/v1/avaliacoes-qualidade/{id}/nao-conformidades
**Role:** P01, P07
```json
{ "descricao": "string", "norma_referencia": "DIRAUD-Jud art. XX", "severidade": "ALTA" }
```

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `avaliacoes_qualidade` | id, tipo (MONITORAMENTO/AUTOAVALIACAO/EXTERNA), periodo_inicio, periodo_fim, resultado, nota, status, homologada_por (FK) |
| `nao_conformidades` | id, avaliacao_id (FK), descricao, norma_referencia, severidade, acao_corretiva, prazo, status (ABERTA/EM_CORRECAO/CORRIGIDA) |
| `indicadores_qualidade` | id, nome, descricao, periodicidade, meta, valor_atual |

---

## 5. Definition of Done

- [ ] CRUD de avaliações de qualidade
- [ ] Não conformidades com workflow ABERTA → EM_CORRECAO → CORRIGIDA
- [ ] Acesso temporário para P07
- [ ] Indicadores de qualidade
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
