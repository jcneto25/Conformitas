# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA CONFORMITAS 3.0

## VOLUME XVIII – REGRAS DE NEGÓCIO

### Versão 3.0

---

# 1. Objetivo

Este volume consolida todas as regras de negócio do CONFORMITAS 3.0, extraídas dos PRDs, especificações formais e volumes funcionais. Cada regra possui identificador único, descrição, criticidade, origem documental e entidades afetadas.

---

# 2. Convenções

| Campo | Descrição |
|-------|-----------|
| **ID** | Identificador único (RN-[DOMÍNIO]-[NUM]) |
| **Descrição** | Enunciado da regra em linguagem formal |
| **Criticidade** | Alta (impeditiva / bloqueante) ou Média (relevante / validável) |
| **Origem** | Documento(s) de origem da regra |
| **Entidades** | Entidades do modelo de dados afetadas |

---

# 3. Regras de Segurança e Acesso (RN-SEG)

## 3.1 Autenticação e Autorização

**RN-SEG-001.** O sistema deverá suportar autenticação via LDAP/AD e SSO institucional, com login local apenas para contingência. **Criticidade: Alta. Origem: PRD §2, RF-ADM-001. Entidades: Usuario, ConfiguracaoAutenticacao.**

**RN-SEG-002.** MFA será obrigatório para perfis críticos: Administrador, Secretário, Coordenador e Presidência. **Criticidade: Alta. Origem: PRD §5, RF-ADM-001. Entidades: Usuario, Perfil.**

**RN-SEG-003.** O sistema deverá utilizar modelo híbrido RBAC + ABAC, com restrições contextuais por unidade organizacional, participação na auditoria, nível de sigilo e papel no processo. **Criticidade: Alta. Origem: PRD §2, RF-ADM-002. Entidades: Usuario, Perfil, Permissao, Auditoria.**

**RN-SEG-004.** O acesso a documentos internos da auditoria será condicionado à participação formal na auditoria, ao perfil e ao nível de sigilo do documento. **Criticidade: Alta. Origem: PRD §2. Entidades: Usuario, Auditoria, Documento, ClassificacaoInformacao.**

## 3.2 Segregação de Funções

**RN-SEG-005.** Nenhum auditor poderá aprovar o próprio trabalho. **Criticidade: Alta. Origem: PRD §2, §4. Entidades: PapelTrabalho, Auditoria.**

**RN-SEG-006.** Nenhum autor poderá aprovar o próprio relatório. **Criticidade: Alta. Origem: PRD §4. Entidades: Relatorio.**

**RN-SEG-007.** Nenhum avaliador poderá avaliar a própria execução. **Criticidade: Alta. Origem: PRD §2. Entidades: AvaliacaoQualidade.**

**RN-SEG-008.** O sistema deverá validar conflito de interesse e declaração de independência antes da atuação na auditoria. **Criticidade: Alta. Origem: PRD §4, RF-EXE-004. Entidades: DeclaracaoIndependencia, Auditoria, AuditoriaEquipe.**

## 3.3 Classificação da Informação

**RN-SEG-009.** O sistema deverá classificar informações e documentos em: público, restrito, confidencial e sigiloso. **Criticidade: Alta. Origem: PRD §5, RF-ADM-007. Entidades: Documento, ClassificacaoInformacao.**

**RN-SEG-010.** A visualização de documentos deverá respeitar a classificação e o perfil de acesso do usuário. **Criticidade: Alta. Origem: PRD §2, Vol. XIV. Entidades: Documento, Usuario, Perfil.**

---

# 4. Regras de Cadastros Estruturantes (RN-CAD)

**RN-CAD-001.** O universo auditável deverá ser revisado ao menos uma vez por exercício. **Criticidade: Alta. Origem: PRD §4. Entidades: UniversoAuditavel, Exercicio.**

**RN-CAD-002.** A hierarquia de processos deverá suportar, no mínimo: Objetivo Estratégico → Macroprocesso → Grupo de Processo → Processo → Subprocesso → Objeto Auditável. **Criticidade: Alta. Origem: PRD §3.1. Entidades: ObjetivoEstrategico, Macroprocesso, GrupoProcesso, Processo, Subprocesso, ObjetoAuditavel.**

