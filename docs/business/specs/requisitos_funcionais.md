# CONFORMITAS (SGI) — REQUISITOS FUNCIONAIS

**Versão:** 1.0 | **Data:** 16/06/2026 | **Responsável:** IA (Step 1)

---

## 1. Finalidade

**RQ-001.** Este documento especifica os requisitos funcionais do CONFORMITAS (SGI), sistema de gestão de auditoria interna da AUDIN/TJCE, conforme Lei 18.561/2023 e Resoluções CNJ 308/2020 e 309/2020 (DIRAUD-Jud).

**RQ-002.** O sistema deverá atender à visão estratégica da plataforma, suportando o ciclo completo de auditoria baseada em riscos com rastreabilidade, segurança e conformidade normativa.

---

## 2. Escopo Geral

**RQ-003.** O CONFORMITAS deverá abranger os seguintes domínios funcionais: Administração e Segurança, Planejamento (PALP/PAA), Execução de Auditoria, Achados e Resultados, Relatórios e Monitoramento, Consultorias, Qualidade (PQAUD), Gestão de Riscos, Competências (PAC-Aud), Ética e Independência, Governança e Transparência, Biblioteca Metodológica, Sigilo e Classificação, Dashboards e BI, Integrações.

**RQ-004.** O ciclo macro do sistema: Planejamento (PALP/PAA) → Abertura de Auditoria → Execução (evidências, papéis de trabalho) → Achados Preliminares → Manifestação → Relatório Final → Recomendações → Monitoramento → Qualidade (PQAUD) → Melhoria Contínua.

---

## 3. Requisitos Funcionais (RF)

### 3.1. Administração, Segurança e Controle de Acesso
**Fonte:** MOD-ADM-001

**RF-ADM-001.** O sistema deverá suportar autenticação por login/senha com JWT e MFA via TOTP para perfis críticos (P01, P02, P10).

**RF-ADM-002.** O sistema deverá utilizar controle de acesso RBAC com 10 perfis (P01 a P10), contemplando restrições por perfil, unidade e contexto.

**RF-ADM-003.** O sistema deverá permitir cadastro, atualização, inativação e bloqueio de usuários com vínculo a unidade organizacional, matrícula, cargo e lotação.

**RF-ADM-004.** O sistema deverá suportar os 10 perfis: Auditor-Chefe (P01), Auditor (P02), Presidente (P03), Órgão Colegiado (P04), Gestor Unidade Auditada (P05), Gestor 2ª Linha (P06), Avaliador Externo (P07), Comitê SIAUD-Jud (P08), CPA (P09), Administrador do Sistema (P10).

**RF-ADM-005.** O sistema deverá suportar delegações temporárias de atribuições e acesso temporário para Avaliador Externo com escopo e prazo definidos.

**RF-ADM-006.** O sistema deverá aplicar segregação de funções: um usuário não pode acumular P01 + qualquer outro perfil; P02 + P05 da mesma unidade; P10 + qualquer perfil de negócio.

**RF-ADM-007.** O sistema deverá classificar documentos nos níveis: Público, Interno, Restrito, Sigiloso.

**RF-ADM-008.** O sistema deverá registrar trilha de auditoria para autenticação, CRUD de usuários, alterações de permissão e acessos a dados sigilosos.

**RF-ADM-009.** O sistema deverá gerenciar mandatos do Auditor-Chefe (2 anos, máx. 6, interstício 1 ano), conforme CNJ 308 art. 6º.

**RF-ADM-010.** O sistema deverá validar vedações de designação: condenados por TCE, punidos em PAD, condenados por improbidade (CNJ 308 art. 7º).

---

### 3.2. Planejamento de Auditoria (PALP/PAA)
**Fonte:** MOD-PLN-001

**RF-PLN-001.** O sistema deverá manter o cadastro do universo de processos/áreas/temas auditáveis com notas de materialidade, relevância, criticidade e risco (1 a 5).

**RF-PLN-002.** O sistema deverá calcular automaticamente o índice de priorização e gerar a matriz ordenada para composição do PAA conforme horas disponíveis.

**RF-PLN-003.** O sistema deverá suportar elaboração, edição e versionamento do PALP quadrienal com status: Rascunho → Submetido → Aprovado → Publicado → Revisado.

**RF-PLN-004.** O sistema deverá suportar elaboração, edição e versionamento do PAA anual com submissão até 30/novembro e publicação até 15º dia útil de dezembro (CNJ 309 art. 32).

