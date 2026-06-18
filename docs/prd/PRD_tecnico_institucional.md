# PRD Técnico — CONFORMITAS 3.0
## Sistema Integrado de Gestão de Auditoria Interna (SGI)
**Data:** 16/06/2026 | **Status:** Gerado por IA (Step 2) — Aguardando Validação (Gate 3)

---

## 1. Visão Geral e Objetivos

O **CONFORMITAS 3.0** é uma plataforma corporativa integrada para gestão do ciclo completo de auditoria interna governamental da AUDIN/TJCE. A plataforma suporta de forma digital e rastreável o fluxo completo: planejamento (PALP/PAA) → execução metodológica (evidências, papéis de trabalho) → achados e resultados → relatórios e recomendações → monitoramento → qualidade (PQAUD) → melhoria contínua.

O sistema é concebido como plataforma orientada a **Auditoria Baseada em Riscos (Risk-Based Internal Auditing — RBIA)**, alinhada à Lei 18.561/2023, às Resoluções CNJ 308/2020 e 309/2020 (DIRAUD-Jud) e às Normas Internacionais IIA/IPPF.

### Objetivos Principais:

- **OE-01:** Padronizar o fluxo completo de auditoria interna conforme a DIRAUD-Jud. [CNJ 309/2020]
- **OE-02:** Automatizar o planejamento baseado em riscos (PALP/PAA) com metodologia de priorização. [CNJ 309 arts. 31-41]
- **OE-03:** Garantir rastreabilidade integral do ciclo de auditoria (planejamento → execução → achados → recomendações → monitoramento). [CNJ 309 arts. 43-44]
- **OE-04:** Instrumentalizar o Programa de Qualidade (PQAUD) com indicadores, avaliações e planos de melhoria. [CNJ 309 arts. 62-68]
- **OE-05:** Ampliar a transparência com publicação automática de relatórios. [CNJ 308 art. 5º]
- **OE-06:** Integrar a gestão de riscos da AUDIN ao planejamento. [Manual Gestão de Riscos AUDIN]
- **OE-07:** Suportar gestão de competências e PAC-Aud. [CNJ 309 arts. 69-73]
- **OE-08:** Oferecer dashboards e BI para decisão baseada em dados. [CNJ 309 art. 75]

---

## 2. Atores e Permissões (RBAC + ABAC)

O sistema utiliza **modelo híbrido RBAC + ABAC**, com 10 perfis predefinidos e políticas contextuais por unidade, classificação de sigilo e papel no processo.

### Perfis:

- **P01 — Auditor-Chefe:** Titular da AUDIN. Supervisão total, aprova planos e relatórios, gere qualidade. Mandato de 2 anos (máx. 6). Não acumula outros perfis. [MOD-ADM-001; CNJ 308 art. 6º]
- **P02 — Auditor:** Servidor em exercício na AUDIN. Executa auditorias designadas, registra evidências, achados e papéis de trabalho. [MOD-ADM-001; CNJ 309 art. 29]
- **P03 — Presidente:** Presidente do TJCE. Aprova PAA/PALP, recebe comunicações de obstrução. Apenas leitura. [MOD-ADM-001; CNJ 308 art. 4º, II]
- **P04 — Órgão Colegiado:** Delibera sobre relatório anual. Acesso restrito ao relatório anual. [MOD-ADM-001; CNJ 308 art. 4º, I]
- **P05 — Gestor Unidade Auditada:** 1ª Linha de Defesa. Manifesta-se sobre achados, implementa recomendações. Escopo limitado à sua unidade. [MOD-ADM-001; CNJ 309 art. 53-54]
- **P06 — Gestor 2ª Linha:** Secretaria-Geral / Núcleo Controle Interno. Monitora recomendações. Visão consolidada. [MOD-ADM-001; Lei 18.561 art. 10-13]
- **P07 — Avaliador Externo:** Conduz avaliações PQAUD. Acesso temporário, somente leitura, escopo definido. [MOD-ADM-001; CNJ 309 art. 67]
- **P08 — Comitê SIAUD-Jud:** Propõe ações coordenadas, diretrizes. Leitura de indicadores. [MOD-ADM-001; CNJ 308 art. 15-18]
- **P09 — CPA:** Comissão Permanente de Auditoria. Aprova Ações Coordenadas. [MOD-ADM-001; CNJ 308 art. 13-14]
- **P10 — Administrador do Sistema:** Gestão técnica (usuários, perfis, configs, logs). Sem acesso a dados de auditoria. [MOD-ADM-001]

