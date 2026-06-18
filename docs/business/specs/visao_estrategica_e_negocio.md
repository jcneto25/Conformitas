# CONFORMITAS (SGI)
## VOLUME I – VISÃO ESTRATÉGICA E NEGÓCIO

**Versão:** 1.1
**Data:** 16/06/2026
**Órgão/Unidade Demandante:** Tribunal de Justiça do Estado do Ceará (TJCE) — Secretaria de Auditoria Interna (AUDIN)
**Responsável pelo Documento:** Gerado por IA a partir dos documentos de ingestão / Revisado após Gate 1

---

## 1. INTRODUÇÃO

### 1.1 Objetivo do Documento
Este documento estabelece a visão estratégica, o escopo funcional, os objetivos institucionais, os princípios de negócio e a arquitetura conceitual do **CONFORMITAS (SGI — Sistema de Gestão de Auditoria Interna)**, destinado à **Secretaria de Auditoria Interna do Tribunal de Justiça do Estado do Ceará (AUDIN/TJCE)**.

O documento servirá como referência para:
- Product Requirements Document (PRD);
- Modelagem de processos;
- Modelagem de dados;
- Arquitetura de software;
- Desenvolvimento da solução;
- Governança do produto.

### 1.2 Objetivo do Sistema
Disponibilizar uma plataforma corporativa integrada para **gestão do ciclo completo de auditoria interna governamental**, desde o planejamento estratégico até o monitoramento de recomendações, passando pela execução de auditorias, gestão de achados e resultados, consultorias, gestão de riscos e avaliação da qualidade.

O sistema deverá apoiar a AUDIN no cumprimento de sua missão institucional como **3ª Linha de Defesa do Sistema de Controle Interno do Poder Judiciário do Estado do Ceará**, conforme a Lei Estadual n.° 18.561/2023 e as Resoluções CNJ n.° 308/2020 e 309/2020 (DIRAUD-Jud).

### 1.3 Escopo
O sistema abrangerá integralmente:

#### Planejamento de Auditoria
- Plano de Auditoria de Longo Prazo (PALP) quadrienal
- Plano Anual de Auditoria (PAA) baseado em riscos
- Matriz de priorização por materialidade, relevância, criticidade e risco
- Dimensionamento da força de trabalho
- Planejamento individual de cada auditoria (escopo, equipe, cronograma, questões de auditoria, testes)

#### Execução das Auditorias
- Abertura de auditorias e comunicado à unidade auditada
- Execução de testes e procedimentos conforme programa de auditoria
- Registro de evidências, papéis de trabalho e achados (positivos e negativos)
- Classificação das auditorias: conformidade/compliance, operacional/desempenho, financeira/contábil, gestão, especial
- Formas de execução: direta, integrada/compartilhada, indireta, terceirizada

#### Achados e Resultados
- Identificação, documentação e qualificação de achados de auditoria (situação, critério, causa, efeito)
- Manifestações da unidade auditada sobre achados preliminares
- Emissão de relatórios preliminares e finais
- Recomendações e planos de ação corretiva

#### Relatórios e Monitoramento
- Relatório Final de Auditoria com recomendações
- Acompanhamento da implementação de recomendações (follow-up)
- Relatório Anual de Atividades da AUDIN para o órgão colegiado
- Monitoramento contínuo da efetividade das ações corretivas

#### Consultorias, Avaliações e Serviços de Assessoramento
- Atividades de assessoramento e aconselhamento (sob demanda)
- Treinamento e capacitação (disseminação de conhecimento)
- Consultorias em governança, gerenciamento de riscos e controles internos

#### Qualidade (PQAUD)
- Programa de Qualidade de Auditoria (avaliações internas e externas)
- Monitoramento contínuo de qualidade
- Autoavaliações periódicas
- Avaliações externas independentes
- Métricas de desempenho e melhoria contínua

#### Gestão de Riscos da AUDIN
- Estabelecimento de contexto organizacional
- Identificação, análise e avaliação de riscos
- Matriz de riscos (probabilidade × impacto)
- Tratamento de riscos e planos de resposta
- Comunicação e monitoramento de riscos
- Melhoria contínua do processo de gestão de riscos