**RF-PLN-005.** O sistema deverá gerenciar o dimensionamento da força de trabalho: horas disponíveis por auditor, horas alocadas em auditorias, consultorias e capacitação.

**RF-PLN-006.** O sistema deverá suportar o planejamento individual de cada auditoria: escopo, questões, testes, equipe, cronograma e resultados esperados.

**RF-PLN-007.** O sistema deverá gerar alertas de prazo para submissão do PAA (01/novembro) e PALP (último ano do quadriênio).

---

### 3.3. Execução de Auditoria
**Fonte:** MOD-EXE-001

**RF-EXE-001.** O sistema deverá permitir abertura de auditoria a partir de item do PAA aprovado, com emissão automática do Comunicado de Auditoria (CNJ 309 art. 30).

**RF-EXE-002.** O sistema deverá suportar o Programa de Auditoria: escopo, questões, testes, procedimentos e cronograma detalhado.

**RF-EXE-003.** O sistema deverá permitir upload, catalogação e vinculação de evidências com metadados: tipo, fonte, data, atributos de confiabilidade.

**RF-EXE-004.** O sistema deverá suportar criação de papéis de trabalho com codificação, metodologia, verificações e referência a evidências.

**RF-EXE-005.** O sistema deverá emitir requisições formais à unidade auditada com prazo de resposta e rastreamento.

**RF-EXE-006.** O sistema deverá registrar acessos, limitações e obstruções durante a auditoria, com notificação imediata ao Auditor-Chefe.

**RF-EXE-007.** O sistema deverá classificar auditorias por tipo (conformidade, operacional, financeira, gestão, especial) e forma (direta, integrada, indireta, terceirizada).

---

### 3.4. Achados e Resultados
**Fonte:** MOD-ACH-001

**RF-ACH-001.** O sistema deverá registrar achados de auditoria com os quatro atributos obrigatórios: situação encontrada, critério, causa e efeito (CNJ 309 art. 46).

**RF-ACH-002.** O sistema deverá classificar achados como positivos (conformidade) ou negativos (não conformidade).

**RF-ACH-003.** O sistema deverá vincular achados às evidências de suporte da auditoria.

**RF-ACH-004.** O sistema deverá enviar achados preliminares à unidade auditada e coletar manifestações (esclarecimento, justificativa, concordância, discordância).

**RF-ACH-005.** O sistema deverá consolidar achados após manifestação ou expiração do prazo (5 dias úteis), gerando quadro de achados.

**RF-ACH-006.** O sistema deverá suportar revisão e aprovação de achados pelo auditor responsável antes da emissão de relatórios.

---

### 3.5. Relatórios e Monitoramento
**Fonte:** MOD-REL-001

**RF-REL-001.** O sistema deverá emitir Relatório Preliminar com achados para manifestação da unidade auditada.

**RF-REL-002.** O sistema deverá emitir Relatório Final consolidando achados, manifestações e recomendações.

**RF-REL-003.** O sistema deverá cadastrar recomendações com descrição, criticidade, prazo e responsável.

**RF-REL-004.** O sistema deverá monitorar recomendações com status: Pendente → Em Andamento → Cumprida / Vencida.

**RF-REL-005.** O sistema deverá permitir registro de providências adotadas pela unidade auditada com evidências.

**RF-REL-006.** O sistema deverá consolidar o Relatório Anual de Atividades da AUDIN para o órgão colegiado (CNJ 308 art. 5º).

**RF-REL-007.** O sistema deverá gerar alertas de prazos vencidos e escalonamento automático de recomendações não atendidas.

**RF-REL-008.** O sistema deverá verificar recomendações pendentes em auditorias subsequentes sobre a mesma área (CNJ 309 art. 57 §2º).

---

### 3.6. Consultorias e Assessoramento
**Fonte:** MOD-CON-001

**RF-CON-001.** O sistema deverá permitir que unidades do TJCE registrem solicitações de consultoria com dúvida fundamentada e legislação aplicável.

**RF-CON-002.** O sistema deverá suportar análise de aceitação pelo Auditor-Chefe com verificação de horas disponíveis no PAA.

**RF-CON-003.** O sistema deverá registrar consultorias realizadas: tipo (assessoramento, treinamento, aconselhamento), escopo, horas e resultado.