### Diretrizes de Permissão:

- O sistema aplica **menor privilégio**, **necessidade de conhecimento**, **segregação de funções** e **rastreabilidade obrigatória**. [MOD-ADM-001]
- O sistema impede conflitos: **auditor aprovar próprio trabalho**, **criador aprovar o próprio objeto**, **P10 acumular perfil de negócio**. [MOD-ADM-001]
- Acesso a documentos sigilosos condicionado ao perfil P01 ou autorização explícita do Auditor-Chefe. [MOD-SIG-001]

Matriz completa: `docs/business/specs/perfis_permissoes.md` (Seção 3).

---

## 3. Requisitos Funcionais por Módulo

### 3.1. MOD-ADM-001 — Administração e Segurança

Módulo fundacional. Gerencia usuários, 10 perfis, autenticação JWT + MFA (TOTP), RBAC, mandatos do Auditor-Chefe, configurações do sistema e logs de auditoria. [MOD-ADM-001]

**Funcionalidades:**
- **RF-ADM-001:** CRUD de usuários com dados funcionais (nome, email, matrícula, cargo, unidade). [MOD-ADM-001]
- **RF-ADM-002:** Gestão de 10 perfis com permissões granulares (recurso × ação). [MOD-ADM-001]
- **RF-ADM-003:** Atribuição de perfis com escopo de unidade para P05 e P06. [MOD-ADM-001]
- **RF-ADM-004:** Autenticação JWT (access + refresh token) com MFA via TOTP para P01, P02, P10. [MOD-ADM-001]
- **RF-ADM-005:** Controle de acesso RBAC com middleware de autorização em todos os endpoints. [MOD-ADM-001]
- **RF-ADM-006:** Gestão de mandatos do Auditor-Chefe (2 anos, máx. 6, interstício 1 ano). [CNJ 308 art. 6º]
- **RF-ADM-007:** Gestão de sessões com timeout de 30 min e refresh token de 8h. [MOD-ADM-001]
- **RF-ADM-008:** Configurações parametrizáveis (prazos, metas, períodos). 7 chaves padrão. [MOD-ADM-001]
- **RF-ADM-009:** Log de auditoria do sistema (login/logout, CRUD, permissões, acessos sigilosos). [MOD-ADM-001]
- **RF-ADM-010:** Central de notificações (prazos, aprovações pendentes, alertas). [MOD-ADM-001]

### 3.2. MOD-PLN-001 — Planejamento de Auditoria (PALP/PAA)

Gerencia o universo auditável, matriz de priorização (materialidade × relevância × criticidade × risco), PALP quadrienal, PAA anual, dimensionamento de força de trabalho e planejamento individual. [MOD-PLN-001; CNJ 309 arts. 31-41]

**Funcionalidades:**
- **RF-PLN-001:** Cadastro do universo de áreas/processos/temas auditáveis com notas de 1-5. [MOD-PLN-001]
- **RF-PLN-002:** Cálculo automático do índice de priorização e matriz ordenada. [MOD-PLN-001]
- **RF-PLN-003:** PALP quadrienal: criação, edição, versionamento e workflow de aprovação. [CNJ 309 art. 35]
- **RF-PLN-004:** PAA anual: criação, edição, versionamento com submissão até 30/nov. [CNJ 309 art. 36]
- **RF-PLN-005:** Dimensionamento: horas disponíveis × alocadas (auditoria, consultoria, capacitação). [MOD-PLN-001]
- **RF-PLN-006:** Planejamento individual: escopo, questões, testes, equipe, cronograma. [CNJ 309 art. 39]
- **RF-PLN-007:** Alertas de prazo: PAA (01/nov), PALP (último ano do quadriênio). [CNJ 309 art. 32]