**RN-CAD-003.** Bancos de questões e procedimentos deverão ser classificados e vinculáveis a processos, objetos auditáveis e tipos de auditoria. **Criticidade: Média. Origem: PRD §3.1, Vol. XIII. Entidades: QuestaoAuditoria, Procedimento, ObjetoAuditavel.**

**RN-CAD-004.** Templates e modelos documentais deverão ser parametrizáveis por tipo de trabalho e editáveis sem alteração de código. **Criticidade: Média. Origem: PRD §3.1. Entidades: TemplateDocumento, TipoAuditoria.**

---

# 5. Regras de Planejamento (RN-PLN)

**RN-PLN-001.** Nenhum PAA poderá exceder a capacidade operacional disponível da AUDIN. **Criticidade: Alta. Origem: PRD §4, RN-PLN-006. Entidades: PAA, CapacidadeOperacional.**

**RN-PLN-002.** Toda alteração do PAA deverá possuir justificativa formal e manter histórico completo. **Criticidade: Alta. Origem: PRD §4. Entidades: PAA, AlteracaoPAA, Historico.**

**RN-PLN-003.** Toda auditoria mandatória deverá ser incluída automaticamente no planejamento anual. **Criticidade: Alta. Origem: PRD §4, RF-PLN-003. Entidades: AuditoriaMandatoria, PAA.**

**RN-PLN-004.** A matriz de priorização deverá calcular prioridade objetiva baseada em materialidade, relevância, criticidade e risco. **Criticidade: Alta. Origem: PRD §3.2. Entidades: MatrizPriorizacao, ObjetoAuditavel, Risco.**

**RN-PLN-005.** A capacidade operacional deverá considerar: auditores, dias úteis, férias, licenças, capacitações, reserva técnica e compromissos institucionais. **Criticidade: Alta. Origem: PRD §3.2, RF-PLN-006. Entidades: CapacidadeOperacional, Auditor, Calendario.**

**RN-PLN-006.** A distribuição automática de carga deverá considerar disponibilidade, especialidade, experiência, independência e conflitos de interesse. **Criticidade: Média. Origem: PRD §3.2, RF-PLN-008. Entidades: AuditoriaEquipe, Auditor, Especialidade.**

**RN-PLN-007.** O PALP e o PAA deverão seguir workflow de rascunho, revisão técnica, aprovação AUDIN, aprovação da Presidência e publicação. **Criticidade: Alta. Origem: PRD §3.2, Vol. III. Entidades: PALP, PAA, Workflow.**

**RN-PLN-008.** O sistema deverá calcular indicadores de cobertura do PALP e do universo auditável. **Criticidade: Média. Origem: PRD §3.2, RF-PLN-009. Entidades: PALP, UniversoAuditavel, Indicador.**

**RN-PLN-009.** Simulações de cenários deverão permitir análise prospectiva sem alterar dados oficiais. **Criticidade: Média. Origem: PRD §3.2. Entidades: SimulacaoCenario, PAA.**

**RN-PLN-010.** O QACI deverá ser aplicado por blocos (ambiente de controle, riscos, atividades de controle, informação e comunicação, monitoramento), com cálculo automático do Índice de Controle Interno. **Criticidade: Alta. Origem: PRD §3.2, Vol. III. Entidades: QACI, BlocoQACI, RespostaQACI.**

---

# 6. Regras de Execução de Auditorias (RN-EXE)

**RN-EXE-001.** Toda auditoria deverá estar vinculada a processo ou objeto do universo auditável. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Auditoria, ObjetoAuditavel.**

**RN-EXE-002.** Toda auditoria deverá possuir risco associado. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Auditoria, Risco.**

**RN-EXE-003.** Todo trabalho deverá possuir Auditor Líder e Supervisor designados formalmente. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Auditoria, AuditoriaEquipe.**

**RN-EXE-004.** O sistema deverá validar conflito de interesse e declaração de independência antes da atuação na auditoria. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: DeclaracaoIndependencia, AuditoriaEquipe.**