#### Competências e Capacitação (PAC-Aud)
- Plano Anual de Capacitação de Auditoria (PAC-Aud)
- Mapeamento de competências e lacunas de conhecimento
- Gestão de treinamentos e certificações profissionais
- Registro de horas de capacitação (mínimo 40h/ano por servidor)
- Disseminação interna de conhecimento

#### Ética e Independência
- Código de Ética da unidade de auditoria interna
- Declaração de independência e impedimentos
- Controle de conflitos de interesse
- Termo de confidencialidade

#### Governança, Transparência e Fraudes
- Relatório anual ao órgão colegiado competente
- Publicação de relatórios na internet (transparência ativa)
- Canal de comunicação com ouvidorias e órgãos de controle externo
- Identificação e reporte de riscos de fraude
- Apoio ao Tribunal de Contas do Estado e CNJ

#### Biblioteca Metodológica
- Catálogo de normas, manuais e procedimentos de auditoria
- Modelos de documentos, templates e checklists
- Registro e versionamento de metodologias

#### Sigilo e Classificação da Informação
- Tratamento de informações sensíveis e confidenciais
- Classificação de documentos (público, interno, restrito, sigiloso)
- Controle de acesso por perfil
- Trilhas de auditoria e rastreabilidade

#### Dashboards e Business Intelligence
- Painéis de acompanhamento de auditorias (PAA, execução, resultados)
- Indicadores estratégicos de desempenho da AUDIN
- Visualização de riscos e recomendações
- Relatórios gerenciais e BI

#### Integrações
- Sistemas corporativos do TJCE (orçamento, financeiro, pessoal, patrimônio)
- Sistemas de ouvidoria e denúncias
- Órgãos de controle externo (TCE, CNJ)
- Bases de dados institucionais e banco de dados de auditoria

#### Administração e Segurança
- Gestão de usuários, perfis e permissões (RBAC/ABAC)
- Controle de acesso e autenticação
- Configurações gerais do sistema

### 1.4 Público-Alvo
O sistema será utilizado por **10 perfis de acesso**:

#### Internamente (AUDIN — 3ª Linha de Defesa)
- **Auditor-Chefe / Titular da Unidade de Auditoria Interna (P01)** — supervisiona todas as atividades, aprova planos e relatórios
- **Auditores (P02)** — servidores efetivos e comissionados que executam auditorias
- **Analistas e Técnicos Judiciários** lotados na AUDIN
- **Estagiários e equipe de apoio administrativo**

#### Demais unidades do TJCE
- **Presidente do TJCE (P03)** — aprova PAA/PALP, recebe comunicações de obstrução
- **Órgão Colegiado Competente (P04)** — delibera sobre relatório anual da AUDIN
- **Gestores de Unidades Auditadas (P05)** — 1ª Linha de Defesa, manifestam-se sobre achados
- **Gestores de 2ª Linha (P06)** — Secretaria-Geral Administrativa / Núcleo de Controle Interno, monitoram implementação de recomendações

#### Órgãos de Controle Externo e Avaliadores
- **Avaliador Externo (P07)** — acesso temporário para avaliações do PQAUD
- **Comitê SIAUD-Jud (P08)** — membros do Comitê de Governança e Coordenação
- **Comissão Permanente de Auditoria — CPA (P09)** — conselheiros do CNJ

#### Administração Técnica
- **Administrador do Sistema (P10)** — gestão técnica da plataforma, sem acesso a dados de auditoria

### 1.5 Benefícios Esperados

#### Institucionais
- Fortalecimento da governança institucional do TJCE;
- Conformidade com a Lei Estadual 18.561/2023 e Resoluções CNJ 308/2020 e 309/2020;
- Integração ao Sistema de Auditoria Interna do Poder Judiciário (SIAUD-Jud);
- Aumento da transparência e prestação de contas à sociedade.

#### Operacionais
- Padronização dos processos de auditoria conforme DIRAUD-Jud;
- Eliminação de controles paralelos e planilhas manuais;
- Rastreabilidade completa do ciclo de auditoria (planejamento → execução → achados → recomendações → monitoramento);
- Redução do tempo de elaboração do PAA e PALP com metodologia automatizada de priorização.

