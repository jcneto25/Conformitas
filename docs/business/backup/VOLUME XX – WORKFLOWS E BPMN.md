# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA CONFORMITAS

## VOLUME XX – WORKFLOWS E BPMN

### Versão 3.0

---

# 1. Objetivo

Este volume consolida todos os workflows, máquinas de estado e transições do CONFORMITAS, definindo explicitamente os estados possíveis de cada entidade, as transições permitidas, as condições de guarda, as ações associadas e os responsáveis por cada evento.

---

# 2. Convenções

| Elemento | Descrição |
|----------|-----------|
| **Estado** | Situação estável de uma entidade em seu ciclo de vida |
| **Transição** | Mudança de estado provocada por um evento |
| **Guarda** | Condição que deve ser verdadeira para a transição ocorrer |
| **Ação** | Efeito colateral disparado pela transição (log, alerta, cálculo) |
| **Responsável** | Perfil que pode disparar a transição |

---

# 3. Workflows Principais

---

## 3.1 WF-001: Ciclo de Vida do PALP

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| PALP-01 | Rascunho | Elaboração inicial do plano quadrienal |
| PALP-02 | Em Revisão Técnica | Revisão metodológica pela equipe AUDIN |
| PALP-03 | Em Aprovação AUDIN | Aprovação pelo Secretário/Coordenador |
| PALP-04 | Em Aprovação Presidência | Aprovação pela Presidência do Tribunal |
| PALP-05 | Publicado | Plano publicado e vigente |
| PALP-06 | Arquivado | Plano encerrado ao fim do período |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Rascunho | Submeter à revisão | Em Revisão Técnica | Ao menos 1 auditoria proposta | Notificar revisores | Auditor Líder / Coordenador |
| Em Revisão Técnica | Aprovar revisão | Em Aprovação AUDIN | Revisão registrada | Log de aprovação | Supervisor |
| Em Revisão Técnica | Rejeitar revisão | Rascunho | Justificativa obrigatória | Notificar autor, registrar justificativa | Supervisor |
| Em Aprovação AUDIN | Aprovar | Em Aprovação Presidência | Aprovação registrada | Log, notificar Presidência | Secretário |
| Em Aprovação AUDIN | Rejeitar | Rascunho | Justificativa obrigatória | Notificar autor | Secretário |
| Em Aprovação Presidência | Aprovar | Publicado | Aprovação registrada | Publicar, log, notificar stakeholders | Presidência |
| Em Aprovação Presidência | Rejeitar | Rascunho | Justificativa obrigatória | Notificar AUDIN | Presidência |
| Publicado | Arquivar | Arquivado | Fim do período quadrienal | Log, calcular indicadores de cobertura | Sistema |

### Diagrama

```
[Rascunho] → Submeter → [Em Revisão Técnica] → Aprovar → [Em Aprovação AUDIN]
                ↑              ↓ Rejeitar               ↑            ↓ Aprovar
                └──────────────┘                         │   [Em Aprovação Presidência]
                ↑                                       │            ↓ Aprovar
                └───────────────────────────────────────┘     [Publicado] → Arquivar → [Arquivado]
```

---

## 3.2 WF-002: Ciclo de Vida do PAA

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| PAA-01 | Rascunho | Elaboração do plano anual |
| PAA-02 | Em Revisão Técnica | Revisão metodológica |
| PAA-03 | Em Aprovação AUDIN | Aprovação interna AUDIN |
| PAA-04 | Em Aprovação Presidência | Aprovação pela Presidência |
| PAA-05 | Publicado | Plano publicado e vigente |
| PAA-06 | Em Execução | Plano em execução no exercício |
| PAA-07 | Em Alteração Formal | Alteração formal justificada |
| PAA-08 | Arquivado | Exercício encerrado |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Rascunho | Submeter | Em Revisão Técnica | Auditorias mandatórias incluídas | Notificar revisores | Coordenador |
| Em Revisão Técnica | Aprovar | Em Aprovação AUDIN | Revisão registrada | Log | Supervisor |
| Em Revisão Técnica | Rejeitar | Rascunho | Justificativa obrigatória | Notificar | Supervisor |
| Em Aprovação AUDIN | Aprovar | Em Aprovação Presidência | — | Notificar Presidência | Secretário |
| Em Aprovação AUDIN | Rejeitar | Rascunho | Justificativa obrigatória | Notificar | Secretário |
| Em Aprovação Presidência | Aprovar | Publicado | — | Publicar, notificar | Presidência |
| Em Aprovação Presidência | Rejeitar | Rascunho | Justificativa obrigatória | Notificar | Presidência |
| Publicado | Iniciar exercício | Em Execução | Exercício iniciado | Log, iniciar cronogramas | Sistema |
| Em Execução | Solicitar alteração | Em Alteração Formal | — | Notificar aprovadores | Coordenador |
| Em Alteração Formal | Aprovar alteração | Em Execução | Justificativa formal registrada, versionamento | Log, versionar, notificar | Secretário |
| Em Alteração Formal | Rejeitar alteração | Em Execução | — | Notificar solicitante | Secretário |
| Em Execução | Encerrar exercício | Arquivado | Todas as auditorias encerradas ou justificadas | Calcular indicadores, log | Sistema |