### 3.3. MOD-EXE-001 — Execução de Auditoria

Gerencia a execução das auditorias: abertura, comunicado, programa, evidências, papéis de trabalho e requisições. Suporta 5 tipos (conformidade, operacional, financeira, gestão, especial) e 4 formas (direta, integrada, indireta, terceirizada). [MOD-EXE-001; CNJ 309 arts. 42-50]

**Funcionalidades:**
- **RF-EXE-001:** Abertura de auditoria a partir do PAA aprovado, com emissão de Comunicado. [CNJ 309 art. 30]
- **RF-EXE-002:** Programa de Auditoria: escopo, questões, testes, procedimentos, cronograma. [CNJ 309 art. 41-42]
- **RF-EXE-003:** Upload e catalogação de evidências com metadados (tipo, fonte, data). [CNJ 309 art. 48]
- **RF-EXE-004:** Papéis de trabalho: codificação, metodologia, verificações, referência a evidências. [CNJ 309 art. 43-44]
- **RF-EXE-005:** Requisições formais à unidade auditada com prazo e rastreamento. [CNJ 309 art. 46 §3º-§4º]
- **RF-EXE-006:** Registro de acessos, limitações e obstruções com notificação ao P01. [CNJ 309 art. 45 §2º]
- **RF-EXE-007:** Classificação por tipo e forma de execução. [CNJ 309 arts. 25-26]

### 3.4. MOD-ACH-001 — Achados e Resultados

Gerencia identificação, documentação e qualificação dos achados de auditoria com os 4 atributos obrigatórios (situação, critério, causa, efeito) e manifestações da unidade auditada. [MOD-ACH-001; CNJ 309 arts. 46-49]

**Funcionalidades:**
- **RF-ACH-001:** Registro de achado com 4 atributos e classificação positivo/negativo. [CNJ 309 art. 46]
- **RF-ACH-002:** Vinculação de achados às evidências de suporte. [MOD-ACH-001]
- **RF-ACH-003:** Envio à unidade auditada e coleta de manifestações (esclarecimento, justificativa, concordância, discordância). [CNJ 309 art. 53-54]
- **RF-ACH-004:** Consolidação após manifestação ou expiração de prazo (5 dias úteis). [CNJ 309 art. 54 §3º]
- **RF-ACH-005:** Quadro consolidado de achados da auditoria. [CNJ 309 art. 53]
- **RF-ACH-006:** Revisão e aprovação pelo auditor responsável. [CNJ 309 art. 49]

### 3.5. MOD-REL-001 — Relatórios e Monitoramento

Gerencia emissão de relatórios (preliminar e final), recomendações, monitoramento de implementação e Relatório Anual de Atividades. [MOD-REL-001; CNJ 309 arts. 51-57; CNJ 308 art. 5º]

**Funcionalidades:**
- **RF-REL-001:** Relatório Preliminar com achados para manifestação. [CNJ 309 art. 53]
- **RF-REL-002:** Relatório Final com achados consolidados e recomendações. [CNJ 309 art. 51]
- **RF-REL-003:** Recomendações com criticidade, prazo e responsável. [CNJ 309 art. 55]
- **RF-REL-004:** Monitoramento com status: Pendente → Em Andamento → Cumprida / Vencida. [CNJ 309 art. 56-57]
- **RF-REL-005:** Registro de providências pela unidade auditada. [CNJ 309 art. 54]
- **RF-REL-006:** Relatório Anual de Atividades para órgão colegiado (até julho). [CNJ 308 art. 5º]
- **RF-REL-007:** Alertas de prazos vencidos e escalonamento automático. [MOD-REL-001]
- **RF-REL-008:** Verificação de recomendações pendentes em auditorias subsequentes. [CNJ 309 art. 57 §2º]