#### Estratégicos
- Auditoria baseada em riscos (risk-based auditing);
- Melhoria contínua apoiada por indicadores e métricas de qualidade (PQAUD);
- Tomada de decisão baseada em dados e dashboards de BI;
- Aumento da efetividade das recomendações de auditoria com monitoramento estruturado.

### 1.6 Premissas
- Existência da Secretaria de Auditoria Interna do TJCE constituída nos termos da Lei 18.561/2023.
- Vigência das Resoluções CNJ n.° 308/2020 e n.° 309/2020 (DIRAUD-Jud).
- Disponibilidade de infraestrutura tecnológica corporativa do TJCE para hospedagem da solução.
- Existência de corpo funcional habilitado em técnicas de auditoria governamental.
- Adoção do Modelo das Três Linhas de Defesa do IIA.

### 1.7 Restrições
- Observância obrigatória da Lei 18.561/2023 (Sistema de Controle Interno do TJCE).
- Observância das Resoluções CNJ 308/2020 (SIAUD-Jud) e 309/2020 (DIRAUD-Jud).
- Respeito aos níveis de sigilo e segurança da informação conforme Lei 13.709 (LGPD).
- Observância do Código de Ética da AUDIN e do Estatuto de Auditoria Interna.
- Limitações orçamentárias e de recursos humanos próprios do TJCE.
- Vedação legal à participação da AUDIN em atividades de cogestão (art. 20, DIRAUD-Jud).

### 1.8 Glossário

#### Auditoria Interna
Atividade independente e objetiva de avaliação (assurance) e consultoria, com o objetivo de adicionar valor e melhorar as operações da organização, mediante avaliação da eficácia dos processos de gerenciamento de riscos, controles internos e governança (CNJ 308/2020, art. 2º).

#### Achado de Auditoria
Fato significativo, digno de relato pelo auditor, constituído de quatro atributos essenciais: situação encontrada, critério, causa e efeito (CNJ 309/2020, art. 46).

#### Três Linhas de Defesa
Modelo de gerenciamento de riscos em três camadas: 1ª linha (controles primários pelos gestores), 2ª linha (supervisão e conformidade) e 3ª linha (auditoria interna independente) (Lei 18.561/2023, art. 2º, II).

#### PAA — Plano Anual de Auditoria
Plano que identifica as auditorias a serem realizadas pela unidade de auditoria interna em um exercício, preferencialmente baseado em riscos (CNJ 309/2020, art. 36).

#### PALP — Plano de Auditoria de Longo Prazo
Plano quadrienal que define, orienta e planeja as ações de auditoria a serem desenvolvidas (CNJ 309/2020, art. 35).

#### PAC-Aud — Plano Anual de Capacitação de Auditoria
Plano para desenvolver competências técnicas e gerenciais necessárias à formação de auditores (CNJ 309/2020, art. 69).

#### PQAUD — Programa de Qualidade de Auditoria
Programa que contempla toda a atividade de auditoria interna, desde o planejamento até o monitoramento das recomendações, com avaliações internas e externas (CNJ 309/2020, arts. 62-68).

#### SIAUD-Jud — Sistema de Auditoria Interna do Poder Judiciário
Sistema que organiza o processo de auditoria em âmbito nacional, uniformizando procedimentos e definindo diretrizes para a atividade de auditoria interna do Poder Judiciário (CNJ 308/2020, art. 9º).

#### DIRAUD-Jud — Diretrizes Técnicas das Atividades de Auditoria Interna Governamental do Poder Judiciário
Normativo que estabelece princípios, conceitos e requisitos fundamentais para a prática profissional da atividade de auditoria interna no Poder Judiciário (CNJ 309/2020).

### 1.9 Acrônimos

| Sigla | Descrição |
|---|---|
| AUDIN | Secretaria de Auditoria Interna do TJCE |
| TJCE | Tribunal de Justiça do Estado do Ceará |
| CNJ | Conselho Nacional de Justiça |
| TCE | Tribunal de Contas do Estado do Ceará |
| IIA | The Institute of Internal Auditors |
| IPPF | International Professional Practices Framework |
| SIAUD-Jud | Sistema de Auditoria Interna do Poder Judiciário |
| DIRAUD-Jud | Diretrizes Técnicas das Atividades de Auditoria Interna Governamental do Poder Judiciário |
| PAA | Plano Anual de Auditoria |
| PALP | Plano de Auditoria de Longo Prazo |
| PAC-Aud | Plano Anual de Capacitação de Auditoria |
| PQAUD | Programa de Qualidade de Auditoria |
| RBAC | Role-Based Access Control |
| ABAC | Attribute-Based Access Control |
| BI | Business Intelligence |
| DoD | Definition of Done |