---

## 3.3 WF-003: Ciclo de Vida da Auditoria

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| AUD-01 | Planejada | Auditoria incluída no PAA |
| AUD-02 | Em Planejamento Específico | Elaboração do planejamento detalhado |
| AUD-03 | Planejamento Aprovado | Planejamento específico aprovado |
| AUD-04 | Em Execução | Trabalho de campo em andamento |
| AUD-05 | Em Encerramento | Checklist de encerramento em andamento |
| AUD-06 | Encerrada | Execução finalizada |
| AUD-07 | Arquivada | Arquivo definitivo |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Planejada | Iniciar planejamento | Em Planejamento Específico | Equipe designada, independência declarada | Notificar equipe | Coordenador |
| Em Planejamento Específico | Aprovar planejamento | Planejamento Aprovado | Programa definido, matriz de planejamento preenchida | Log | Supervisor |
| Em Planejamento Específico | Rejeitar planejamento | Em Planejamento Específico | Justificativa obrigatória | Notificar Auditor Líder | Supervisor |
| Planejamento Aprovado | Iniciar execução | Em Execução | — | Log, iniciar cronograma | Auditor Líder |
| Em Execução | Solicitar encerramento | Em Encerramento | Todos os procedimentos executados | Verificar checklist | Auditor Líder |
| Em Encerramento | Confirmar encerramento | Encerrada | Checklist completo, evidências vinculadas, supervisão registrada | Log, calcular indicadores | Supervisor |
| Em Encerramento | Rejeitar encerramento | Em Execução | Justificativa obrigatória | Notificar equipe | Supervisor |
| Encerrada | Arquivar | Arquivada | Relatório publicado | Log | Sistema |

---

## 3.4 WF-004: Papel de Trabalho

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| PT-01 | Em Elaboração | Redação pelo auditor |
| PT-02 | Em Revisão | Revisão pelo supervisor |
| PT-03 | Aprovado | Revisão concluída |
| PT-04 | Rejeitado | Necessita correção |
| PT-05 | Arquivado | Arquivo definitivo |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Em Elaboração | Submeter à revisão | Em Revisão | Conteúdo preenchido | Notificar revisor | Auditor |
| Em Revisão | Aprovar | Aprovado | Revisor ≠ autor (RN-SEG-005) | Log, versionar | Supervisor |
| Em Revisão | Rejeitar | Rejeitado | Justificativa obrigatória | Notificar autor, registrar | Supervisor |
| Rejeitado | Corrigir e ressubmeter | Em Elaboração | — | Notificar revisor | Auditor |
| Aprovado | Arquivar | Arquivado | Auditoria encerrada | Log | Sistema |

---

## 3.5 WF-005: Achado de Auditoria

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| ACH-01 | Identificado | Achado registrado pelo auditor |
| ACH-02 | Em Análise | Validação da completude metodológica |
| ACH-03 | Validado | Critério, condição, causa, efeito, risco e evidência preenchidos |
| ACH-04 | Em Contraditório | Enviado à unidade auditada |
| ACH-05 | Manifestação Recebida | Unidade auditada apresentou manifestação |
| ACH-06 | Consolidado | Análise da manifestação concluída |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Identificado | Submeter à análise | Em Análise | — | Notificar supervisor | Auditor |
| Em Análise | Validar | Validado | Critério + condição + causa + efeito + risco + evidência preenchidos (RN-ACH-001) | Log | Supervisor |
| Em Análise | Devolver | Identificado | Justificativa obrigatória | Notificar auditor | Supervisor |
| Validado | Enviar ao contraditório | Em Contraditório | — | Notificar unidade auditada, iniciar prazo | Auditor Líder |
| Em Contraditório | Receber manifestação | Manifestação Recebida | Dentro do prazo ou prazo expirado | Notificar AUDIN, registrar data | Sistema / Unidade Auditada |
| Manifestação Recebida | Consolidar achado | Consolidado | Análise da manifestação registrada (RN-ACH-010) | Log, atualizar quadro de resultados | Auditor Líder |
| Validado | Dispensar contraditório | Consolidado | Exceção formalmente justificada (RN-ACH-009) | Registrar justificativa, log | Auditor Líder + Supervisor |