### 3.6. MOD-CON-001 — Consultorias e Assessoramento

Gerencia serviços de consultoria prestados pela AUDIN: assessoramento, aconselhamento e treinamento, com vedação à cogestão. [MOD-CON-001; CNJ 309 arts. 58-61]

**Funcionalidades:**
- **RF-CON-001:** Solicitação de consultoria por unidades do TJCE. [MOD-CON-001]
- **RF-CON-002:** Análise de aceitação com verificação de horas disponíveis. [CNJ 309 art. 38 IV]
- **RF-CON-003:** Registro de consultoria realizada (tipo, escopo, horas, resultado). [MOD-CON-001]
- **RF-CON-004:** Termo de ciência de vedação à cogestão. [CNJ 309 art. 58]

### 3.7. MOD-QLD-001 — Qualidade e PQAUD

Instrumentaliza o Programa de Qualidade de Auditoria. [MOD-QLD-001; CNJ 309 arts. 62-68]

**Funcionalidades:**
- **RF-QLD-001:** Monitoramento contínuo (feedback, revisões, métricas). [CNJ 309 art. 65]
- **RF-QLD-002:** Autoavaliações periódicas. [CNJ 309 art. 66]
- **RF-QLD-003:** Avaliações externas independentes/recíprocas. [CNJ 309 art. 67]
- **RF-QLD-004:** Não conformidades com planos de ação corretiva. [MOD-QLD-001]
- **RF-QLD-005:** Indicadores de qualidade com homologação pelo P01. [CNJ 309 art. 68]

### 3.8. MOD-RIS-001 — Gestão de Riscos da AUDIN

Gerencia riscos da própria unidade de auditoria conforme ISO 31000 e Manual de Gestão de Riscos da AUDIN (2020). [MOD-RIS-001]

**Funcionalidades:**
- **RF-RIS-001:** Contexto organizacional e critérios de risco. [MOD-RIS-001]
- **RF-RIS-002:** Cadastro de riscos (causa, evento, consequência, probabilidade 1-5, impacto 1-5). [MOD-RIS-001]
- **RF-RIS-003:** Nível calculado (Baixo, Médio, Alto, Crítico) e matriz de riscos. [MOD-RIS-001]
- **RF-RIS-004:** Estratégia de tratamento (Evitar, Mitigar, Transferir, Aceitar) com plano de ação. [MOD-RIS-001]

### 3.9. MOD-CAP-001 — Competências e PAC-Aud

Gerencia competências, lacunas de conhecimento e Plano Anual de Capacitação. Meta: 40h/ano por servidor. [MOD-CAP-001; CNJ 309 arts. 69-73]

**Funcionalidades:**
- **RF-CAP-001:** Mapa de competências técnicas e gerenciais. [MOD-CAP-001]
- **RF-CAP-002:** Identificação de lacunas por auditor. [MOD-CAP-001]
- **RF-CAP-003:** PAC-Aud vinculado ao PAA. [CNJ 309 art. 70]
- **RF-CAP-004:** Registro de capacitações (curso, instituição, carga horária, certificado). [MOD-CAP-001]
- **RF-CAP-005:** Totalização de horas por auditor/ano com alerta da meta de 40h. [CNJ 309 art. 72]

### 3.10. MOD-ETI-001 — Ética e Independência

Gerencia declarações de independência, impedimentos e confidencialidade. [MOD-ETI-001; CNJ 309 arts. 3-15]

**Funcionalidades:**
- **RF-ETI-001:** Declaração anual de independência. [MOD-ETI-001]
- **RF-ETI-002:** Impedimentos (vedação de auditar operações dos últimos 12 meses). [CNJ 309 art. 15]
- **RF-ETI-003:** Verificação automática de conflitos na designação de equipe. [MOD-ETI-001]
- **RF-ETI-004:** Termo de confidencialidade. [CNJ 309 art. 77 § único]
- **RF-ETI-005:** Código de Ética versionado. [MOD-ETI-001]