---

## 2. REFERENCIAL NORMATIVO

### 2.1 Lei Estadual n.° 18.561/2023
Cria o Sistema de Controle Interno do Poder Judiciário do Estado do Ceará e institui normas técnicas para sua atuação. Define o Modelo das Três Linhas de Defesa, estabelece a estrutura de controle interno nas secretarias do TJCE e formaliza a Secretaria de Auditoria Interna como 3ª Linha de Defesa.

### 2.2 Resolução CNJ n.° 308/2020
Organiza as atividades de auditoria interna do Poder Judiciário sob a forma de sistema (SIAUD-Jud), cria a Comissão Permanente de Auditoria e estabelece a obrigatoriedade de unidade de auditoria interna em todos os tribunais sujeitos ao controle do CNJ.

### 2.3 Resolução CNJ n.° 309/2020 (DIRAUD-Jud)
Aprova as Diretrizes Técnicas das Atividades de Auditoria Interna Governamental do Poder Judiciário. Define princípios éticos, classificação das auditorias, planejamento (PALP/PAA), execução, comunicação de resultados, monitoramento, consultoria, qualidade (PQAUD) e capacitação (PAC-Aud).

### 2.4 Resolução do Órgão Especial TJCE n.° 23/2023
Dispõe sobre a estrutura e o funcionamento da Secretaria de Auditoria Interna do TJCE em conformidade com as Resoluções CNJ.

### 2.5 Manual de Auditoria Interna do TJCE (4ª Edição, 2022)
Manual de procedimentos de auditoria interna do TJCE, detalhando o processo completo de auditoria conforme normas do IIA, INTOSAI e DIRAUD-Jud.

### 2.6 Programa de Qualidade de Auditoria (PQAUD) — TJCE
Documento que estabelece o programa de qualidade da atividade de auditoria interna do TJCE, com avaliações internas (monitoramento contínuo e autoavaliações) e externas.

### 2.7 Manual de Gestão de Riscos da AUDIN (2020)
Manual que define o processo de gestão de riscos da unidade de auditoria interna, com base na ISO 31000 e no COSO, abrangendo estabelecimento de contexto, identificação, análise, avaliação, tratamento, comunicação e monitoramento.

### 2.8 Metodologia PAA e PALP (2021)
Documento metodológico que define os critérios para elaboração do Plano Anual de Auditoria e do Plano de Auditoria de Longo Prazo, incluindo matriz de priorização (materialidade, relevância, criticidade e risco).

### 2.9 Constituição Federal — Art. 70 e 74
Estabelece a fiscalização contábil, financeira, orçamentária, operacional e patrimonial e define o sistema de controle interno dos Poderes.

### 2.10 Normas Internacionais IIA / IPPF
International Professional Practices Framework, incluindo o Código de Ética, Normas Internacionais para a Prática Profissional de Auditoria Interna e Guias Práticos do IIA.

### 2.11 ISO 31000 — Gestão de Riscos
Norma internacional que estabelece princípios e diretrizes para a gestão de riscos organizacionais, adotada como referência pelo Manual de Gestão de Riscos da AUDIN.

---

## 3. ARQUITETURA DE NEGÓCIO

### 3.1 Visão Geral
O sistema deverá suportar o ciclo completo de **auditoria interna governamental baseada em riscos**, desde o planejamento estratégico (PALP/PAA) até o monitoramento de recomendações e avaliação da qualidade (PQAUD), em conformidade com as Diretrizes Técnicas da DIRAUD-Jud.

### 3.2 Modelo Operacional / Modelo de Governança

#### 3ª Linha de Defesa (AUDIN)
Atividade de auditoria interna governamental, com autonomia técnica e objetividade. Avalia a eficácia da governança, do gerenciamento de riscos e dos controles internos das 1ª e 2ª linhas.