---

## 3.6 WF-006: Relatório de Auditoria

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| REL-01 | Rascunho | Elaboração do relatório |
| REL-02 | Em Revisão Técnica | Revisão metodológica |
| REL-03 | Em Supervisão | Revisão pelo supervisor |
| REL-04 | Em Aprovação AUDIN | Aprovação pelo Secretário/Coordenador |
| REL-05 | Ciência da Unidade | Unidade auditada toma ciência |
| REL-06 | Publicado | Relatório publicado conforme classificação |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Rascunho | Submeter à revisão | Em Revisão Técnica | Achados consolidados | Notificar revisor | Auditor Líder |
| Em Revisão Técnica | Aprovar | Em Supervisão | — | Log | Revisor de Qualidade |
| Em Revisão Técnica | Rejeitar | Rascunho | Justificativa obrigatória | Notificar autor | Revisor de Qualidade |
| Em Supervisão | Aprovar | Em Aprovação AUDIN | — | Log | Supervisor |
| Em Supervisão | Rejeitar | Rascunho | Justificativa obrigatória | Notificar autor | Supervisor |
| Em Aprovação AUDIN | Aprovar | Ciência da Unidade | — | Notificar unidade auditada | Secretário / Coordenador |
| Em Aprovação AUDIN | Rejeitar | Rascunho | Justificativa obrigatória | Notificar equipe | Secretário / Coordenador |
| Ciência da Unidade | Publicar | Publicado | Classificação definida | Publicar, log, assinatura eletrônica | Secretário |
| Publicado | Retificar | Rascunho | Justificativa formal, versionamento | Versionar, notificar | Secretário |

---

## 3.7 WF-007: Recomendação em Monitoramento

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| REC-01 | Pendente | Recomendação aguardando plano de ação |
| REC-02 | Plano de Ação Registrado | Unidade registrou plano de ação |
| REC-03 | Em Implementação | Ações em execução |
| REC-04 | Implementada | Unidade declara implementação |
| REC-05 | Em Validação | AUDIN validando evidências |
| REC-06 | Validada | Implementação validada pela AUDIN |
| REC-07 | Em Avaliação de Efetividade | Verificação da efetividade |
| REC-08 | Efetiva | Efetividade comprovada |
| REC-09 | Encerrada | Ciclo completo |
| REC-10 | Reaberta | Recomendação reaberta |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Pendente | Registrar plano de ação | Plano de Ação Registrado | Plano com ações, responsáveis e prazos (RN-MON-003) | Notificar AUDIN | Unidade Auditada |
| Plano de Ação Registrado | Iniciar implementação | Em Implementação | Plano aprovado pela AUDIN | Log | Unidade Auditada |
| Em Implementação | Declarar implementação | Implementada | Evidência anexada | Notificar AUDIN | Unidade Auditada |
| Implementada | Solicitar validação | Em Validação | — | Notificar validador | Sistema |
| Em Validação | Validar implementação | Validada | Evidência suficiente e consistente (RN-MON-007) | Log | Auditor |
| Em Validação | Rejeitar implementação | Em Implementação | Justificativa obrigatória | Notificar unidade | Auditor |
| Validada | Iniciar avaliação efetividade | Em Avaliação de Efetividade | Metodologia exige (RN-MON-007) | Notificar avaliador | Sistema |
| Validada | Encerrar (sem efetividade) | Encerrada | Implementação validada | Log | Auditor Líder |
| Em Avaliação de Efetividade | Confirmar efetividade | Efetiva | Risco mitigado / controle implantado | Log, atualizar risco residual | Auditor |
| Em Avaliação de Efetividade | Negar efetividade | Em Implementação | Justificativa obrigatória | Notificar unidade | Auditor |
| Efetiva | Encerrar | Encerrada | — | Log, calcular indicadores | Auditor Líder |
| Qualquer estado ativo | Reabrir | Reaberta | Motivo: evidência insuficiente, reincidência, novo risco (RN-MON-008) | Justificativa obrigatória, notificar chefia se crítica | Auditor Líder / Supervisor |
| Reaberta | Retomar implementação | Em Implementação | — | Log, resetar status | Unidade Auditada |

