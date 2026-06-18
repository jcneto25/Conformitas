# PRP-010 — Consultorias e Assessoramento

> **ID:** PRP-010 | **Onda:** 2 | **Estimativa:** 4 dias | **Status:** ⏳ Pending
> **Prioridade:** Média | **Complexidade:** Baixa | **Módulo:** MOD-CON-001
> **Depende de:** PRP-001, PRP-002, PRP-004 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

Além das auditorias, a AUDIN presta consultorias e assessoramento às unidades do TJCE, vedada a cogestão. Este PRP entrega solicitações de consultoria, análise de aceitação, registro de serviços prestados e termo de ciência de vedação à cogestão.

- [ ] Solicitação de consultoria por unidades do TJCE
- [ ] Análise de aceitação com verificação de horas no PAA
- [ ] Registro de consultoria realizada

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-010.1 | Solicitar consultoria | **Dado** que P05 da Secretaria Y acessa consultorias, **Quando** registra solicitação com dúvida e fundamentação legal, **Então** solicitação aparece para P01 | Should |
| RF-010.2 | Aceitar consultoria | **Dado** que P01 recebeu solicitação, **Quando** verifica horas disponíveis e aceita, **Então** status muda para ACEITA e consultoria é registrada | Should |
| RF-010.3 | Termo de cogestão | **Dado** que P01 finaliza consultoria, **Quando** registra resultado, **Então** termo "Esta consultoria não configura ato de gestão" é exibido e registrado | Should |

---

## 3. API Contracts

### POST /api/v1/solicitacoes-consultoria
**Role:** P05
```json
{ "tema": "LICITACAO", "duvida": "string", "fundamentacao": "Lei 14.133/2021" }
```

### POST /api/v1/solicitacoes-consultoria/{id}/aceitar
**Role:** P01

### POST /api/v1/consultorias
**Role:** P01 | Body: tipo, escopo, horas, resultado, equipe_ids

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `solicitacoes_consultoria` | id, unidade_solicitante, tema, duvida, fundamentacao, status, solicitante_id (FK) |
| `consultorias` | id, solicitacao_id (FK nullable), tipo (ASSESSORAMENTO/TREINAMENTO/ACONSELHAMENTO), escopo, horas_utilizadas, resultado, equipe_ids (JSONB), plano_id (FK) |

---

## 5. Definition of Done

- [ ] Solicitação de consultoria funcional
- [ ] Workflow PENDENTE → ACEITA/RECUSADA → CONCLUIDA
- [ ] Verificação de horas no PAA antes de aceitar
- [ ] Termo de vedação à cogestão
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