#### 2ª Linha de Defesa (Secretaria-Geral Administrativa)
Funções de suporte ao gerenciamento de riscos e conformidade. Monitora a 1ª linha, fornece orientações e reporta questões relacionadas a riscos. O Núcleo de Controle Interno da Gestão apoia esta linha.

#### 1ª Linha de Defesa (Unidades Administrativas)
Controles primários executados pelos gestores durante as atividades operacionais. Implementam e mantêm controles internos, identificam e mitigam riscos.

#### Órgãos de Governança Superior
- Presidente do TJCE (reporte administrativo da AUDIN)
- Órgão colegiado competente do TJCE (reporte funcional da AUDIN)
- CNJ / SIAUD-Jud (orientação técnica normativa)
- TCE (controle externo)

O sistema deverá permitir o registro e a rastreabilidade das interações entre AUDIN, unidades auditadas, órgãos de governança e controle externo.

### 3.3 Cadeia de Valor / Fluxo de Valor
Gestão de Riscos →  
Planejamento (PALP/PAA) →  
Programação de Auditoria →  
Execução (comunicação → testes → evidências) →  
Achados e Resultados →  
Relatórios e Recomendações →  
Monitoramento (follow-up) →  
Qualidade e Melhoria Contínua (PQAUD) →  
Aprendizado Institucional

### 3.4 Macroprocessos da AUDIN

#### Planejamento Estratégico e Operacional
Define o PALP quadrienal, o PAA anual e o planejamento individual de cada auditoria, com priorização baseada em riscos (materialidade, relevância, criticidade) e dimensionamento da força de trabalho.

#### Execução de Auditorias
Realiza auditorias de conformidade, operacionais, financeiras, de gestão e especiais, executando testes, coletando evidências e registrando achados conforme a DIRAUD-Jud.

#### Gestão de Achados e Resultados
Documenta achados, coleta manifestações das unidades auditadas, emite relatórios preliminares e finais, e formula recomendações.

#### Monitoramento e Follow-up
Acompanha a implementação de recomendações, gerencia prazos de resposta, escala pendências e produz relatórios de acompanhamento.

#### Consultorias e Assessoramento
Presta serviços de aconselhamento, orientação, treinamento e capacitação às unidades do TJCE, sem exercer atividades de cogestão.

#### Qualidade e Melhoria Contínua
Executa o PQAUD com avaliações internas (monitoramento contínuo, autoavaliações) e externas, medindo desempenho e promovendo melhoria.

### 3.5 Capacidades de Negócio

#### Gestão da Carteira de Auditorias
Capacidade de planejar e priorizar auditorias com base em critérios objetivos de risco, mantendo visibilidade do portfólio completo (PALP e PAA).

#### Execução Metodológica de Auditoria
Capacidade de conduzir auditorias seguindo metodologia padronizada (DIRAUD-Jud), com rastreabilidade completa de evidências e achados.

#### Comunicação Estruturada com Unidades Auditadas
Capacidade de emitir comunicados, solicitar informações, receber manifestações e reportar resultados de forma formal e rastreável.

#### Monitoramento de Recomendações
Capacidade de acompanhar sistematicamente a implementação de recomendações, com alertas de prazos, escalonamento e métricas de efetividade.

#### Autocontrole da Qualidade
Capacidade de autoavaliar a qualidade dos trabalhos de auditoria, conduzir avaliações externas e implementar melhorias contínuas.

#### Gestão do Conhecimento
Capacidade de armazenar, recuperar e reaproveitar informações institucionais relevantes (biblioteca metodológica, jurisprudência de auditoria, lições aprendidas).

### 3.6 Princípios Norteadores

#### Conformidade Normativa
Toda funcionalidade do sistema deve estar alinhada à Lei 18.561/2023 e às Resoluções CNJ 308/2020 e 309/2020. O sistema é instrumento de conformidade, não de exceção.

#### Independência e Segregação de Funções
O sistema deve reforçar a independência da AUDIN como 3ª Linha de Defesa, não permitindo que auditores exerçam atividades de cogestão.

#### Rastreabilidade
Toda ação relevante no sistema deverá possuir histórico verificável. O sistema é fonte primária de evidências de auditoria.

#### Transparência Ativa
Relatórios e resultados devem ser publicáveis conforme a política de transparência do TJCE e as exigências do CNJ.