**RN-EXE-005.** Toda auditoria deverá possuir planejamento específico aprovado antes do início da execução. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: PlanejamentoEspecifico, Auditoria.**

**RN-EXE-006.** Todo procedimento deverá estar vinculado a objetivo de auditoria. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Procedimento, ObjetivoAuditoria.**

**RN-EXE-007.** Toda conclusão deverá possuir evidência associada. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Conclusao, Evidencia.**

**RN-EXE-008.** Nenhuma evidência aprovada poderá ser removida (apenas exclusão lógica). **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: Evidencia.**

**RN-EXE-009.** Nenhum papel de trabalho poderá ser aprovado pelo próprio autor. **Criticidade: Alta. Origem: PRD §4. Entidades: PapelTrabalho, Usuario.**

**RN-EXE-010.** Nenhum trabalho poderá ser encerrado sem checklist de encerramento completo. **Criticidade: Alta. Origem: PRD §4, Vol. IV. Entidades: ChecklistEncerramento, Auditoria.**

**RN-EXE-011.** Papéis de trabalho deverão seguir workflow de elaboração, revisão, aprovação, rejeição e arquivamento. **Criticidade: Alta. Origem: PRD §3.3, Vol. IV. Entidades: PapelTrabalho.**

**RN-EXE-012.** Solicitações de informação deverão ter controle de prazo e alertas de vencimento. **Criticidade: Média. Origem: PRD §3.3. Entidades: SolicitacaoInformacao, Alerta.**

**RN-EXE-013.** Amostragem deverá documentar método, critério, quantidade e justificativa técnica. **Criticidade: Média. Origem: PRD §3.3, Vol. IV. Entidades: Amostragem.**

**RN-EXE-014.** A supervisão técnica deverá ser registrada com revisão de planejamento, papéis, evidências, conclusões e achados. **Criticidade: Alta. Origem: PRD §3.3, Vol. IV. Entidades: Supervisao, PapelTrabalho, Evidencia.**

**RN-EXE-015.** O controle de qualidade da execução deverá avaliar adequação do planejamento, suficiência de evidências e fundamentação das conclusões. **Criticidade: Alta. Origem: PRD §3.3, Vol. IV. Entidades: ControleQualidade, Auditoria.**

---

# 7. Regras de Achados e Resultados (RN-ACH)

**RN-ACH-001.** Todo achado deverá possuir obrigatoriamente: critério, condição, causa, efeito, evidência, risco e recomendação. **Criticidade: Alta. Origem: PRD §3.4, Vol. V. Entidades: Achado.**

**RN-ACH-002.** Nenhum achado poderá ser consolidado sem evidência vinculada. **Criticidade: Alta. Origem: PRD §3.4. Entidades: Achado, Evidencia.**

**RN-ACH-003.** Achados deverão ser classificados por categoria (não conformidade, fragilidade de controle, oportunidade de melhoria, ineficiência operacional, risco elevado, boa prática) e por natureza (estratégica, tática, operacional, financeira, TI, integridade, conformidade). **Criticidade: Alta. Origem: PRD §3.4, Vol. V. Entidades: Achado, CategoriaAchado, NaturezaAchado.**

**RN-ACH-004.** Achados deverão ser vinculados a riscos estratégicos, operacionais, financeiros, de conformidade, de integridade e de TI. **Criticidade: Alta. Origem: PRD §3.4. Entidades: Achado, Risco.**

**RN-ACH-005.** Toda recomendação deverá estar vinculada a um único achado. **Criticidade: Alta. Origem: PRD §4. Entidades: Recomendacao, Achado.**

**RN-ACH-006.** Recomendações deverão registrar tipo (corretiva, preventiva, detectiva, compensatória ou estrutural), benefício esperado, prazo sugerido e responsável sugerido. **Criticidade: Alta. Origem: PRD §3.4. Entidades: Recomendacao.**

**RN-ACH-007.** Determinações deverão possuir código, origem, autoridade, fundamentação, prazo e responsável. **Criticidade: Alta. Origem: PRD §3.4. Entidades: Determinacao.**

