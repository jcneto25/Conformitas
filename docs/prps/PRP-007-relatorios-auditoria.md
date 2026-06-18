# PRP-007 — Relatórios de Auditoria (Preliminar e Final)

> **ID:** PRP-007 | **Onda:** 2 | **Estimativa:** 6 dias | **Status:** ⏳ Pending
> **Prioridade:** Alto | **Complexidade:** Média | **Módulo:** MOD-REL-001
> **Depende de:** PRP-001, PRP-002, PRP-006 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

Após a consolidação dos achados, a AUDIN emite relatórios de auditoria. Este PRP entrega a geração de Relatório Preliminar (para manifestação), Relatório Final (com achados consolidados e recomendações) e Relatório Anual de Atividades para o órgão colegiado.

- [ ] Relatório Preliminar com achados e envio à unidade
- [ ] Relatório Final com recomendações
- [ ] Relatório Anual de Atividades consolidando exercício

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-007.1 | Emitir Relatório Preliminar | **Dado** que auditoria tem achados PRELIMINAR, **Quando** P02 gera Relatório Preliminar, **Então** sistema compila achados e gera documento estruturado | Must |
| RF-007.2 | Emitir Relatório Final | **Dado** que todos os achados estão CONSOLIDADO, **Quando** P02 gera Relatório Final e adiciona recomendações, **Então** documento é gerado e P01 pode assinar | Must |
| RF-007.3 | Ausência de manifestação não obsta | **Dado** que há achados sem manifestação (prazo expirado), **Quando** P02 gera Relatório Final, **Então** achados sem manifestação são incluídos com ressalva | Must |
| RF-007.4 | Relatório Anual | **Dado** que o exercício 2025 está encerrado, **Quando** P01 gera Relatório Anual, **Então** sistema consolida: desempenho PAA, declaração independência, principais riscos | Must |
| RF-007.5 | Assinatura do Relatório Final | **Dado** que Relatório Final está em RASCUNHO, **Quando** P01 revisa e assina, **Então** status muda para ASSINADO e relatório fica disponível | Should |

---

## 3. API Contracts

### POST /api/v1/auditorias/{id}/relatorios
**Role:** P01, P02
```json
{ "tipo": "PRELIMINAR|FINAL" }
```

### GET /api/v1/relatorios/{id}
**Role:** P01, P02, P05 (própria unidade)

### POST /api/v1/relatorios/{id}/assinar
**Role:** P01

### POST /api/v1/relatorios-anuais
**Role:** P01 | Body: `{ "ano": 2025 }`

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `relatorios_auditoria` | id, auditoria_id (FK), tipo (PRELIMINAR/FINAL), conteudo, data_emissao, assinado_por (FK), status (RASCUNHO/PRELIMINAR/FINAL/ASSINADO) |
| `relatorios_anuais` | id, ano, conteudo, status (RASCUNHO/ENVIADO/DELIBERADO/PUBLICADO), data_envio, data_publicacao |

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | Gerar relatório preliminar com achados PRELIMINAR | Integração |
| 2 | Gerar relatório final com achados CONSOLIDADO | Integração |
| 3 | Relatório final inclui achados sem manifestação | Integração |
| 4 | P01 assina relatório → ASSINADO | Integração |
| 5 | Relatório anual consolida dados do exercício | Integração |
| 6 | P05 vê apenas relatórios da sua unidade | Integração |

---

## 6. Definition of Done

- [ ] Geração de Relatório Preliminar e Final
- [ ] Compilação automática de achados e manifestações
- [ ] Assinatura eletrônica pelo P01
- [ ] Relatório Anual com consolidação de exercício
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