#### Segurança e Sigilo
Informações sensíveis, confidenciais ou sigilosas devem ser tratadas com controles de acesso rigorosos, respeitando a LGPD e o Código de Ética da AUDIN.

#### Eficiência Operacional
O sistema deve automatizar processos repetitivos (cálculo de priorização, alertas de prazos, consolidação de relatórios), liberando os auditores para atividades de julgamento profissional.

#### Melhoria Contínua
O sistema deve suportar o ciclo PDCA da qualidade de auditoria, com métricas, indicadores e feedback estruturado.

### 3.7 Objetivos Estratégicos do Sistema

#### OE-01
Padronizar o fluxo completo de auditoria interna conforme a DIRAUD-Jud (CNJ 309/2020).

#### OE-02
Automatizar o planejamento baseado em riscos (PALP e PAA) com metodologia de priorização (materialidade, relevância, criticidade, risco).

#### OE-03
Garantir rastreabilidade integral do ciclo de auditoria (planejamento → execução → achados → recomendações → monitoramento).

#### OE-04
Instrumentalizar o Programa de Qualidade de Auditoria (PQAUD) com avaliações, indicadores e planos de melhoria.

#### OE-05
Ampliar a transparência institucional com publicação de relatórios e indicadores de desempenho da AUDIN.

#### OE-06
Integrar a gestão de riscos da AUDIN ao processo de planejamento de auditorias.

#### OE-07
Suportar a gestão de competências e o Plano Anual de Capacitação (PAC-Aud).

#### OE-08
Oferecer dashboards gerenciais e BI para tomada de decisão baseada em dados.

### 3.8 Indicadores Estratégicos

#### Planejamento
- Percentual de execução do PAA (auditorias realizadas / auditorias planejadas)
- Tempo médio de elaboração do PAA
- Cobertura do universo de processos auditáveis

#### Execução
- Tempo médio de duração das auditorias
- Percentual de auditorias concluídas no prazo
- Volume de achados por auditoria

#### Qualidade
- Índice de conformidade com o PQAUD
- Nota em avaliações externas de qualidade
- Percentual de recomendações de melhoria interna implementadas

#### Monitoramento
- Taxa de implementação de recomendações
- Tempo médio de resposta a recomendações
- Percentual de recomendações vencidas

#### Transparência e Governança
- Tempestividade na publicação de relatórios
- Percentual de relatórios anuais publicados no prazo

#### Capacitação
- Horas médias de capacitação por auditor/ano
- Percentual de lacunas de competência cobertas

---

## 4. VISÃO MACRO DA SOLUÇÃO

### 4.1 Domínios Funcionais
- Administração e Segurança (10 perfis, RBAC, autenticação)
- Planejamento de Auditoria (PALP/PAA)
- Execução de Auditoria
- Achados e Resultados
- Relatórios e Monitoramento
- Consultorias e Assessoramento
- Qualidade e PQAUD
- Gestão de Riscos da AUDIN
- Competências e PAC-Aud
- Ética, Independência e Impedimentos
- Governança, Transparência e Fraudes
- Biblioteca Metodológica
- Sigilo e Classificação da Informação
- Dashboards e Business Intelligence
- Integrações e Catálogo de Integrações

### 4.2 Fluxo Corporativo Principal
Planejamento Estratégico (PALP/PAA) →  
Abertura de Auditoria (Comunicado) →  
Programa de Auditoria →  
Execução (testes, evidências, papéis de trabalho) →  
Achados Preliminares →  
Manifestação da Unidade Auditada →  
Relatório Preliminar →  
Relatório Final com Recomendações →  
Monitoramento (follow-up) →  
Avaliação de Qualidade (PQAUD) →  
Melhoria Contínua

---

## 5. DIRETRIZES PARA OS VOLUMES SUBSEQUENTES
Os volumes subsequentes da especificação deverão detalhar:
- Requisitos funcionais por módulo;
- Casos de uso em Gherkin;
- Regras de negócio;
- Perfis e permissões;
- Modelo conceitual de dados;
- APIs e contratos de integração;
- Workflows BPMN;
- Dashboards e indicadores;
- Catálogo de integrações;
- Requisitos não funcionais;
- Critérios de aceitação.