### 3.11. MOD-GOV-001 — Governança, Transparência e Fraudes

Gerencia governança, transparência ativa e prevenção de fraudes. [MOD-GOV-001; CNJ 308 art. 5º; CNJ 309 art. 13]

**Funcionalidades:**
- **RF-GOV-001:** Publicação de relatórios no portal de transparência. [CNJ 308 art. 5º §3º]
- **RF-GOV-002:** Integração com Ouvidoria para planejamento. [CNJ 309 art. 34 §3º]
- **RF-GOV-003:** Determinações TCE/CNJ com controle de prazos. [MOD-GOV-001]
- **RF-GOV-004:** Documentação de indícios de fraude. [MOD-GOV-001]
- **RF-GOV-005:** Workflow de comunicação: superior → 60 dias → TCE. [CNJ 309 art. 13]

### 3.12-3.15: Demais Módulos

**MOD-BIB-001 — Biblioteca Metodológica:** Catálogo de normas, manuais, templates com versionamento e busca. [CNJ 309 art. 17]

**MOD-SIG-001 — Sigilo e Classificação:** Classificação Público/Interno/Restrito/Sigiloso, controle de acesso, auditorias sigilosas, trilha de acesso. [CNJ 309 arts. 11, 50]

**MOD-DSH-001 — Dashboards e BI:** Painéis do PAA, execução, recomendações, qualidade, força de trabalho. Exportação PDF/XLSX. [CNJ 309 art. 75]

**MOD-INT-001 — Integrações:** Catálogo de 9 integrações (Ouvidoria, Portal Transparência, SIAUD-Jud, TCE-CE, sistemas corporativos). Ações Coordenadas. [CNJ 308 arts. 9-14; CNJ 309 art. 34]

---

## 4. Regras de Negócio Críticas (Top 20)

**RN-ADM-001:** Senha: mín. 8 caracteres, complexidade, expiração 90 dias. [MOD-ADM-001]
**RN-ADM-003:** Segregação: P01 não acumula perfis; P02 ≠ P05 mesma unidade; P10 sem perfil de negócio. [MOD-ADM-001]
**RN-ADM-004:** Mandato Auditor-Chefe: 2 anos, máx. 2 reconduções (6 anos). Destituição só por colegiado. [CNJ 308 art. 6º]
**RN-ADM-005:** Vedação: condenados TCE, PAD ou improbidade não podem ser Auditores. [CNJ 308 art. 7º]
**RN-PLN-001:** PAA submetido até 30/nov. Alerta em 01/nov. [CNJ 309 art. 32]
**RN-PLN-004:** PAA não aprovado se horas alocadas > horas disponíveis. [MOD-PLN-001]
**RN-EXE-001:** Auditoria só abre para PAA aprovado. [MOD-EXE-001]
**RN-EXE-003:** Papéis de trabalho retidos por 10 anos. [CNJ 309 art. 44]
**RN-ACH-001:** Achado exige 4 atributos: situação, critério, causa, efeito. [CNJ 309 art. 46]
**RN-ACH-003:** Prazo mínimo 5 dias úteis para manifestação. [CNJ 309 art. 54 §3º]
**RN-REL-001:** Relatório Anual ao colegiado até julho. [CNJ 308 art. 5º]
**RN-REL-002:** Ausência de manifestação não obsta Relatório Final. [CNJ 309 art. 54 §4º]
**RN-REL-003:** Priorizar correção de problemas graves. [CNJ 309 art. 57 §1º]
**RN-CON-001:** Vedação à cogestão em consultorias. [CNJ 309 art. 20]
**RN-QLD-001:** PQAUD obrigatório. [CNJ 309 art. 62]
**RN-ETI-001:** Impedimento de 12 meses para auditar operações anteriores. [CNJ 309 art. 15]
**RN-GOV-002:** Fraudes: superior → 60 dias → TCE. [CNJ 309 art. 13]
**RN-CAP-001:** Meta 40h/ano capacitação por auditor. [CNJ 309 art. 72]
**RN-SIG-002:** Auditorias sigilosas: consulta ao Presidente. [CNJ 309 art. 50]
**RN-INT-001:** Ações Coordenadas CPA são obrigatórias. [CNJ 308 art. 14]

