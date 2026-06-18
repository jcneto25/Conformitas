# CONFORMITAS (SGI)
## MOD-RIS-001 — Gestão de Riscos da AUDIN

**Versão:** 1.0 | **Data:** 16/06/2026 | **Autor:** Gerado por IA | **Status:** Rascunho

---

## 1. IDENTIFICAÇÃO DO MÓDULO

| Campo | Valor |
|-------|-------|
| **ID do Módulo** | MOD-RIS-001 |
| **Nome do Módulo** | Gestão de Riscos da AUDIN |
| **Domínio Funcional** | Gestão de Riscos |
| **Prioridade** | Should |
| **Complexidade** | Média |
| **Onda de Implementação** | 2 |
| **Dependências** | MOD-PLN-001 |
| **Estimativa (homem-dia)** | 10 dias |

---

## 2. OBJETIVO E CONTEXTO

### 2.1 Propósito do Módulo
Gerencia o processo de gestão de riscos da própria unidade de auditoria interna, conforme o Manual de Gestão de Riscos da AUDIN (2020), baseado na ISO 31000 e no COSO. Cobre o ciclo completo: estabelecimento de contexto, identificação, análise, avaliação, tratamento, comunicação e monitoramento de riscos. Alimenta o planejamento de auditorias com a matriz de riscos.

### 2.2 Escopo do Módulo
- Estabelecimento de contexto organizacional
- Identificação de riscos (internos e externos)
- Análise de riscos (probabilidade × impacto)
- Matriz de riscos com níveis (Baixo, Médio, Alto, Crítico)
- Avaliação e priorização de riscos
- Tratamento de riscos (evitar, mitigar, transferir, aceitar)
- Comunicação e monitoramento contínuo
- Melhoria contínua do processo

---

## 3. REQUISITOS FUNCIONAIS

| ID | Funcionalidade | Descrição | Prioridade |
|----|---------------|-----------|------------|
| RF-RIS-001 | Cadastro de Contexto | Registrar contexto organizacional e critérios de risco | Should |
| RF-RIS-002 | Identificação de Riscos | Registrar riscos com causa, evento e consequência | Should |
| RF-RIS-003 | Análise de Riscos | Atribuir probabilidade, impacto e calcular nível | Should |
| RF-RIS-004 | Matriz de Riscos | Visualizar matriz probabilidade × impacto | Should |
| RF-RIS-005 | Tratamento de Riscos | Registrar estratégia de resposta e plano de ação | Should |
| RF-RIS-006 | Monitoramento de Riscos | Revisão periódica e atualização de status | Could |

---

## 4. MODELO DE DADOS DO MÓDULO

#### Risco
| Campo | Tipo | Obrigatório | Descrição | Restrições |
|-------|------|-------------|-----------|------------|
| `id` | UUID | Sim | Identificador único | PK |
| `codigo` | String | Sim | Código (RISCO-001) | Unique |
| `descricao` | Text | Sim | Descrição do risco | — |
| `categoria` | Enum | Sim | ESTRATEGICO, OPERACIONAL, FINANCEIRO, COMPLIANCE, REPUTACIONAL | — |
| `causa` | Text | Sim | Causa raiz | — |
| `evento` | Text | Sim | Evento de risco | — |
| `consequencia` | Text | Sim | Consequência potencial | — |
| `probabilidade` | Integer | Sim | Nota de 1 a 5 | 1-5 |
| `impacto` | Integer | Sim | Nota de 1 a 5 | 1-5 |
| `nivel` | Enum | Não | BAIXO, MEDIO, ALTO, CRITICO (calculado) | — |
| `estrategia` | Enum | Não | EVITAR, MITIGAR, TRANSFERIR, ACEITAR | — |
| `plano_acao` | Text | Não | Plano de tratamento | — |
| `status` | Enum | Sim | ATIVO, EM_TRATAMENTO, ENCERRADO | — |
| `data_revisao` | Date | Não | Próxima data de revisão | — |

---

## 5. DEFINIÇÃO DE PRONTO (DoD)

- [ ] Todos os RFs implementados e testados
- [ ] Matriz de riscos visual funcional
- [ ] Cobertura de testes ≥ 80%
- [ ] PR revisado e aprovado

---

## 6. CONTROLE DE VERSÃO

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 16/06/2026 | IA | Versão inicial |
