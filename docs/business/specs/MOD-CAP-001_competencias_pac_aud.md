# CONFORMITAS (SGI)
## MOD-CAP-001 — Competências e PAC-Aud

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-CAP-001 |
| **Nome do Módulo** | Competências e Plano Anual de Capacitação (PAC-Aud) |
| **Domínio Funcional** | Competências e Capacitação |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 3 |
| **Dependências** | MOD-PLN-001, MOD-ADM-001 |
| **Estimativa (homem-dia)** | 8 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia o Plano Anual de Capacitação de Auditoria (PAC-Aud), exigido pela DIRAUD-Jud (CNJ 309/2020, Capítulo X, arts. 69-73). Suporta mapeamento de competências, identificação de lacunas de conhecimento, gestão de treinamentos e certificações. Metas: mínimo 40 horas anuais de capacitação por servidor (art. 72).

### 2.2 Escopo do Módulo
- Mapeamento de competências técnicas e gerenciais
- Identificação de lacunas de conhecimento (por auditor)
- Elaboração do PAC-Aud vinculado ao PAA
- Registro de capacitações realizadas (cursos, certificações, eventos)
- Controle de horas de capacitação por auditor
- Disseminação interna de conhecimento
- Preferência por instituições de reconhecimento internacional (art. 71)

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-CAP-001 | Mapa de Competências | Registrar competências requeridas por área de auditoria | Should |
| RF-CAP-002 | Lacunas de Conhecimento | Identificar gaps entre competências requeridas e existentes | Should |
| RF-CAP-003 | Elaboração do PAC-Aud | Planejar capacitações para cobrir lacunas | Should |
| RF-CAP-004 | Registro de Capacitações | Registrar cursos, certificações e eventos por auditor | Should |
| RF-CAP-005 | Controle de Horas | Totalizar horas de capacitação por auditor/ano | Should |
| RF-CAP-006 | Disseminação de Conhecimento | Registrar repasses internos de conhecimento (art. 73) | Could |

---

## 4. REGRAS DE NEGÓCIO

| ID | Regra | Descrição |
|----|-------|-----------|
| RN-CAP-001 | Mínimo 40h/ano | Meta de 40h anuais por servidor (art. 72, DIRAUD-Jud) |
| RN-CAP-002 | Vinculação PAC-Aud × PAA | PAC-Aud deve ser submetido após aprovação do PAA (art. 70) |
| RN-CAP-003 | Auditor sem capacitação | Auditor sem capacidade técnica para trabalho específico não participa da auditoria (art. 70, §2º) |

---

## 5. MODELO DE DADOS DO MÓDULO

#### Competencia
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único PK |
| `nome` | String | Sim | Nome da competência |
| `tipo` | Enum | Sim | TECNICA, GERENCIAL |
| `area_auditoria` | String | Sim | Área relacionada |

#### Capacitacao
| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `id` | UUID | Sim | Identificador único PK |
| `titulo` | String | Sim | Título do curso/evento |
| `instituicao` | String | Sim | Instituição ministrante |
| `carga_horaria` | Integer | Sim | Carga horária |
| `tipo` | Enum | Sim | CURSO, CERTIFICACAO, SEMINARIO, WORKSHOP |
| `data_inicio` | Date | Sim | Data de início |
| `data_fim` | Date | Sim | Data de conclusão |
| `participante_ids` | JSON | Sim | Auditores participantes |
| `certificado_path` | String | Não | Arquivo do certificado |
| `competencias_cobertas` | JSON | Não | Competências associadas |

---

## 6. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Controle de horas com alerta da meta de 40h/ano
- [ ] Cobertura de testes ≥ 80%
- [ ] PR revisado e aprovado
