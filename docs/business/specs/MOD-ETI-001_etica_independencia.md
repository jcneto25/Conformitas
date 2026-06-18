# CONFORMITAS (SGI)
## MOD-ETI-001 — Ética e Independência

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-ETI-001 |
| **Nome do Módulo** | Ética, Independência e Impedimentos |
| **Domínio Funcional** | Ética e Independência |
| **Prioridade** | Must |
| **Complexidade** | Baixa |
| **Onda de Implementação** | 1 |
| **Dependências** | MOD-ADM-001 |
| **Estimativa (homem-dia)** | 5 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia a conformidade ética da atividade de auditoria, conforme a DIRAUD-Jud (CNJ 309/2020, Capítulo II, arts. 3-15). Controla declarações de independência, impedimentos, conflitos de interesses e termos de confidencialidade dos auditores. Garante que a AUDIN opere segundo os princípios éticos de integridade, proficiência, autonomia técnica e objetividade.

### 2.2 Escopo do Módulo
- Código de Ética da AUDIN (acessível no sistema)
- Declaração anual de independência por auditor
- Registro de impedimentos e suspeições
- Controle de conflitos de interesses
- Termo de confidencialidade para novos integrantes (art. 77, § único)
- Vedações legais (auditar operações dos últimos 12 meses, art. 15)

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-ETI-001 | Declaração de Independência | Registro anual de declaração de independência por auditor | Must |
| RF-ETI-002 | Registro de Impedimentos | Auditor declara impedimento para auditoria específica | Must |
| RF-ETI-003 | Controle de Conflitos | Verificar conflitos antes da designação de equipe | Should |
| RF-ETI-004 | Termo de Confidencialidade | Registro de aceite do termo por novos integrantes | Must |
| RF-ETI-005 | Código de Ética | Disponibilizar e versionar o Código de Ética | Should |

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-ETI-001 | Impedimento 12 meses | Auditor não pode auditar operações com as quais esteve envolvido nos últimos 12 meses (art. 15) |
| RN-ETI-002 | Designação vedada | Pessoas condenadas/irregulares não podem ocupar cargo na auditoria (art. 7º, CNJ 308) |
| RN-ETI-003 | Confidencialidade obrigatória | Todo integrante deve firmar termo de confidencialidade antes de atuar (art. 77) |

---

## 5. MODELO DE DADOS DO MÓDULO

#### DeclaracaoIndependencia
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `usuario_id` | UUID | Sim | Auditor FK → Usuario |
| `ano` | Integer | Sim | Ano da declaração |
| `declaracao` | Text | Sim | Texto da declaração |
| `data_assinatura` | Date | Sim | Data de assinatura |

#### Impedimento
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | PK |
| `usuario_id` | UUID | Sim | Auditor impedido |
| `auditoria_id` | UUID | Sim | Auditoria da qual se declara impedido |
| `motivo` | Text | Sim | Motivo do impedimento |
| `status` | Enum | Sim | PENDENTE, ACEITO |

---

## 6. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Validação automática de conflitos ao designar equipe
- [ ] Cobertura de testes ≥ 80%
- [ ] PR revisado e aprovado