---

## 3.8 WF-008: Determinação

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| DET-01 | Pendente | Determinação emitida |
| DET-02 | Notificada | Unidade auditada notificada |
| DET-03 | Em Implementação | Ações em execução |
| DET-04 | Implementada | Implementação declarada |
| DET-05 | Em Validação | AUDIN validando |
| DET-06 | Validada | Implementação confirmada |
| DET-07 | Encerrada | Ciclo completo |
| DET-08 | Reaberta | Reaberta por motivo justificado |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Pendente | Notificar | Notificada | — | Notificar unidade, dashboard executivo (RN-MON-010) | Sistema |
| Notificada | Iniciar implementação | Em Implementação | — | Log | Unidade Auditada |
| Em Implementação | Declarar implementação | Implementada | Evidência anexada | Notificar AUDIN | Unidade Auditada |
| Implementada | Solicitar validação | Em Validação | — | Notificar validador | Sistema |
| Em Validação | Validar | Validada | Evidência suficiente | Log | Auditor |
| Em Validação | Rejeitar | Em Implementação | Justificativa obrigatória | Notificar unidade | Auditor |
| Validada | Encerrar | Encerrada | — | Log, atualizar dashboards | Auditor Líder |
| Qualquer estado ativo | Reabrir | Reaberta | Justificativa obrigatória (RN-MON-008) | Notificar chefia | Auditor Líder |

---

## 3.9 WF-009: Plano de Ação

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| PLA-01 | Em Elaboração | Unidade elaborando plano |
| PLA-02 | Em Análise AUDIN | AUDIN analisando plano |
| PLA-03 | Aprovado | Plano aprovado |
| PLA-04 | Em Execução | Ações em execução |
| PLA-05 | Concluído | Todas as ações concluídas |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Em Elaboração | Submeter | Em Análise AUDIN | Ao menos 1 ação registrada | Notificar AUDIN | Unidade Auditada |
| Em Análise AUDIN | Aprovar | Aprovado | — | Log, notificar unidade | Auditor Líder |
| Em Análise AUDIN | Solicitar ajustes | Em Elaboração | Justificativa obrigatória | Notificar unidade | Auditor Líder |
| Aprovado | Iniciar execução | Em Execução | — | Log | Unidade Auditada |
| Em Execução | Concluir todas as ações | Concluído | Todas as ações com evidência | Notificar AUDIN | Unidade Auditada |

---

## 3.10 WF-010: Gestão de Riscos

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| RSK-01 | Identificado | Risco cadastrado |
| RSK-02 | Em Análise | Avaliação de probabilidade e impacto |
| RSK-03 | Avaliado | Risco inerente calculado |
| RSK-04 | Priorizado | Risco residual calculado e classificado |
| RSK-05 | Em Tratamento | Plano de tratamento definido |
| RSK-06 | Monitorado | Risco em acompanhamento contínuo |
| RSK-07 | Revisado | Reavaliação periódica |
| RSK-08 | Arquivado | Risco tratado e encerrado |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Identificado | Enviar à análise | Em Análise | Objeto auditável vinculado (RN-RSK-001) | Notificar analista | Planejador AUDIN |
| Em Análise | Concluir avaliação | Avaliado | Probabilidade e impacto preenchidos | Calcular risco inerente | Analista |
| Avaliado | Priorizar | Priorizado | Controles registrados | Calcular risco residual, gerar heatmap (RN-RSK-004) | Sistema |
| Priorizado | Definir tratamento | Em Tratamento | — | Log | Coordenador |
| Em Tratamento | Iniciar monitoramento | Monitorado | — | Agendar revisão, alertas se crítico (RN-RSK-007) | Sistema |
| Monitorado | Revisar | Revisado | — | Recalcular risco residual | Analista |
| Revisado | Manter monitoramento | Monitorado | Risco residual ainda acima do apetite | Agendar próxima revisão | Analista |
| Revisado | Encerrar | Arquivado | Risco residual dentro do apetite (RN-RSK-005) | Log, atualizar dashboards | Coordenador |

---

