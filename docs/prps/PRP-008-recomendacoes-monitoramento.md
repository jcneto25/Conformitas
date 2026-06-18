# PRP-008 — Recomendações e Monitoramento

> **ID:** PRP-008 | **Onda:** 2 | **Estimativa:** 6 dias | **Status:** ⏳ Pending
> **Prioridade:** Alto | **Complexidade:** Média | **Módulo:** MOD-REL-001
> **Depende de:** PRP-001, PRP-002, PRP-007 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

As recomendações emitidas nos relatórios finais precisam ser monitoradas até implementação. Este PRP entrega o cadastro de recomendações com criticidade, prazo e responsável, o monitoramento com workflow de status, registro de providências pela unidade auditada, alertas de vencimento e escalonamento.

- [ ] Cadastro de recomendações vinculadas ao Relatório Final
- [ ] Workflow: Pendente → Em Andamento → Cumprida / Vencida
- [ ] Registro de providências pela unidade auditada
- [ ] Alertas de prazo e escalonamento para P01 e P06
- [ ] Verificação de recomendações pendentes em auditorias subsequentes

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-008.1 | Emitir recomendação | **Dado** que Relatório Final está sendo elaborado, **Quando** P01 adiciona recomendação "Implementar controle X" com criticidade ALTA e prazo 60 dias, **Então** recomendação é vinculada ao relatório | Must |
| RF-008.2 | Unidade registra providência | **Dado** que P05 recebeu recomendação PENDENTE, **Quando** registra providência "Controle implementado em 15/03" com evidência, **Então** status muda para EM_ANDAMENTO | Must |
| RF-008.3 | Recomendação cumprida | **Dado** que P05 registrou implementação total com evidência, **Quando** P02 valida, **Então** status muda para CUMPRIDA | Must |
| RF-008.4 | Recomendação vencida | **Dado** que prazo expirou e status é PENDENTE ou EM_ANDAMENTO, **Quando** sistema verifica, **Então** status muda para VENCIDA e P01 + P06 notificados | Must |
| RF-008.5 | Escalonamento | **Dado** que recomendação está VENCIDA há 30 dias, **Quando** sistema verifica, **Então** notifica P01 para possível comunicação ao Presidente | Should |
| RF-008.6 | Painel de monitoramento | **Dado** que P06 acessa monitoramento, **Quando** abre painel, **Então** vê todas as recomendações consolidadas por status com alertas visuais | Should |

---

## 3. API Contracts

### POST /api/v1/relatorios/{id}/recomendacoes
**Role:** P01
```json
{ "descricao": "string", "criticidade": "ALTA", "prazo": "2026-09-01", "responsavel_id": "uuid", "achado_id": "uuid|null" }
```

### GET /api/v1/recomendacoes?status=&criticidade=&auditoria_id=&unidade_id=
**Role:** P01, P02, P05 (própria unidade), P06 (todas)

### PUT /api/v1/recomendacoes/{id}
**Role:** P05 (própria unidade, apenas status e providências)

### POST /api/v1/recomendacoes/{id}/providencias
**Role:** P05
```json
{ "descricao": "string", "evidencia_path": "string|null" }
```

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `recomendacoes` | id, relatorio_id (FK), achado_id (FK nullable), descricao, criticidade, prazo, responsavel_id (FK), status (PENDENTE/EM_ANDAMENTO/CUMPRIDA/VENCIDA/CANCELADA) |
| `providencias` | id, recomendacao_id (FK), descricao, data, autor_id (FK), evidencia_path |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Emitir recomendação com prazo → 201 | Integração |
| 2 | P05 registra providência → EM_ANDAMENTO | Integração |
| 3 | P02 valida implementação → CUMPRIDA | Integração |
| 4 | Prazo expira → VENCIDA + notificação P01/P06 | Integração |
| 5 | Escalonamento após 30 dias vencida | Integração |
| 6 | P06 vê recomendações de todas as unidades | Integração |

---

## 6. Definition of Done

- [ ] CRUD de recomendações com workflow completo
- [ ] Registro de providências com evidências
- [ ] Alertas de vencimento e escalonamento
- [ ] Painel de monitoramento para P01, P06
- [ ] Verificação de pendentes em nova auditoria na mesma área
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
