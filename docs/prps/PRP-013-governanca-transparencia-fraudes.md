# PRP-013 — Governança, Transparência e Fraudes

> **ID:** PRP-013 | **Onda:** 3 | **Estimativa:** 4 dias | **Status:** ⏳ Pending
> **Prioridade:** Média | **Complexidade:** Baixa | **Módulo:** MOD-GOV-001
> **Depende de:** PRP-001, PRP-002, PRP-007, PRP-008 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A transparência e a governança são pilares da atividade de auditoria. Este PRP entrega publicação de relatórios no portal de transparência, comunicação com Ouvidoria, registro de determinações de órgãos externos (TCE/CNJ) e documentação de indícios de fraude com workflow de comunicação.

- [ ] Publicação de relatórios no portal de transparência
- [ ] Registro de determinações TCE/CNJ com prazos
- [ ] Documentação de indícios de fraude
- [ ] Workflow: superior hierárquico → 60 dias → TCE

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-013.1 | Registrar determinação externa | **Dado** que a AUDIN recebeu determinação do TCE, **Quando** P01 registra com número, descrição e prazo, **Então** determinação aparece com status PENDENTE e alerta de prazo | Should |
| RF-013.2 | Documentar indício de fraude | **Dado** que auditoria identificou indício de fraude, **Quando** P02 registra com descrição e classificação SUSPEITA, **Então** P01 é notificado e pode encaminhar ao P03 | Should |
| RF-013.3 | Comunicação ao TCE | **Dado** que indício foi comunicado ao P03 há 60 dias sem resposta, **Quando** sistema verifica, **Então** alerta P01 para comunicar ao TCE | Should |

---

## 3. API Contracts

### POST /api/v1/determinacoes-externas
**Role:** P01
```json
{ "orgao": "TCE", "numero": "123/2026", "descricao": "string", "prazo_resposta": "2026-08-01" }
```

### POST /api/v1/registros-fraude
**Role:** P02
```json
{ "auditoria_id": "uuid", "descricao": "string", "classificacao": "SUSPEITA" }
```

### PUT /api/v1/registros-fraude/{id}/comunicar
**Role:** P01 | Campo: `data_comunicacao_superior` ou `data_comunicacao_tce`

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `determinacoes_externas` | id, orgao (TCE/CNJ/OUTRO), numero, descricao, data_recebimento, prazo_resposta, status |
| `registros_fraude` | id, auditoria_id (FK nullable), descricao, classificacao (SUSPEITA/CONFIRMADA/DESCARTADA), data_comunicacao_superior, data_comunicacao_tce | **Fallback `auditoria_id = null`:** Origem externa à auditoria (denúncia da Ouvidoria, comunicação espontânea). |

---

## 5. Definition of Done

- [ ] CRUD de determinações externas
- [ ] Registro de indícios de fraude
- [ ] Workflow de comunicação com prazos
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