Total: **43 regras de negócio** documentadas em `docs/business/specs/regras_negocio.md`.

---

## 5. Requisitos Não Funcionais e Técnicos

### 5.1. Arquitetura e Plataforma

- Plataforma **web corporativa**, API-first, arquitetura modular com 15 módulos independentes (RNF-MANU-001). [Inferido]
- APIs RESTful documentadas em OpenAPI 3.x para integração (RNF-INTE-001). [Inferido]
- Suporte a conteinerização para deploy on-premises no TJCE (RNF-MANU-002). [Inferido]
- Segregação de ambientes: dev, hom, prod (RNF-MANU-004). [Inferido]

### 5.2. Performance

- Listagens: p95 < 500ms (RNF-PERF-001). [Inferido]
- Matriz de priorização: p95 < 2s (RNF-PERF-002). [MOD-PLN-001]
- Painel de monitoramento: p95 < 2s (RNF-PERF-003). [MOD-REL-001]
- Upload de evidências: até 25MB, p95 < 3s (RNF-PERF-005). [MOD-EXE-001]

### 5.3. Disponibilidade

- Uptime: 99,5% em horário comercial (RNF-DISP-001). [MOD-PLN-001]
- RTO: < 4h | RPO: < 1h (RNF-DISP-005/006). [Inferido]
- Backup diário incremental, semanal completo (RNF-DISP-004). [Inferido]

### 5.4. Segurança

- Autenticação JWT + MFA (TOTP) para P01, P02, P10 (RNF-SEGF-001/003). [MOD-ADM-001]
- Senhas: 8+ caracteres, complexidade, expiração 90 dias, histórico 5 (RNF-SEGF-011). [MOD-ADM-001]
- Sessão: timeout 30 min, refresh 8h (RNF-SEGF-012). [MOD-ADM-001]
- Bloqueio após 5 tentativas de login (RNF-SEGF-013). [Inferido]
- TLS 1.3, AES-256 em repouso (RNF-SEGF-007/008). [Inferido]
- Classificação: Público, Interno, Restrito, Sigiloso (RNF-SEGF-006). [MOD-SIG-001]
- OWASP ASVS + Top 10 (RNF-SEGF-009/013). [Inferido]
- LGPD (RNF-CONF-001). [MOD-SIG-001]
- Credenciais de integração em vault (RNF-SEGF-014). [MOD-INT-001]

### 5.5. Auditoria, Versionamento e Confiabilidade

- Toda operação relevante gera log com: data/hora, usuário, IP, operação, entidade, ID (RNF-AUDI-001). [Múltiplos módulos]
- Logs imutáveis, append-only (RNF-AUDI-002). [Inferido]
- Retenção: 10 anos (RNF-AUDI-003). [CNJ 309 art. 44]
- Soft delete em todas as entidades (RNF-AUDI-004). [Inferido]
- Trilha de decisões vinculada a objeto e agente (RNF-AUDI-005). [Múltiplos módulos]
- Versionamento nativo: planos, relatórios, documentos metodológicos (RNF-MANU-003). [Módulos]

### 5.6. Usabilidade e Conformidade

- Interface responsiva, WCAG 2.1 AA / e-MAG (RNF-USAB-001/002). [Inferido]
- PT-BR (RNF-USAB-003). [Especificação]
- Navegação orientada por processo (RNF-USAB-004). [Inferido]
- Sistema de notificações e alertas por perfil (RNF-USAB-005). [MOD-ADM-001]

### 5.7. Testes

- Cobertura: ≥ 80% unitários, ≥ 70% integração, E2E para fluxos críticos (RNF-MANU-005). [Todos os módulos]