**RN-ACH-008.** Benefícios deverão ser mensurados em categorias financeira e não financeira. **Criticidade: Média. Origem: PRD §3.4. Entidades: Beneficio.**

**RN-ACH-009.** Todo achado deverá passar por contraditório antes do relatório final, salvo exceções formalmente justificadas. **Criticidade: Alta. Origem: PRD §4, Vol. V. Entidades: Contraditorio, Achado.**

**RN-ACH-010.** A análise das manifestações deverá registrar: aceitação integral, parcial, rejeição ou exigência de complementação, sempre com justificativa formal. **Criticidade: Alta. Origem: PRD §3.4. Entidades: Manifestacao, AnaliseManifestacao.**

**RN-ACH-011.** O sistema deverá detectar automaticamente reincidências (primeira ocorrência, reincidência e reincidência crônica), considerando unidade, processo, risco, controle e causa. **Criticidade: Alta. Origem: PRD §3.4, Vol. V. Entidades: Achado, Reincidencia.**

**RN-ACH-012.** Achados críticos deverão gerar alerta automático à chefia da AUDIN. **Criticidade: Alta. Origem: PRD §4. Entidades: Achado, Alerta.**

**RN-ACH-013.** Achados reincidentes deverão ser destacados automaticamente no quadro de resultados. **Criticidade: Alta. Origem: PRD §4. Entidades: Achado, QuadroResultados.**

**RN-ACH-014.** O quadro de resultados deverá ser consolidado automaticamente a partir dos achados, riscos, criticidade, recomendações, responsáveis, prazos e status. **Criticidade: Alta. Origem: PRD §3.4. Entidades: QuadroResultados, Achado, Recomendacao.**

**RN-ACH-015.** A comunicação preliminar deverá encaminhar achados validados à unidade auditada para manifestação eletrônica antes da emissão do relatório final. **Criticidade: Alta. Origem: PRD §3.4, Vol. V. Entidades: ComunicacaoPreliminar, Achado, Manifestacao.**

---

# 8. Regras de Relatórios (RN-REL)

**RN-REL-001.** O relatório de auditoria deverá conter: capa, identificação, sumário executivo, introdução, objetivos, escopo, metodologia, limitações, achados, recomendações, benefícios, conclusão e anexos. **Criticidade: Alta. Origem: PRD §3.5, Vol. VI. Entidades: Relatorio.**

**RN-REL-002.** O relatório deverá seguir workflow de rascunho, revisão técnica, supervisão, aprovação AUDIN, ciência da unidade e publicação. **Criticidade: Alta. Origem: PRD §3.5. Entidades: Relatorio, WorkflowRelatorio.**

**RN-REL-003.** O sistema deverá suportar assinatura eletrônica (ICP-Brasil e assinador corporativo). **Criticidade: Alta. Origem: PRD §3.5. Entidades: AssinaturaEletronica, Relatorio.**

**RN-REL-004.** A publicação deverá respeitar a classificação da informação e o perfil de acesso do usuário. **Criticidade: Alta. Origem: PRD §3.5. Entidades: Publicacao, ClassificacaoInformacao, Usuario.**

**RN-REL-005.** Templates deverão ser parametrizáveis por tipo de trabalho (operacional, financeira, TI, conformidade, coordenada, consultoria). **Criticidade: Média. Origem: PRD §3.5. Entidades: TemplateRelatorio, TipoAuditoria.**

**RN-REL-006.** A geração automática deverá montar capa, sumário, quadro de resultados, lista de recomendações, lista de determinações e anexos referenciados. **Criticidade: Alta. Origem: PRD §3.5. Entidades: Relatorio, SecaoRelatorio.**

---

# 9. Regras de Monitoramento (RN-MON)

**RN-MON-001.** Toda recomendação deverá possuir código, achado de origem, descrição, prioridade, responsável, unidade, prazo e status. **Criticidade: Alta. Origem: PRD §3.6. Entidades: Recomendacao, Monitoramento.**

