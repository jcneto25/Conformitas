# CONFORMITAS (SGI)
## MOD-GOV-001 — Governança, Transparência e Fraudes

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-GOV-001 |
| **Nome do Módulo** | Governança, Transparência e Fraudes |
| **Domínio Funcional** | Governança e Transparência |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 3 |
| **Dependências** | MOD-REL-001 |
| **Estimativa (homem-dia)** | 8 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia os aspectos de governança, transparência ativa e prevenção/identificação de fraudes no âmbito da AUDIN. Suporta o reporte ao órgão colegiado, a publicação de relatórios na internet, a comunicação com órgãos de controle externo (TCE, CNJ), e o tratamento de riscos de fraude identificados durante as auditorias.

### 2.2 Escopo do Módulo
- Relatório Anual de Atividades ao órgão colegiado
- Publicação de relatórios no portal de transparência
- Comunicação com ouvidorias (canal de denúncias)
- Registro e acompanhamento de determinações do CNJ e TCE
- Identificação e reporte de riscos de fraude
- Tratamento de denúncias e reclamações

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-GOV-001 | Publicação de Relatórios | Gerenciar publicação de relatórios no portal (art. 5º, §3º, CNJ 308) | Should |
| RF-GOV-002 | Canal Ouvidoria | Integração com informações de ouvidoria para planejamento (art. 34, §3º DIRAUD-Jud) | Should |
| RF-GOV-003 | Acompanhamento TCE/CNJ | Registrar determinações e recomendações de órgãos externos | Should |
| RF-GOV-004 | Registro de Fraudes | Documentar indícios de fraude identificados em auditoria | Should |
| RF-GOV-005 | Comunicação de Fraudes | Comunicar ao superior hierárquico e, se necessário, ao TCE (art. 13, DIRAUD-Jud) | Should |

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-GOV-001 | Prazo de publicação | Relatório anual publicado em até 30 dias após deliberação (art. 5º, §3º, CNJ 308) |
| RN-GOV-002 | Comunicação de fraude | Primeiro ao superior hierárquico; após 60 dias sem resposta, ao TCE (art. 13) |
| RN-GOV-003 | Tempestividade do relatório anual | Enviar até final de julho (art. 5º, §1º, CNJ 308) |

---

## 5. MODELO DE DADOS DO MÓDULO

#### DeterminacaoExterna
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `orgao` | Enum | Sim | CNJ, TCE, OUTRO |
| `numero` | String | Sim | Número do processo/determinação |
| `descricao` | Text | Sim | Descrição |
| `data_recebimento` | Date | Sim | Data de recebimento |
| `prazo_resposta` | Date | Sim | Prazo para resposta |
| `status` | Enum | Sim | PENDENTE, RESPONDIDA, ARQUIVADA |

#### RegistroFraude
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `auditoria_id` | UUID | Não | Auditoria onde foi identificada |
| `descricao` | Text | Sim | Descrição do indício |
| `classificacao` | Enum | Sim | SUSPEITA, CONFIRMADA, DESCARTADA |
| `data_comunicacao_superior` | Date | Não | Data da comunicação |
| `data_comunicacao_tce` | Date | Não | Data da comunicação ao TCE |

---

## 6. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Workflow de comunicação de fraudes com contagem de prazos
- [ ] Cobertura de testes ≥ 80%
- [ ] PR revisado e aprovado
