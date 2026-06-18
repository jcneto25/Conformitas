# CONFORMITAS (SGI)
## MOD-QLD-001 — Qualidade e PQAUD

**Versão:** 1.0
**Data:** 16/06/2026
**Autor:** Gerado por IA
**Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-QLD-001 |
| **Nome do Módulo** | Qualidade e Programa de Qualidade de Auditoria (PQAUD) |
| **Domínio Funcional** | Qualidade |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 3 |
| **Dependências** | MOD-EXE-001, MOD-REL-001 |
| **Estimativa (homem-dia)** | 10 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Instrumentaliza o Programa de Qualidade de Auditoria (PQAUD) exigido pela DIRAUD-Jud (CNJ 309/2020, Capítulo IX, arts. 62-68). Suporta avaliações internas (monitoramento contínuo e autoavaliações periódicas) e externas (avaliação independente), com métricas de desempenho, feedback e planos de melhoria contínua.

### 2.2 Alinhamento Estratégico
- **Objetivo Estratégico relacionado:** OE-04 — Instrumentalizar o PQAUD
- **Macroprocesso atendido:** Qualidade e Melhoria Contínua
- **Capacidade de negócio viabilizada:** Autocontrole da Qualidade

### 2.3 Escopo do Módulo

#### Dentro do Escopo
- Monitoramento contínuo da qualidade (feedback de clientes, revisão de trabalhos, métricas)
- Autoavaliações periódicas (qualidade do trabalho, supervisão, infraestrutura, valor agregado)
- Avaliações externas (opinião independente, avaliação recíproca entre AUDINs)
- Indicadores de qualidade e conformidade com normas
- Planos de melhoria com ações corretivas e preventivas
- Registro de não conformidades

#### Fora do Escopo
- Execução das auditorias em si (MOD-EXE-001)
- Capacitação dos auditores (MOD-CAP-001)

---

## 3. REQUISITOS FUNCIONAIS

### 3.1 Lista de Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade | Status |
|----|---------------|-----------|------------|--------|
| RF-QLD-001 | Monitoramento Contínuo | Registrar feedback, revisões e métricas de qualidade | Should | Pendente |
| RF-QLD-002 | Autoavaliação Periódica | Ciclo de autoavaliação com checklists e relatórios | Should | Pendente |
| RF-QLD-003 | Avaliação Externa | Registro de avaliações externas e recíprocas | Should | Pendente |
| RF-QLD-004 | Plano de Melhoria | Registrar não conformidades e ações corretivas | Should | Pendente |
| RF-QLD-005 | Indicadores de Qualidade | Dashboard com métricas de desempenho da AUDIN | Should | Pendente |
| RF-QLD-006 | Matriz de Conformidade | Verificação de aderência às normas (DIRAUD-Jud, IIA, Código de Ética) | Could | Pendente |

### 3.2 Regras de Negócio do Módulo

| ID | Regra | Descrição | Gatilho | Ação |
|----|-------|-----------|---------|------|
| RN-QLD-001 | Obrigatoriedade do PQAUD | Toda unidade de auditoria deve manter programa de qualidade (art. 62) | — | Estrutura mínima obrigatória |
| RN-QLD-002 | Homologação do controle de qualidade | Auditor-Chefe assegura que padrões foram seguidos (art. 68) | Fechamento de ciclo | Assinatura de homologação |
| RN-QLD-003 | Avaliações recíprocas | Avaliações entre 3+ unidades são consideradas independentes (art. 67, §3º) | Registro de avaliação externa | Validação da independência |

---

## 4. MODELO DE DADOS DO MÓDULO

### 4.1 Entidades Principais

#### AvaliacaoQualidade
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `tipo` | Enum | Sim | MONITORAMENTO_CONTINUO, AUTOAVALIACAO, EXTERNA | — |
| `periodo_inicio` | Date | Sim | Início do período avaliado | — |
| `periodo_fim` | Date | Sim | Fim do período avaliado | — |
| `avaliador_ids` | JSON | Não | IDs dos avaliadores | — |
| `resultado` | Text | Sim | Resultado consolidado | — |
| `nota` | Decimal | Não | Nota da avaliação | 0-10 |
| `status` | Enum | Sim | RASCUNHO, CONCLUIDA, HOMOLOGADA | — |
| `created_at` | DateTime | Sim | Data de criação | Auto |

#### NaoConformidade
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `avaliacao_id` | UUID | Sim | Avaliação que identificou | FK → AvaliacaoQualidade |
| `descricao` | Text | Sim | Descrição da não conformidade | — |
| `norma_referencia` | String | Sim | Norma violada (ex: DIRAUD-Jud art. XX) | — |
| `severidade` | Enum | Sim | BAIXA, MEDIA, ALTA, CRITICA | — |
| `acao_corretiva` | Text | Não | Plano de ação corretiva | — |
| `prazo` | Date | Não | Prazo para correção | — |
| `status` | Enum | Sim | ABERTA, EM_CORRECAO, CORRIGIDA | — |

#### IndicadorQualidade
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `nome` | String | Sim | Nome do indicador | — |
| `descricao` | String | Sim | Descrição e fórmula | — |
| `periodo` | String | Sim | Periodicidade (MENSAL, TRIMESTRAL, ANUAL) | — |
| `meta` | Decimal | Sim | Valor alvo | — |
| `valor_atual` | Decimal | Não | Último valor apurado | — |
| `updated_at` | DateTime | Sim | Data de atualização | Auto |

---

## 5. INTERFACES E INTERAÇÕES

### 5.1 APIs do Módulo

| Método | Endpoint | Descrição | Perfis Autorizados |
|--------|----------|-----------|---------------------|
| GET | `/api/v1/avaliacoes-qualidade` | Listar avaliações | Auditor-Chefe |
| POST | `/api/v1/avaliacoes-qualidade` | Criar avaliação | Auditor-Chefe |
| GET | `/api/v1/nao-conformidades` | Listar não conformidades | Auditor-Chefe |
| POST | `/api/v1/nao-conformidades/{id}/acao-corretiva` | Registrar ação corretiva | Auditor-Chefe |
| GET | `/api/v1/indicadores-qualidade` | Listar indicadores | Auditor, Auditor-Chefe |

---

## 6. DEFINIÇÃO DE PRONTO (DoD) DO MÓDULO

- [ ] Todos os RFs implementados e testados
- [ ] Cobertura de testes ≥ 80% (unitários), ≥ 70% (integração)
- [ ] Dashboard de indicadores funcionando
- [ ] Documentação de API atualizada
- [ ] PR revisado e aprovado

---

## 7. CONTROLE DE VERSÃO

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 16/06/2026 | IA | Versão inicial |