**RN-MON-002.** Determinações deverão ter monitoramento obrigatório. **Criticidade: Alta. Origem: PRD §3.6. Entidades: Determinacao, Monitoramento.**

**RN-MON-003.** O plano de ação deverá registrar: ação, responsável, prazo, recursos necessários, indicador e evidência prevista. **Criticidade: Alta. Origem: PRD §3.6. Entidades: PlanoAcao, AcaoPlano.**

**RN-MON-004.** O plano de ação seguirá workflow: elaboração, análise AUDIN, aprovação, execução e validação. **Criticidade: Alta. Origem: PRD §3.6. Entidades: PlanoAcao, WorkflowPlanoAcao.**

**RN-MON-005.** O sistema deverá suportar modalidades de monitoramento: periódico, contínuo e extraordinário. **Criticidade: Média. Origem: PRD §3.6. Entidades: CicloMonitoramento.**

**RN-MON-006.** Status de implementação: não iniciada, em planejamento, em implementação, implementada, parcialmente implementada, não implementada e cancelada. **Criticidade: Alta. Origem: PRD §3.6. Entidades: StatusImplementacao.**

**RN-MON-007.** Não será permitido encerrar recomendação sem validação e, quando exigido pela metodologia, sem avaliação de efetividade. **Criticidade: Alta. Origem: PRD §4. Entidades: Recomendacao, AvaliacaoImplementacao, AvaliacaoEfetividade.**

**RN-MON-008.** Reabertura de recomendações somente por: evidência insuficiente, falha identificada posteriormente, reincidência ou novo risco, sempre com justificativa. **Criticidade: Alta. Origem: PRD §3.6. Entidades: ReaberturaRecomendacao.**

**RN-MON-009.** Toda recomendação crítica vencida deverá gerar alerta automático à chefia da AUDIN. **Criticidade: Alta. Origem: PRD §4. Entidades: Recomendacao, Alerta.**

**RN-MON-010.** Toda determinação vencida deverá ser destacada nos dashboards executivos. **Criticidade: Alta. Origem: PRD §4. Entidades: Determinacao, Dashboard.**

**RN-MON-011.** Benefícios implementados deverão ser mantidos em histórico anual (financeiros e não financeiros). **Criticidade: Média. Origem: PRD §3.6. Entidades: BeneficioImplementado.**

**RN-MON-012.** O sistema deverá gerar RMA automático com quadros de acompanhamento, estatísticas, gráficos e indicadores. **Criticidade: Alta. Origem: PRD §3.6. Entidades: RMA.**

---

# 10. Regras de Gestão de Riscos (RN-RSK)

**RN-RSK-001.** Todo risco deverá estar vinculado a um objeto auditável e possuir responsável institucional. **Criticidade: Alta. Origem: PRD §4, Vol. IX. Entidades: Risco, ObjetoAuditavel.**

**RN-RSK-002.** O sistema deverá calcular e classificar risco inerente e risco residual com base em probabilidade, impacto, velocidade, vulnerabilidade e detectabilidade. **Criticidade: Alta. Origem: PRD §3.2, Vol. IX. Entidades: Risco, AvaliacaoRisco.**

**RN-RSK-003.** Controles internos associados aos riscos deverão registrar tipo e efetividade. **Criticidade: Alta. Origem: PRD §3.2. Entidades: ControleInterno, Risco.**

**RN-RSK-004.** A matriz de riscos e heatmap deverão ser gerados com filtros por unidade, processo, categoria e exercício. **Criticidade: Alta. Origem: PRD §3.2. Entidades: MatrizRisco, Heatmap.**

**RN-RSK-005.** O apetite de risco deverá ser definido em faixas (verde, amarela, vermelha) e utilizado na priorização do PAA e monitoramentos. **Criticidade: Alta. Origem: PRD §3.2. Entidades: ApetiteRisco, PAA, Monitoramento.**

**RN-RSK-006.** Riscos emergentes deverão ser identificados e alertados quando não houver cobertura pelo planejamento vigente. **Criticidade: Alta. Origem: PRD §3.2. Entidades: RiscoEmergente, Alerta.**