### 5.8. Saída e Interoperabilidade

- Exportação: PDF, XLSX (RNF-COMP-003). [Módulos]
- Integrações: Ouvidoria, Portal Transparência, SIAUD-Jud, TCE (RNF-INTE-002/004). [MOD-INT-001]
- Timeout integrações: 30s, retry 3× backoff, circuit breaker (RNF-INTE-007). [MOD-INT-001]

**Total: 60 RNFs** em `docs/business/specs/requisitos_nao_funcionais.md`.

---

## 6. Workflows (10 fluxos, 38 estados, 34 transições)

| WF | Entidade | Estados | Transições | Módulo |
|----|----------|---------|------------|--------|
| WF-001 | PlanoAuditoria | 5 | 5 | MOD-PLN-001 |
| WF-002 | Auditoria | 4 | 4 | MOD-EXE-001 |
| WF-003 | AchadoAuditoria | 3 | 3 | MOD-ACH-001 |
| WF-004 | Recomendacao | 5 | 5 | MOD-REL-001 |
| WF-005 | RelatorioAuditoria | 4 | 3 | MOD-REL-001 |
| WF-006 | SolicitacaoConsultoria | 4 | 3 | MOD-CON-001 |
| WF-007 | NaoConformidade | 3 | 2 | MOD-QLD-001 |
| WF-008 | Risco | 3 | 3 | MOD-RIS-001 |
| WF-009 | AcaoCoordenada | 4 | 3 | MOD-INT-001 |
| WF-010 | UsuarioPerfil | 3 | 3 | MOD-ADM-001 |

Diagramas Mermaid completos em `docs/business/specs/workflows_bpmn.md`.

---

## 7. Glossário Técnico (Principais Siglas)

| Sigla | Significado | Fonte |
|-------|-------------|-------|
| AUDIN | Secretaria de Auditoria Interna do TJCE | Institucional |
| SIAUD-Jud | Sistema de Auditoria Interna do Poder Judiciário | CNJ 308/2020 |
| DIRAUD-Jud | Diretrizes Técnicas das Atividades de Auditoria Interna Governamental | CNJ 309/2020 |
| PALP | Plano de Auditoria de Longo Prazo (quadrienal) | CNJ 309/2020 art. 35 |
| PAA | Plano Anual de Auditoria | CNJ 309/2020 art. 36 |
| PAC-Aud | Plano Anual de Capacitação de Auditoria | CNJ 309/2020 art. 69 |
| PQAUD | Programa de Qualidade de Auditoria | CNJ 309/2020 art. 62 |
| CPA | Comissão Permanente de Auditoria | CNJ 308/2020 art. 13 |
| RBIA | Risk-Based Internal Auditing | IIA |
| RBAC | Role-Based Access Control | — |
| ABAC | Attribute-Based Access Control | — |
| SoD | Segregation of Duties | — |
| MFA | Multi-Factor Authentication | — |
| TOTP | Time-based One-Time Password | — |
| JWT | JSON Web Token | — |
| RTO | Recovery Time Objective | — |
| RPO | Recovery Point Objective | — |
| DoD | Definition of Done | — |
| WCAG | Web Content Accessibility Guidelines | W3C |
| e-MAG | Modelo de Acessibilidade em Governo Eletrônico | Governo Federal |

---

## 8. Consideração Final

Este PRD Técnico consolida a especificação completa do CONFORMITAS 3.0 como **plataforma integrada de Auditoria Interna, Gestão de Riscos, Monitoramento, Qualidade e Governança baseada em dados, risco e efetividade**. A documentação cobre 15 módulos, 75 requisitos funcionais, 43 regras de negócio, 60 requisitos não funcionais, 10 perfis de acesso e 10 workflows com 34 transições, todos com rastreabilidade normativa à Lei 18.561/2023 e às Resoluções CNJ 308/2020 e 309/2020.

---

**Status:** Aguardando validação (Gate 3)
