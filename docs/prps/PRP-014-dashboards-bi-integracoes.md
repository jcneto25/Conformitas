# PRP-014 — Dashboards, BI e Integrações

> **ID:** PRP-014 | **Onda:** 4 | **Estimativa:** 7 dias | **Status:** ⏳ Pending
> **Prioridade:** Média | **Complexidade:** Média | **Módulos:** MOD-DSH-001, MOD-INT-001
> **Depende de:** PRP-001, PRP-002, PRP-004, PRP-005, PRP-008 | **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A tomada de decisão da AUDIN depende de visibilidade gerencial. Este PRP entrega dashboards de acompanhamento (PAA, execução, recomendações, qualidade), exportação em PDF/XLSX, catálogo de integrações e conectores para Ouvidoria, Portal de Transparência e SIAUD-Jud (Ações Coordenadas).

- [ ] Dashboard PAA: planejado × executado
- [ ] Dashboard Execução: auditorias por status, tipo, unidade
- [ ] Dashboard Recomendações: status, criticidade, vencidas
- [ ] Dashboard Qualidade: indicadores PQAUD
- [ ] Exportação PDF/XLSX
- [ ] Catálogo de integrações com status de saúde
- [ ] Ações Coordenadas SIAUD-Jud

---

## 2. Requisitos Funcionais (Amostra)

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-014.1 | Dashboard PAA | **Dado** que existem dados de planejamento e execução, **Quando** P01 acessa dashboard, **Então** vê gráfico de barras: planejado × executado por mês | Should |
| RF-014.2 | Dashboard Recomendações | **Dado** que existem recomendações em vários status, **Quando** P01 ou P06 acessa, **Então** vê pizza de status e destaques de vencidas em vermelho | Should |
| RF-014.3 | Exportar relatório | **Dado** que P01 está em um dashboard, **Quando** clica "Exportar PDF", **Então** download inicia com dados do período filtrado | Should |
| RF-014.4 | Registrar integração | **Dado** que P10 acessa catálogo, **Quando** cadastra integração com Ouvidoria (REST, API_KEY), **Então** integração aparece com status EM_CONFIGURACAO | Could |
| RF-014.5 | Receber Ação Coordenada | **Dado** que SIAUD-Jud enviou ação coordenada, **Quando** sistema recebe webhook, **Então** ação aparece para P01 com dados e prazo | Should |
| RF-014.6 | Reportar resultado à CPA | **Dado** que auditoria da ação coordenada foi concluída, **Quando** P01 clica "Reportar à CPA", **Então** sistema envia resultado ao SIAUD-Jud | Should |

---

## 3. API Contracts

### GET /api/v1/dashboards/{tipo}?periodo_inicio=&periodo_fim=
**Role:** P01, P02 (parcial)

### GET /api/v1/dashboards/{tipo}/export?formato=PDF
**Role:** P01

### GET/POST /api/v1/integracoes
**Role:** P01 (R), P10 (CRUD)

### GET /api/v1/integracoes/health
**Role:** P01, P10

### POST /api/v1/acoes-coordenadas (webhook)
**Role:** Sistema (SIAUD-Jud)

### PUT /api/v1/acoes-coordenadas/{id}/reportar
**Role:** P01

---

## 4. Database Changes

| Tabela | Campos |
|--------|--------|
| `integracoes` | id, nome, sistema_externo, tipo (ENTRADA/SAIDA/BIDIRECIONAL), protocolo, endpoint, metodo_autenticacao, frequencia, status, health_status |
| `acoes_coordenadas` | id, codigo_siaud, titulo, descricao, metodologia, data_aprovacao_cpa, prazo_execucao, status, auditoria_id (FK nullable), resultado_reportado | **Fallback `auditoria_id = null`:** Ação coordenada recebida do SIAUD-Jud antes da auditoria local ser aberta. Vinculada posteriormente. |
| `logs_integracao` | id, integracao_id (FK), status, requisicao (JSONB), resposta (JSONB), erro, duracao_ms |

N/A para dashboards — são views/consultas sobre tabelas existentes.

---

## 5. Definition of Done

- [ ] 5 dashboards funcionais
- [ ] Exportação PDF e XLSX
- [ ] Catálogo de integrações com health check
- [ ] Webhook SIAUD-Jud para Ações Coordenadas
- [ ] Reporte de resultados à CPA
- [ ] Cobertura ≥ 80%
- [ ] PR revisado