**RN-RSK-007.** Riscos críticos deverão gerar alertas automáticos. **Criticidade: Alta. Origem: PRD §4. Entidades: Risco, Alerta.**

**RN-RSK-008.** Riscos sem controle associado deverão ser destacados nos dashboards. **Criticidade: Alta. Origem: PRD §4. Entidades: Risco, Dashboard.**

**RN-RSK-009.** O risco residual deverá retroalimentar o ciclo de planejamento dos exercícios subsequentes. **Criticidade: Alta. Origem: PRD §6, Vol. IX. Entidades: Risco, PlanejamentoEspecifico.**

**RN-RSK-010.** O sistema deverá manter histórico de revisão de cada risco, com evolução do risco inerente e residual ao longo do tempo. **Criticidade: Média. Origem: Vol. IX. Entidades: Risco, HistoricoRisco.**

---

# 11. Regras de Integridade e Rastreabilidade (RN-INT)

**RN-INT-001.** Toda operação sensível deverá gerar log auditável, permanente e imutável. **Criticidade: Alta. Origem: PRD §4. Entidades: LogAuditoria.**

**RN-INT-002.** Toda exclusão deverá ser lógica (soft delete). **Criticidade: Alta. Origem: PRD §4. Entidades: Todas as entidades.**

**RN-INT-003.** Nenhuma versão histórica poderá ser removida. **Criticidade: Alta. Origem: PRD §4. Entidades: Versionamento, todas as entidades versionáveis.**

**RN-INT-004.** O sistema deverá manter versionamento nativo de: PALP, PAA, programas de auditoria, papéis de trabalho, relatórios, planos de ação e avaliações. **Criticidade: Alta. Origem: PRD §5. Entidades: Todas as entidades versionáveis.**

**RN-INT-005.** O sistema deverá registrar trilha de auditoria para: autenticação, inclusões, alterações, exclusões lógicas, aprovações, publicações e encerramentos. **Criticidade: Alta. Origem: PRD §5, RF-ADM-008. Entidades: LogAuditoria.**

---

# 12. Regras Cross-Domain (RN-CD)

**RN-CD-001.** O ciclo macro do sistema seguirá a sequência: universo auditável → risco → priorização → PALP/PAA → auditoria → achados → relatório → monitoramento → efetividade → retroalimentação do risco e do planejamento. **Criticidade: Alta. Origem: PRD, RQ-004. Entidades: Múltiplas.**

**RN-CD-002.** Os dados produzidos em execução, resultados e monitoramento deverão alimentar a gestão de riscos, a priorização e o planejamento dos exercícios subsequentes (retroalimentação). **Criticidade: Alta. Origem: PRD §6, Vol. VI. Entidades: Múltiplas.**

**RN-CD-003.** O sistema deverá gerar automaticamente relatórios, quadros de resultados, RMAs, indicadores e dashboards gerenciais. **Criticidade: Alta. Origem: PRD §4, Vol. VI. Entidades: Relatorio, RMA, Indicador, Dashboard.**

**RN-CD-004.** O sistema deverá prover insumos para PQAUD, IA-CM, BI e melhoria contínua. **Criticidade: Média. Origem: PRD §3.7. Entidades: PQAUD, IACM, Indicador.**

**RN-CD-005.** Delegações temporárias e substituições deverão ser registradas com delegante, delegado, início, fim e justificativa. **Criticidade: Alta. Origem: PRD §2. Entidades: Delegacao, Substituicao.**

**RN-CD-006.** Alertas e notificações deverão ser gerados para: prazo próximo do vencimento, vencimento, manifestação pendente, plano de ação pendente, validação pendente e encerramento pendente. **Criticidade: Alta. Origem: PRD §3.6. Entidades: Alerta, Notificacao.**

**RN-CD-007.** O sistema deverá suportar parâmetros configuráveis para: tipos de auditoria, tipos de risco, tipos de achado, tipos de evidência, status, calendários e fluxos de aprovação. **Criticidade: Média. Origem: PRD §3.1. Entidades: ParametroSistema.**

