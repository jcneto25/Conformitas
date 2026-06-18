# PRP-009 — Ética, Sigilo e Impedimentos

> **ID:** PRP-009 | **Onda:** 1 | **Estimativa:** 4 dias | **Status:** ⏳ Pending
> **Prioridade:** Alto | **Complexidade:** Baixa | **Módulos:** MOD-ETI-001, MOD-SIG-001
> **Depende de:** PRP-001, PRP-002 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A independência da AUDIN exige controles éticos rigorosos. Este PRP entrega declaração anual de independência, registro de impedimentos, verificação de conflitos na designação de equipe, classificação de sigilo de documentos (Público/Interno/Restrito/Sigiloso), controle de acesso por classificação e auditorias sigilosas.

- [ ] Declaração anual de independência por auditor
- [ ] Impedimentos com vedação de 12 meses
- [ ] Verificação automática de conflitos ao designar equipe
- [ ] Classificação de sigilo em 4 níveis para todos os documentos
- [ ] Controle de acesso por classificação
- [ ] Auditorias sigilosas com acesso restrito

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-009.1 | Declaração de independência | **Dado** que P02 está autenticado, **Quando** registra declaração anual de independência, **Então** declaração fica registrada com data | Must |
| RF-009.2 | Registrar impedimento | **Dado** que P02 atuou na Secretaria X até 3 meses atrás, **Quando** tenta se declarar impedido para auditoria na Secretaria X, **Então** impedimento é registrado e P02 não aparece na designação | Must |
| RF-009.3 | Verificação automática de conflitos | **Dado** que P01 está designando equipe para auditoria na Secretaria Y, **Quando** seleciona P02 que atuou na Secretaria Y há 6 meses, **Então** sistema alerta "Conflito: P02 atuou na unidade nos últimos 12 meses" | Should |
| RF-009.4 | Classificar documento | **Dado** que P01 acessa uma evidência, **Quando** classifica como SIGILOSO, **Então** apenas P01 e P02 designados para a auditoria podem acessá-la | Must |
| RF-009.5 | Auditoria sigilosa | **Dado** que P01 marca auditoria como SIGILOSA, **Quando** P05 tenta acessar, **Então** recebe 403 — apenas P01, P02 designados e P03 visualizam | Must |
| RF-009.6 | Trilha de acesso sigiloso | **Dado** que P01 acessa um documento SIGILOSO, **Quando** o acesso ocorre, **Então** é registrado em trilha específica: quem, quando, qual ação | Should |

---

## 3. API Contracts

### POST /api/v1/declaracoes-independencia
**Role:** P01, P02 | Body: `{ "ano": 2026 }`

### POST /api/v1/impedimentos
**Role:** P01, P02
```json
{ "auditoria_id": "uuid", "motivo": "Atuei na unidade auditada há 6 meses" }
```

### PUT /api/v1/{entidade}/{id}/classificacao
**Role:** P01 | Body: `{ "nivel": "SIGILOSO", "justificativa": "string" }`

### GET /api/v1/trilha-acesso-sigiloso
**Role:** P01, P10

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `declaracoes_independencia` | id, usuario_id (FK), ano, declaracao, data_assinatura |
| `impedimentos` | id, usuario_id (FK), auditoria_id (FK), motivo, status (PENDENTE/ACEITO) |
| `classificacoes_documento` | id, entidade_tipo, entidade_id, nivel_sigilo (PUBLICO/INTERNO/RESTRITO/SIGILOSO), justificativa, classificado_por (FK) |
| `log_acesso_sigiloso` | id, usuario_id (FK), entidade_tipo, entidade_id, acao, data_acesso |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | P02 registra declaração anual → 201 | Integração |
| 2 | P02 declara impedimento → conflito detectado na designação | Integração |
| 3 | Documento SIGILOSO → P05 recebe 403 | Integração |
| 4 | Auditoria SIGILOSA → apenas P01 e designados acessam | Integração |
| 5 | Acesso a documento sigiloso gera trilha | Integração |

---

## 6. Definition of Done

- [ ] Declaração de independência funcional
- [ ] Impedimentos com verificação de conflitos
- [ ] Classificação de sigilo aplicada a todas as entidades
- [ ] Controle de acesso por classificação funcional
- [ ] Trilha de acesso a documentos sigilosos
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
