# CONFORMITAS (SGI)
## MOD-CON-001 — Consultorias e Assessoramento

**Versão:** 1.0
**Data:** 16/06/2026
**Autor:** Gerado por IA
**Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-CON-001 |
| **Nome do Módulo** | Consultorias e Assessoramento |
| **Domínio Funcional** | Consultorias e Assessoramento |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 3 |
| **Dependências** | MOD-PLN-001, MOD-ADM-001 |
| **Estimativa (homem-dia)** | 8 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia os serviços de consultoria e assessoramento prestados pela AUDIN às demais unidades do TJCE, conforme a DIRAUD-Jud (CNJ 309/2020, Capítulo VIII, arts. 58-61). Abrange assessoramento técnico, aconselhamento, treinamento e capacitação. O módulo garante que as consultorias não configurem atos de cogestão e que sua aceitação seja compatível com o PAA.

### 2.2 Alinhamento Estratégico
- **Objetivo Estratégico relacionado:** OE-01 — Padronizar o fluxo completo de auditoria
- **Macroprocesso atendido:** Consultorias e Assessoramento
- **Capacidade de negócio viabilizada:** Comunicação Estruturada com Unidades

### 2.3 Escopo do Módulo

#### Dentro do Escopo
- Registro de solicitações de consultoria por unidades do TJCE
- Análise de aceitação pelo Auditor-Chefe
- Assessoramento em áreas específicas (orçamentária, patrimonial, licitações, controles internos)
- Treinamentos e capacitações ministrados pela AUDIN
- Acordo prévio de escopo e natureza do serviço
- Registro de horas e resultados

#### Fora do Escopo
- Capacitação dos próprios auditores (MOD-CAP-001)
- Atividades que configurem cogestão (vedadas por lei)

---

## 3. REQUISITOS FUNCIONAIS

### 3.1 Lista de Funcionalidades

| ID | Funcionalidade | Descrição | Prioridade | Status |
|----|---------------|-----------|------------|--------|
| RF-CON-001 | Solicitação de Consultoria | Unidade registra pedido de consultoria com dúvida fundamentada | Should | Pendente |
| RF-CON-002 | Análise de Aceitação | Auditor-Chefe avalia compatibilidade com PAA e carga horária | Should | Pendente |
| RF-CON-003 | Registro de Consultoria | Documentar serviço prestado, escopo, horas e resultados | Should | Pendente |
| RF-CON-004 | Catálogo de Consultorias | Histórico de consultorias realizadas por tema e unidade | Could | Pendente |
| RF-CON-005 | Treinamentos Ministrados | Registrar capacitações oferecidas pela AUDIN a outras unidades | Could | Pendente |

### 3.2 Regras de Negócio do Módulo

| ID | Regra | Descrição | Gatilho | Ação |
|----|-------|-----------|---------|------|
| RN-CON-001 | Vedação à cogestão | Auditor não pode praticar ato de gestão na consultoria (art. 58, I, DIRAUD-Jud) | Registro de consultoria | Termo de ciência obrigatório |
| RN-CON-002 | Compatibilidade com PAA | Aceitação de consultoria não pode prejudicar auditorias previstas (art. 38, IV) | Análise de aceitação | Verificação de horas disponíveis |
| RN-CON-003 | Escopo pré-acordado | Natureza e escopo devem ser acordados previamente (art. 58, I) | Início da consultoria | Registro de termo de acordo |

---

## 4. MODELO DE DADOS DO MÓDULO

### 4.1 Entidades Principais

#### SolicitacaoConsultoria
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `unidade_solicitante` | String | Sim | Unidade que solicita | — |
| `tema` | Enum | Sim | ORCAMENTARIA, PATRIMONIAL, LICITACAO, CONTROLE_INTERNO, OUTRO | — |
| `duvida` | Text | Sim | Descrição da dúvida/necessidade | — |
| `fundamentacao` | Text | Sim | Legislação aplicável | — |
| `status` | Enum | Sim | PENDENTE, ACEITA, RECUSADA, CONCLUIDA | — |
| `solicitante_id` | UUID | Sim | Quem solicitou | FK → Usuario |
| `created_at` | DateTime | Sim | Data de criação | Auto |

#### Consultoria
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `solicitacao_id` | UUID | Não | Origem da solicitação | FK → SolicitacaoConsultoria |
| `tipo` | Enum | Sim | ASSESSORAMENTO, TREINAMENTO, ACONSELHAMENTO | — |
| `escopo` | Text | Sim | Escopo acordado | — |
| `horas_utilizadas` | Integer | Sim | Horas consumidas | — |
| `resultado` | Text | Sim | Resultado ou orientação emitida | — |
| `equipe_ids` | JSON | Sim | Auditores envolvidos | — |
| `plano_id` | UUID | Sim | PAA do ano | FK → PlanoAuditoria |
| `created_at` | DateTime | Sim | Data de criação | Auto |

---

## 5. INTERFACES E INTERAÇÕES

### 5.1 APIs do Módulo

| Método | Endpoint | Descrição | Perfis Autorizados |
|--------|----------|-----------|---------------------|
| GET | `/api/v1/solicitacoes-consultoria` | Listar solicitações | Auditor-Chefe |
| POST | `/api/v1/solicitacoes-consultoria` | Criar solicitação | Gestor Unidade |
| POST | `/api/v1/solicitacoes-consultoria/{id}/aceitar` | Aceitar consultoria | Auditor-Chefe |
| GET | `/api/v1/consultorias` | Listar consultorias | Auditor, Auditor-Chefe |
| POST | `/api/v1/consultorias` | Registrar consultoria | Auditor |

### 5.2 Telas e Componentes de UI

| Tela / Componente | Descrição | Perfis com Acesso |
|--------------------|-----------|--------------------|
| `SolicitacaoConsultoriaForm` | Formulário para unidade solicitar consultoria | Gestor Unidade |
| `ConsultoriaList` | Lista de consultorias com filtros | Auditor-Chefe |
| `ConsultoriaDetail` | Detalhes e resultado da consultoria | Auditor, Gestor Unidade |

---

## 6. DEFINIÇÃO DE PRONTO (DoD) DO MÓDULO

- [ ] Todos os RFs implementados e testados
- [ ] Cobertura de testes ≥ 80% (unitários), ≥ 70% (integração)
- [ ] Validação de vedação à cogestão
- [ ] Documentação de API atualizada
- [ ] PR revisado e aprovado

---

## 7. CONTROLE DE VERSÃO

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 16/06/2026 | IA | Versão inicial |