## 3.11 WF-011: Evidência

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| EVD-01 | Coletada | Evidência registrada no sistema |
| EVD-02 | Em Análise | Verificação de suficiência e relevância |
| EVD-03 | Validada | Evidência considerada suficiente |
| EVD-04 | Aprovada | Aprovação formal |
| EVD-05 | Arquivada | Arquivo definitivo |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Coletada | Submeter à análise | Em Análise | Arquivo ou registro vinculado | — | Auditor |
| Em Análise | Validar | Validada | Suficiente, relevante e confiável | Log | Auditor |
| Em Análise | Solicitar complementação | Coletada | Justificativa obrigatória | Notificar coletor | Supervisor |
| Validada | Aprovar | Aprovada | — | Log, bloquear edição (RN-EXE-008) | Supervisor |
| Aprovada | Arquivar | Arquivada | Auditoria encerrada | Log | Sistema |

---

## 3.12 WF-012: Declaração de Independência

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| IND-01 | Pendente | Questionário enviado ao membro da equipe |
| IND-02 | Respondida | Questionário preenchido |
| IND-03 | Aprovada | Sem conflitos identificados |
| IND-04 | Impedimento Identificado | Conflito de interesse detectado |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Pendente | Responder | Respondida | Todas as questões respondidas | Log | Membro da equipe |
| Respondida | Aprovar | Aprovada | Nenhum conflito declarado | Log | Coordenador |
| Respondida | Identificar impedimento | Impedimento Identificado | Conflito declarado | Notificar coordenador, bloquear designação (RN-EXE-004) | Sistema / Coordenador |
| Impedimento Identificado | Resolver e reaprovar | Aprovada | Conflito resolvido ou substituição realizada | Log, atualizar equipe | Coordenador |

---

## 3.13 WF-013: Solicitação de Informação

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| SI-01 | Emitida | Solicitação enviada à unidade |
| SI-02 | Respondida | Resposta recebida |
| SI-03 | Validada | Resposta considerada suficiente |
| SI-04 | Insuficiente | Resposta inadequada |
| SI-05 | Arquivada | Solicitação encerrada |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Emitida | Receber resposta | Respondida | Dentro do prazo ou prazo expirado | Notificar solicitante | Sistema / Unidade |
| Respondida | Validar | Validada | Conteúdo suficiente | Log | Auditor |
| Respondida | Marcar insuficiente | Insuficiente | Justificativa obrigatória | Notificar unidade, reiniciar prazo | Auditor |
| Insuficiente | Receber nova resposta | Respondida | — | Notificar solicitante | Unidade Auditada |
| Validada | Arquivar | Arquivada | — | Log | Sistema |

---

## 3.14 WF-014: QACI (Questionário de Avaliação de Controle Interno)

### Estados

| Código | Estado | Descrição |
|--------|--------|-----------|
| QCI-01 | Não Iniciado | Questionário criado, aguardando preenchimento |
| QCI-02 | Em Preenchimento | Respostas sendo registradas |
| QCI-03 | Concluído | Todos os blocos respondidos |
| QCI-04 | Calculado | Índice de controle interno calculado |

### Transições

| Origem | Evento | Destino | Guarda | Ações | Responsável |
|--------|--------|---------|--------|-------|-------------|
| Não Iniciado | Iniciar preenchimento | Em Preenchimento | — | Log | Planejador AUDIN |
| Em Preenchimento | Concluir | Concluído | Todos os blocos respondidos | Log | Planejador AUDIN |
| Concluído | Calcular índice | Calculado | — | Calcular Índice CI por bloco e global, classificar resultado (RN-PLN-010) | Sistema |

---

# 4. Eventos do Sistema (SYS)

