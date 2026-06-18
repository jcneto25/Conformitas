# PRP-005 — Auditorias, Evidências e Papéis de Trabalho

> **ID:** PRP-005 | **Onda:** 1 | **Estimativa:** 8 dias | **Status:** ⏳ Pending
> **Prioridade:** Crítico | **Complexidade:** Alta | **Módulo:** MOD-EXE-001
> **Depende de:** PRP-001, PRP-002, PRP-004 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A execução das auditorias é a atividade central da AUDIN. Este PRP entrega a abertura de auditorias a partir do PAA aprovado, emissão de Comunicado, programa de auditoria, coleta de evidências documentais, papéis de trabalho estruturados e requisições formais à unidade auditada. Suporta 5 tipos (conformidade, operacional, financeira, gestão, especial) e 4 formas (direta, integrada, indireta, terceirizada).

- [ ] Abertura de auditoria com Comunicado
- [ ] Programa de Auditoria com testes e procedimentos
- [ ] Upload e catalogação de evidências (até 25MB)
- [ ] Papéis de trabalho estruturados
- [ ] Requisições formais com prazo

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-005.1 | Abrir auditoria | **Dado** que existe PAA aprovado com itens, **Quando** P01 aciona "Abrir Auditoria" no item X, **Então** cria auditoria ABERTA e gera Comunicado com objetivo, unidade, equipe e fases | Must |
| RF-005.2 | Programa de Auditoria | **Dado** que auditoria está ABERTA, **Quando** P02 preenche escopo, questões, testes e cronograma, **Então** o programa fica disponível para guiar a execução | Must |
| RF-005.3 | Upload de evidência | **Dado** que auditoria está EM_EXECUCAO, **Quando** P02 faz upload de arquivo PDF com metadados (tipo DOCUMENTO, fonte "Sistema X"), **Então** evidência é salva com atributos de confiabilidade | Must |
| RF-005.4 | Papel de trabalho | **Dado** que existem evidências coletadas, **Quando** P02 cria papel de trabalho PT-001 com metodologia e vincula evidências, **Então** papel fica registrado e referenciável | Must |
| RF-005.5 | Requisição à unidade | **Dado** que auditoria está em execução, **Quando** P02 emite requisição com prazo de 10 dias, **Então** P05 da unidade recebe notificação e prazo inicia contagem | Must |
| RF-005.6 | Suspender auditoria | **Dado** que houve obstrução ao acesso, **Quando** P01 registra obstrução e suspende, **Então** status muda para SUSPENSA e P03 é notificado | Must |

---

## 3. API Contracts

### POST /api/v1/auditorias
**Role:** P01
```json
{ "item_plano_id": "uuid", "observacoes": "string" }
```

### GET /api/v1/auditorias/{id}/evidencias
**Role:** P01, P02

### POST /api/v1/auditorias/{id}/evidencias (multipart)
**Role:** P02 | Max: 25MB
```
FormData: arquivo + { tipo, descricao, fonte }
```

### POST /api/v1/auditorias/{id}/papeis-trabalho
**Role:** P02
```json
{ "codigo": "PT-001", "descricao": "string", "evidencia_ids": ["uuid"] }
```

### POST /api/v1/auditorias/{id}/requisicoes
**Role:** P02
```json
{ "descricao": "string", "prazo_dias": 10 }
```

---

## 4. Database Changes

| Tabela | Campos principais |
|--------|-------------------|
| `auditorias` | id, item_plano_id (FK), numero, tipo, forma, status, unidade_auditada, objetivo, escopo, data_inicio, data_fim_prevista, data_fim_real |
| `comunicados_auditoria` | id, auditoria_id (FK), numero, data_emissao, conteudo, assinado_por (FK) |
| `evidencias` | id, auditoria_id (FK), tipo, descricao, fonte, data_obtencao, arquivo_path, atributos (JSONB) |
| `papeis_trabalho` | id, auditoria_id (FK), codigo, descricao, evidencia_ids (JSONB), autor_id (FK) |
| `requisicoes` | id, auditoria_id (FK), descricao, prazo, data_resposta, respondida |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Abrir auditoria a partir de item do PAA | Integração |
| 2 | Bloquear abertura se PAA não aprovado | Integração |
| 3 | Upload de evidência > 25MB retorna 413 | Integração |
| 4 | Criar papel de trabalho com evidência vinculada | Integração |
| 5 | Suspender auditoria notifica P01 e P03 | Integração |
| 6 | P05 visualiza requisição da sua unidade mas não de outra | Integração (multi-tenant) |

---

## 6. Definition of Done

- [ ] CRUD de auditorias com workflow ABERTA → EM_EXECUCAO → CONCLUIDA/SUSPENSA
- [ ] Upload de evidências com validação de tipo e tamanho
- [ ] Papéis de trabalho com vínculo a evidências
- [ ] Requisições com prazo e notificação
- [ ] Armazenamento seguro de arquivos
- [ ] Cobertura ≥ 80% unitários, ≥ 70% integração
- [ ] PR revisado
