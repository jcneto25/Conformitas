# CONFORMITAS (SGI)
## MOD-DSH-001 — Dashboards e Business Intelligence

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-DSH-001 |
| **Nome do Módulo** | Dashboards e Business Intelligence |
| **Domínio Funcional** | Dashboards e Business Intelligence |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 4 |
| **Dependências** | MOD-PLN-001, MOD-EXE-001, MOD-REL-001, MOD-ACH-001 |
| **Estimativa (homem-dia)** | 12 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Centraliza a visualização gerencial e estratégica da atividade de auditoria interna por meio de dashboards e relatórios de Business Intelligence. Consolida dados de todos os módulos operacionais (planejamento, execução, achados, recomendações, qualidade) para apoiar a tomada de decisão do Auditor-Chefe e a transparência institucional.

### 2.2 Escopo do Módulo
- Dashboard de acompanhamento do PAA (planejado vs. executado)
- Dashboard de execução (auditorias em andamento, concluídas, suspensas)
- Dashboard de achados e recomendações (status, criticidade, prazos)
- Dashboard de qualidade e indicadores (PQAUD)
- Dashboard de força de trabalho (horas, capacitação)
- Relatórios gerenciais exportáveis (PDF, Excel)

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-DSH-001 | Dashboard PAA | Gráficos de execução do PAA, cobertura do universo auditável | Should |
| RF-DSH-002 | Dashboard Execução | Auditorias por status, tipo, forma, unidade auditada, tempo médio | Should |
| RF-DSH-003 | Dashboard Recomendações | Recomendações por status, criticidade, vencidas, taxa de cumprimento | Should |
| RF-DSH-004 | Dashboard Qualidade | Indicadores do PQAUD, não conformidades, avaliações | Could |
| RF-DSH-005 | Dashboard Força de Trabalho | Horas alocadas vs. disponíveis, capacitação por auditor | Could |
| RF-DSH-006 | Relatórios Gerenciais | Geração de relatórios consolidados exportáveis | Should |

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-DSH-001 | Dados restritos | Dashboards são de acesso restrito à AUDIN (dados operacionais internos) |
| RN-DSH-002 | Versão pública | Alguns indicadores devem ter versão pública para transparência |
| RN-DSH-003 | Atualização | Dados dos dashboards atualizados em tempo real ou batch diário |

---

## 5. MODELO DE DADOS DO MÓDULO

### 5.1 Entidades Principais

#### PainelConfig
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `nome` | String | Sim | Nome do painel |
| `tipo` | Enum | Sim | PAA, EXECUCAO, RECOMENDACOES, QUALIDADE, FORCA_TRABALHO |
| `config` | JSON | Sim | Configuração dos widgets e gráficos |
| `usuario_id` | UUID | Não | Se for painel personalizado |

---

## 6. INTERFACES E INTERAÇÕES

| Módulo de Origem/Destino | Dado Compartilhado | Direção | Mecanismo |
|--------------------------|--------------------|---------|-----------|
| MOD-PLN-001 | Dados do PAA e universo auditável | Entrada | API / View materializada |
| MOD-EXE-001 | Dados de auditorias em execução | Entrada | API |
| MOD-REL-001 | Dados de recomendações e monitoramento | Entrada | API |
| MOD-ACH-001 | Dados de achados | Entrada | API |
| MOD-QLD-001 | Indicadores de qualidade | Entrada | API |

---

## 7. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Dashboards responsivos e acessíveis
- [ ] Exportação para PDF e Excel
- [ ] Cobertura de testes ≥ 80%
- [ ] Performance de consultas otimizada
- [ ] PR revisado e aprovado