**RN-CD-008.** O sistema deverá ser concebido como plataforma integrada, permitindo rastreabilidade entre planejamento, execução, resultados e monitoramento de cada objeto auditável. **Criticidade: Alta. Origem: PRD §1. Entidades: Múltiplas.**

---

# 13. Resumo Estatístico

| Domínio | Código | Quantidade | Alta | Média |
|---------|--------|-----------|------|-------|
| Segurança e Acesso | RN-SEG | 10 | 10 | 0 |
| Cadastros Estruturantes | RN-CAD | 4 | 2 | 2 |
| Planejamento | RN-PLN | 10 | 8 | 2 |
| Execução de Auditorias | RN-EXE | 15 | 13 | 2 |
| Achados e Resultados | RN-ACH | 15 | 14 | 1 |
| Relatórios | RN-REL | 6 | 5 | 1 |
| Monitoramento | RN-MON | 12 | 10 | 2 |
| Gestão de Riscos | RN-RSK | 10 | 9 | 1 |
| Integridade e Rastreabilidade | RN-INT | 5 | 5 | 0 |
| Cross-Domain | RN-CD | 8 | 6 | 2 |
| **TOTAL** | | **95** | **82** | **13** |

---

# 14. Matriz de Regras por Entidade

| Entidade | Regras Aplicáveis |
|----------|-------------------|
| Usuario | RN-SEG-001, RN-SEG-002, RN-SEG-003, RN-SEG-004, RN-SEG-010 |
| Perfil | RN-SEG-002, RN-SEG-003 |
| Auditoria | RN-EXE-001, RN-EXE-002, RN-EXE-003, RN-EXE-004, RN-EXE-005, RN-EXE-010 |
| PlanejamentoEspecifico | RN-EXE-005, RN-EXE-006, RN-EXE-014 |
| PapelTrabalho | RN-EXE-009, RN-EXE-011, RN-SEG-005 |
| Evidencia | RN-EXE-007, RN-EXE-008, RN-ACH-002 |
| Achado | RN-ACH-001 a RN-ACH-015 |
| Recomendacao | RN-ACH-005, RN-ACH-006, RN-MON-001, RN-MON-007, RN-MON-009 |
| Determinacao | RN-ACH-007, RN-MON-002, RN-MON-010 |
| Relatorio | RN-REL-001 a RN-REL-006, RN-SEG-006 |
| Contraditorio | RN-ACH-009, RN-ACH-010 |
| Monitoramento | RN-MON-001 a RN-MON-012 |
| PlanoAcao | RN-MON-003, RN-MON-004 |
| Risco | RN-RSK-001 a RN-RSK-010, RN-EXE-002 |
| PAA | RN-PLN-001, RN-PLN-002, RN-PLN-003, RN-PLN-007, RN-PLN-008 |
| PALP | RN-PLN-007 |
| UniversoAuditavel | RN-CAD-001, RN-CAD-002 |
| LogAuditoria | RN-INT-001, RN-INT-005 |
| ClassificacaoInformacao | RN-SEG-009, RN-SEG-010, RN-REL-004 |
| Delegacao | RN-CD-005 |

---

# 15. Referências Normativas

| Referência | Regras Relacionadas |
|------------|---------------------|
| Resolução CNJ 309/2020 | RN-PLN-001, RN-PLN-003, RN-PLN-007, RN-EXE-001, RN-MON-007 |
| Resolução CNJ 332/2020 | RN-SEG-009, RN-SEG-010, RN-INT-001 |
| Resolução CNJ 370/2021 | RN-RSK-001, RN-RSK-002, RN-ACH-001 |
| Normas Globais do IIA | RN-EXE-005, RN-ACH-001, RN-ACH-009, RN-MON-007 |
| Modelo IA-CM | RN-CD-004 |
| COSO / COSO ERM | RN-RSK-002, RN-RSK-005 |
| ISO 31000 | RN-RSK-002, RN-RSK-009 |
| LGPD (Lei 13.709/2018) | RN-SEG-004, RN-SEG-009, RN-INT-001 |
| PRD CONFORMITAS 3.0 | Todas |