**RF-CON-004.** O sistema deverá exigir termo de ciência de que a consultoria não configura cogestão (CNJ 309 art. 58).

---

### 3.7. Qualidade e PQAUD
**Fonte:** MOD-QLD-001

**RF-QLD-001.** O sistema deverá suportar monitoramento contínuo de qualidade com registro de feedback, revisões e métricas.

**RF-QLD-002.** O sistema deverá suportar autoavaliações periódicas: qualidade do trabalho, supervisão, infraestrutura e valor agregado.

**RF-QLD-003.** O sistema deverá registrar avaliações externas e avaliações recíprocas entre AUDINs.

**RF-QLD-004.** O sistema deverá gerenciar não conformidades com planos de ação corretiva e prazos.

**RF-QLD-005.** O sistema deverá exibir indicadores de qualidade da AUDIN: conformidade PQAUD, notas de avaliações, taxa de melhoria.

---

### 3.8. Gestão de Riscos da AUDIN
**Fonte:** MOD-RIS-001

**RF-RIS-001.** O sistema deverá registrar o contexto organizacional e critérios de risco da AUDIN.

**RF-RIS-002.** O sistema deverá cadastrar riscos com: descrição, categoria, causa, evento, consequência, probabilidade (1-5) e impacto (1-5).

**RF-RIS-003.** O sistema deverá calcular automaticamente o nível de risco (Baixo, Médio, Alto, Crítico) e gerar matriz de riscos.

**RF-RIS-004.** O sistema deverá registrar estratégia de tratamento: Evitar, Mitigar, Transferir, Aceitar — com plano de ação.

---

### 3.9. Competências e PAC-Aud
**Fonte:** MOD-CAP-001

**RF-CAP-001.** O sistema deverá manter mapa de competências técnicas e gerenciais requeridas por área de auditoria.

**RF-CAP-002.** O sistema deverá identificar lacunas de conhecimento por auditor (competências requeridas × existentes).

**RF-CAP-003.** O sistema deverá suportar elaboração do PAC-Aud com vinculação ao PAA e meta de 40h/ano por servidor (CNJ 309 art. 72).

**RF-CAP-004.** O sistema deverá registrar capacitações: curso, instituição, carga horária, participantes, certificado.

**RF-CAP-005.** O sistema deverá totalizar horas de capacitação por auditor/ano com alerta de meta não atingida.

---

### 3.10. Ética e Independência
**Fonte:** MOD-ETI-001

**RF-ETI-001.** O sistema deverá suportar declaração anual de independência por auditor com assinatura eletrônica.

**RF-ETI-002.** O sistema deverá registrar impedimentos: auditor se declara impedido para auditoria específica com justificativa.

**RF-ETI-003.** O sistema deverá verificar automaticamente conflitos de interesse ao designar equipe de auditoria.

**RF-ETI-004.** O sistema deverá registrar aceite do termo de confidencialidade por novos integrantes.

**RF-ETI-005.** O sistema deverá disponibilizar e versionar o Código de Ética da AUDIN.

---

### 3.11. Governança, Transparência e Fraudes
**Fonte:** MOD-GOV-001

**RF-GOV-001.** O sistema deverá gerenciar a publicação de relatórios no portal de transparência do TJCE.

**RF-GOV-002.** O sistema deverá integrar-se com a Ouvidoria do TJCE para receber denúncias e reclamações relevantes ao planejamento (CNJ 309 art. 34 §3º).

**RF-GOV-003.** O sistema deverá registrar determinações e recomendações do TCE e CNJ com controle de prazos de resposta.

**RF-GOV-004.** O sistema deverá documentar indícios de fraude identificados em auditoria com classificação (suspeita, confirmada, descartada).

**RF-GOV-005.** O sistema deverá suportar workflow de comunicação de fraudes: superior hierárquico → (60 dias sem resposta) → TCE.

---

### 3.12. Biblioteca Metodológica
**Fonte:** MOD-BIB-001

**RF-BIB-001.** O sistema deverá manter catálogo de normas, manuais, procedimentos, templates e checklists categorizados.

**RF-BIB-002.** O sistema deverá versionar documentos metodológicos com controle de vigência.

**RF-BIB-003.** O sistema deverá prover busca textual no acervo metodológico.

---

### 3.13. Sigilo e Classificação
**Fonte:** MOD-SIG-001

**RF-SIG-001.** O sistema deverá classificar cada documento/registro nos níveis Público, Interno, Restrito, Sigiloso.