| Código | Evento | Gatilho | Ações Automáticas |
|--------|--------|---------|-------------------|
| SYS-001 | Prazo de auditoria próximo | 5 dias úteis antes do vencimento | Alerta ao Auditor Líder e Supervisor |
| SYS-002 | Prazo de auditoria vencido | Data de vencimento atingida | Alerta à chefia AUDIN, destacar no dashboard |
| SYS-003 | Achado crítico registrado | Achado classificado como crítico | Alerta à chefia AUDIN (RN-ACH-012) |
| SYS-004 | Recomendação crítica vencida | Data de vencimento atingida | Alerta à chefia AUDIN (RN-MON-009) |
| SYS-005 | Determinação vencida | Data de vencimento atingida | Destacar no dashboard executivo (RN-MON-010) |
| SYS-006 | Manifestação pendente | Prazo de contraditório expirado | Alerta ao Auditor Líder |
| SYS-007 | Plano de ação pendente | Prazo para registro de plano expirado | Alerta à unidade auditada e AUDIN |
| SYS-008 | Validação pendente | Implementação declarada sem validação em X dias | Alerta ao validador designado |
| SYS-009 | Risco crítico identificado | Risco classificado como crítico | Alerta à chefia AUDIN (RN-RSK-007) |
| SYS-010 | Risco sem controle | Risco sem controle associado | Destacar no dashboard (RN-RSK-008) |
| SYS-011 | Risco emergente sem cobertura | Risco emergente sem auditoria planejada | Alerta ao planejador (RN-RSK-006) |
| SYS-012 | Reincidência detectada | Achado com reincidência identificada | Destacar no quadro de resultados (RN-ACH-013) |
| SYS-013 | Exercício do universo auditável vencido | Ano sem revisão do universo auditável | Alerta ao planejador (RN-CAD-001) |
| SYS-014 | Capacidade operacional excedida | PAA proposto excede capacidade | Bloquear aprovação (RN-PLN-001) |
| SYS-015 | Auditoria mandatória não incluída | PAA sem auditoria mandatória obrigatória | Alerta ao planejador (RN-PLN-003) |
| SYS-016 | Encerramento sem checklist | Tentativa de encerrar auditoria sem checklist completo | Bloquear encerramento (RN-EXE-010) |

---

# 5. Matriz de Alertas e Notificações

| Evento | Destinatários | Canal |
|--------|--------------|-------|
| SYS-001 | Auditor Líder, Supervisor | Sistema + E-mail |
| SYS-002 | Coordenador, Secretário | Sistema + E-mail |
| SYS-003 | Secretário, Coordenador | Sistema + E-mail + Dashboard |
| SYS-004 | Secretário, Coordenador | Sistema + E-mail + Dashboard |
| SYS-005 | Presidência, Secretário | Dashboard executivo |
| SYS-006 | Auditor Líder | Sistema + E-mail |
| SYS-007 | Unidade Auditada, Coordenador | Sistema + E-mail |
| SYS-008 | Auditor designado | Sistema |
| SYS-009 | Secretário, Comitê de Riscos | Sistema + E-mail + Dashboard |
| SYS-010 | Planejador AUDIN | Dashboard |
| SYS-011 | Coordenador | Sistema + E-mail |
| SYS-012 | Auditor Líder, Supervisor | Sistema + Dashboard |
| SYS-013 | Planejador AUDIN | Sistema |
| SYS-014 | Coordenador | Sistema (bloqueio) |
| SYS-015 | Planejador AUDIN | Sistema (alerta) |
| SYS-016 | Auditor Líder | Sistema (bloqueio) |

---

# 6. Regras Cross-Workflow

## 6.1 Segregação de Funções

- Nenhuma transição de aprovação pode ser executada pelo mesmo usuário que criou o objeto (aplica-se a PT, REL, PLA, PAA, PALP)
- Validação de implementação não pode ser feita pelo mesmo auditor que registrou o achado
- Revisão técnica não pode ser feita pelo autor do documento

## 6.2 Integridade e Imutabilidade

- Toda transição gera log auditável com: timestamp, usuário, IP, estado anterior, estado posterior
- Estados finais (Arquivado, Encerrado, Publicado) são imutáveis — não admitem transição de volta, exceto via fluxo explícito de reabertura (REC-10, DET-08)
- Evidências aprovadas nunca retornam ao estado de elaboração

## 6.3 Dependências entre Workflows

- WF-003 (Auditoria) não pode iniciar execução (AUD-04) sem WF-012 (Independência) aprovada (IND-03)
- WF-006 (Relatório) não pode iniciar (REL-01) sem ao menos 1 achado consolidado (ACH-06)
- WF-007 (Recomendação) só é criada após achado consolidado (ACH-06)
- WF-002 (PAA) não pode ser publicado sem WF-010 (Risco) ter riscos priorizados (RSK-04)
- WF-009 (Plano de Ação) só é criado após recomendação com status Pendente (REC-01)

## 6.4 Alertas Obrigatórios

- Toda transição que resulte em estado vencido, crítico ou pendente gera notificação ao responsável e, quando aplicável, à chefia da AUDIN
- Alertas críticos são escalating: se não tratados em 48h, escalam para o nível hierárquico superior