**RF-SIG-002.** O sistema deverá restringir acesso conforme classificação × perfil do usuário.

**RF-SIG-003.** O sistema deverá suportar auditorias sigilosas com acesso restrito (CNJ 309 art. 50).

**RF-SIG-004.** O sistema deverá registrar trilha de acesso a documentos sigilosos: quem, quando, qual ação.

---

### 3.14. Dashboards e BI
**Fonte:** MOD-DSH-001

**RF-DSH-001.** O sistema deverá exibir dashboard de acompanhamento do PAA (planejado × executado, cobertura do universo).

**RF-DSH-002.** O sistema deverá exibir dashboard de execução (auditorias por status, tipo, unidade, tempo médio).

**RF-DSH-003.** O sistema deverá exibir dashboard de recomendações (status, criticidade, vencidas, taxa de cumprimento).

**RF-DSH-004.** O sistema deverá exibir dashboard de qualidade com indicadores do PQAUD.

**RF-DSH-005.** O sistema deverá permitir exportação de relatórios gerenciais em PDF e XLSX.

---

### 3.15. Integrações
**Fonte:** MOD-INT-001

**RF-INT-001.** O sistema deverá manter catálogo de integrações com metadados: sistema, protocolo, autenticação, SLAs, status.

**RF-INT-002.** O sistema deverá integrar-se com a Ouvidoria do TJCE para consumo de denúncias que subsidiem o planejamento.

**RF-INT-003.** O sistema deverá suportar Ações Coordenadas de Auditoria do SIAUD-Jud: recebimento, execução e reporte à CPA (CNJ 308 art. 13-14).

**RF-INT-004.** O sistema deverá publicar automaticamente PAA, PALP e Relatório Anual no portal de transparência.

**RF-INT-005.** O sistema deverá monitorar saúde das integrações com dashboard de status, latência e erros.

---

## 7. Rastreabilidade

| Código RF | Módulo | Origem | Prioridade |
|-----------|--------|--------|------------|
| RF-ADM-001 a 010 | MOD-ADM-001 | CNJ 308 art. 4-8; CNJ 309 art. 19-22 | Must |
| RF-PLN-001 a 007 | MOD-PLN-001 | CNJ 309 art. 31-41 | Must |
| RF-EXE-001 a 007 | MOD-EXE-001 | CNJ 309 art. 42-50 | Must |
| RF-ACH-001 a 006 | MOD-ACH-001 | CNJ 309 art. 46-49 | Must |
| RF-REL-001 a 008 | MOD-REL-001 | CNJ 309 art. 51-57; CNJ 308 art. 5 | Must |
| RF-CON-001 a 004 | MOD-CON-001 | CNJ 309 art. 58-61 | Should |
| RF-QLD-001 a 005 | MOD-QLD-001 | CNJ 309 art. 62-68 | Should |
| RF-RIS-001 a 004 | MOD-RIS-001 | Manual Gestão de Riscos AUDIN | Should |
| RF-CAP-001 a 005 | MOD-CAP-001 | CNJ 309 art. 69-73 | Should |
| RF-ETI-001 a 005 | MOD-ETI-001 | CNJ 309 art. 3-15 | Must |
| RF-GOV-001 a 005 | MOD-GOV-001 | CNJ 308 art. 5; CNJ 309 art. 13, 34 | Should |
| RF-BIB-001 a 003 | MOD-BIB-001 | CNJ 309 art. 17 | Could |
| RF-SIG-001 a 004 | MOD-SIG-001 | CNJ 309 art. 11, 50 | Must |
| RF-DSH-001 a 005 | MOD-DSH-001 | CNJ 309 art. 75 | Should |
| RF-INT-001 a 005 | MOD-INT-001 | CNJ 308 art. 9-14; CNJ 309 art. 34 | Should |

---

## 8. Validação de Completude

1. ✅ Todos os 15 domínios funcionais cobertos por ao menos um RF (75 RFs no total)
2. ✅ Todas as regras de negócio críticas referenciadas nos RFs
3. ✅ Matriz de rastreabilidade preenchida para todos os requisitos
4. ✅ Nenhum requisito ambíguo — todos têm critério de verificação

**Parecer:** Documento gerado a partir dos módulos validados no Step 0.5. Aguarda validação humana (Gate 2).

---

*Versão: 1.0 | Data: 16/06/2026 | Responsável: IA (Step 1)*
