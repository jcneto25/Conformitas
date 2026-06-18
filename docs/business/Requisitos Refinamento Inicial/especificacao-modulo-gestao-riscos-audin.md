# Especificação Funcional — Módulo de Gestão de Riscos da AUDIN

**Sistema de Gestão de Auditorias Internas — TJCE**  
Versão 1.0 | Junho de 2026  
Base normativa: Manual de Gestão de Riscos da AUDIN (2020) · Portaria da Presidência TJCE nº 851/2020 · ABNT NBR ISO 31000:2009 · COSO (2007) · Orange Book (2004)

---

## 1. Objetivo

Suportar o processo de Gestão de Riscos dos processos internos da Secretaria de Auditoria Interna (AUDIN), conforme a Política de Gestão de Riscos aprovada pela Portaria nº 851/2020. O módulo é distinto e complementar ao QACI e à Matriz de Priorização do Módulo de Planejamento: enquanto esses instrumentos avaliam os riscos dos *processos das unidades auditadas*, este módulo gerencia os riscos dos *processos internos da própria AUDIN*, cobrindo as 8 etapas da ISO 31000:2009 — Estabelecimento de Contexto, Identificação, Análise, Avaliação, Tratamento, Comunicação, Monitoramento e Melhoria Contínua.

---

## 2. Estrutura de Governança de Gestão de Riscos

### 2.1 Papéis e Atribuições

O sistema deve reconhecer e suportar três papéis específicos da estrutura de governança de riscos da AUDIN, distintos dos perfis gerais de acesso ao sistema:

| Papel | Composição | Atribuições Principais |
|---|---|---|
| Comitê de Gestão de Riscos | Secretário de Auditoria (condução) + Auditores | Monitorar, revisar e propor alterações na política; deliberar sobre apetite e tolerância a risco; verificar Mapa de Riscos e Relatório de Análise Crítica; decidir prioridades de atuação |
| Gestor de Riscos de Auditoria | Secretário de Auditoria (supervisor) + Auditores (coordenadores) | Submeter objetos ao processo; coordenar o processo nos níveis tático e operacional; propor níveis de exposição aceitável; selecionar riscos prioritários; definir ações de tratamento e prazos |
| Gestor de Processos de Auditoria | Demais colaboradores | Identificar e avaliar riscos dos objetos sob sua responsabilidade; implementar planos de ação; comunicar novos riscos; elaborar Relatório de Análise Crítica e Mapa de Riscos |

### 2.2 Reuniões do Comitê

- Reuniões **ordinárias**: a cada quadrimestre (3 reuniões por ano), convocadas pelo Secretário de Auditoria.
- Reuniões **extraordinárias**: convocadas pelo Secretário sempre que fundamentado por qualquer membro.
- O sistema deve: registrar pautas, gerar automaticamente a ata de cada reunião, controlar deliberações e alertar para a próxima reunião ordinária 15 dias antes.

### 2.3 Secretaria do Comitê

O Secretário de Auditoria designa um colaborador para secretariar o Comitê. O sistema deve registrar essa designação e permitir que o secretário gerencie pautas, atas e relatórios de resultados.

---

## 3. Objetos de Gestão de Riscos

### 3.1 Definição e Cadastro

Um objeto de gestão de riscos é qualquer processo de trabalho, atividade, projeto, iniciativa, ação do plano da unidade ou recurso que suporte a realização dos objetivos da AUDIN. Exemplos de objetos passíveis de cadastro:

- Processo de elaboração do PAA
- Processo de execução de auditorias
- Processo de emissão de relatórios
- Processo de monitoramento de recomendações
- Processo de capacitação (PAC-Aud)
- Gestão de papéis de trabalho e evidências
- Processo de comunicação com o CNJ (ACAs)

### 3.2 Seleção de Objetos

A seleção dos objetos a serem submetidos ao processo de gestão de riscos em cada ciclo é de responsabilidade do Gestor de Riscos de Auditoria, mediante submissão ao Comitê. O sistema deve:

- Exibir o catálogo de objetos cadastrados com status de cobertura (com ou sem gestão de riscos ativa);
- Registrar a decisão do Comitê sobre quais objetos serão gerenciados no ciclo vigente;
- Alertar para objetos sem gestão de riscos há mais de 2 anos (prazo máximo entre ciclos).

---

## 4. Etapa 1 — Estabelecimento de Contexto

### 4.1 Finalidade

Compreender o ambiente externo e interno em que o objeto de gestão de riscos está inserido, identificando parâmetros e critérios a serem considerados no processo.

### 4.2 Funcionalidades

O sistema deve disponibilizar o **Formulário de Ambiente e Fixação de Objetivos** (equivalente digital da Planilha Documentadora — Aba 1), contendo:

**Identificação:**
- Órgão/Unidade
- Diretoria/Secretaria diretamente subordinada
- Macroprocesso/Processo objeto da análise
- Objetivo do macroprocesso/processo
- Leis e regulamentos aplicáveis
- Sistemas utilizados para execução das atividades

**Análise do Ambiente Interno** — verificação de existência (Sim/Não):
- Código de Ética / Normas de Conduta
- Estrutura Organizacional
- Política de Recursos Humanos (competência e responsabilidades)
- Atribuição de Alçadas e Responsabilidades
- Normas Internas

**Fixação de Objetivos:**
- Missão da AUDIN
- Visão da AUDIN
- Objetivos organizacionais vinculados ao objeto

**Análise SWOT:**
- Forças (Pontos Fortes internos)
- Fraquezas (Pontos Fracos internos)
- Oportunidades (Pontos Fortes externos)
- Ameaças (Pontos Fracos externos)

**Partes Interessadas e Envolvidas:**
- Campo para registro das partes interessadas (expectativas, mas não envolvidas diretamente)
- Campo para registro das partes envolvidas (responsáveis pela execução e pela gestão de riscos)

### 4.3 Técnicas de Apoio Disponíveis no Sistema

O sistema deve oferecer os seguintes recursos de apoio à etapa:
- Template de Diagrama de Afinidades para agrupamento de ideias
- Ferramenta de brainstorming colaborativo (registro de ideias em tempo real por múltiplos usuários)
- Importação dos objetivos do PAA vigente para o campo de fixação de objetivos

---

## 5. Etapa 2 — Identificação dos Riscos

### 5.1 Finalidade

Reconhecer e descrever os riscos relacionados ao objeto, identificando fontes, eventos, causas e consequências.

### 5.2 Sintaxe Padrão de Registro

O sistema deve orientar o registro de cada risco na seguinte estrutura:

> *"Devido a \<CAUSA/FONTE\>, poderá acontecer \<DESCRIÇÃO DO EVENTO DE RISCO\>, o que poderá levar a \<DESCRIÇÃO DO IMPACTO/EFEITO/CONSEQUÊNCIAS\>, impactando no \<OBJETIVO DE PROCESSO\>."*

### 5.3 Formulário de Identificação de Riscos (Mapa de Riscos — Aba 2)

Para cada processo/atividade do objeto, o sistema deve permitir o cadastro de N eventos de risco, cada um com:

| Campo | Descrição |
|---|---|
| Processo/Atividade | Subprocesso ou atividade do objeto avaliado |
| Evento de Risco | Descrição do evento (o que pode ocorrer) |
| Causas | Fatores que originam a possibilidade do evento |
| Efeitos/Consequências | Resultado do evento sobre os objetivos |
| Categoria do Risco | Estratégico / Operacional / Orçamentário / Reputação / Integridade |
| Natureza do Risco | Financeiro / Não Financeiro |

### 5.4 Catálogo de Eventos de Risco

O sistema deve disponibilizar catálogo parametrizável de eventos de risco, estruturado nas categorias do Manual (Anexos 4 e 5), para consulta e seleção durante a identificação:

**Ambiente Interno:**

| Fonte | Categoria Nível 1 | Categoria Nível 2 | Exemplos de Eventos |
|---|---|---|---|
| Processos | Modelagem | — | Falha de metodologia; deficiência na atualização de fluxos; falta de revisão periódica |
| Processos | Gerenciamento | Planejamento | Baixa capacidade de planejamento; não-envolvimento de atores; definição equivocada de esforços/prazos |
| Processos | Gerenciamento | Execução | Falhas na execução; fraudes internas; descumprimento de normas; perda de prazo; deficiência de recursos |
| Processos | Gerenciamento | Monitoramento | Falha nos indicadores; não realização de ciclos de avaliação; ineficiência do controle interno |
| Processos | Comunicação Interna | Erro de Informação | Baixa transparência; armazenamento disperso; divulgação de dados imprecisos |
| Processos | Comunicação Interna | Relacionamento | Deficiência na comunicação entre atores; falhas nos canais |
| Pessoas | Carga de Trabalho | — | Dimensionamento inadequado; inadequação de segregação de funções; alta rotatividade |
| Pessoas | Competências | Organizacionais | Baixa qualificação; desconhecimento de responsabilidades; centralização de conhecimento; deficiência no PAC-Aud |
| Pessoas | Competências | Gerenciais | Seleção de gestores com baixa qualificação; perseguições pessoais |
| Estrutura | Arquitetura | — | Inadequação da hierarquia; inadequação do espaço físico; criação/extinção de unidades sem estudo prévio |
| Estrutura | Estratégias | — | Falha no alinhamento estrutura-estratégia; atribuições legais em descompasso com objetivos |

**Ambiente Externo:**

| Fonte | Exemplos de Eventos |
|---|---|
| Regulamentação | Alteração normativa inesperada; necessidade de adaptação a novo marco regulatório |
| Fraude | Recebimento de documentação falsa; apropriação de valores por terceiros; obtenção de informação sigilosa |
| Fornecedores | Descontinuidade de fornecimento; entrega de produto defeituoso; execução ineficiente de serviço |
| Reputação | Cobertura negativa da mídia; avaliação negativa dos usuários; fragilidade institucional |
| Danos a Bens Físicos | Vandalismo; terrorismo; inundação; incêndio; desabamento |
| Contexto Político/Econômico/Social | Contingenciamento orçamentário; mudança repentina de orientação política |

O catálogo é exemplificativo e editável pelo Secretário de Auditoria. Novos eventos identificados durante o processo podem ser adicionados ao catálogo para uso em ciclos futuros.

---

## 6. Etapa 3 — Análise dos Riscos

### 6.1 Finalidade

Determinar o nível de risco de cada evento identificado mediante a combinação de Probabilidade e Impacto, calculando separadamente o Risco Inerente (sem controles) e o Risco Residual (com controles).

### 6.2 Escala de Impacto

O sistema deve implementar a escala multidimensional de impacto do Manual, com os seguintes fatores e pesos:

| Fator de Análise | Peso |
|---|---|
| Esforço de Gestão | 15% |
| Regulação | 17% |
| Reputação | 12% |
| Negócios/Serviços à Sociedade | 18% |
| Intervenção Hierárquica | 13% |
| Orçamento (Econômico-Financeiro) | 25% |
| **Total** | **100%** |

Para cada fator, são atribuídas notas de 1 a 5 conforme a tabela abaixo:

| Nota | Classificação | Esforço de Gestão | Regulação | Reputação | Negócios/Serv. Sociedade | Intervenção Hierárquica | Orçamento |
|---|---|---|---|---|---|---|---|
| 1 | Insignificante | Absorvido por atividades normais | Pouco ou nenhum impacto | Impacto apenas interno | Pouco ou nenhum impacto nas metas | Funcionamento normal da atividade | < 1% |
| 2 | Pequeno | Consequências absorvidas, carecem de esforço para minimizar | Ações de caráter orientativo | Limita-se às partes envolvidas (auditor e/ou outros setores) | Prejudica o alcance das metas do processo | Exigiria intervenção do Auditor | ≥ 1% < 3% |
| 3 | Moderado | Pode ser gerenciado em circunstâncias normais | Ações de caráter corretivo | Impacta a Secretaria por um curto período | Prejudica o alcance dos objetivos estratégicos | Exigiria intervenção do Auditor-chefe | ≥ 3% < 10% |
| 4 | Grande | Crítico, mas com devida gestão pode ser suportado | Ações de caráter pecuniário (multas) | Impacta a Superintendência, provocando exposição significativa | Prejudica o alcance da missão da Unidade | Exigiria intervenção do Secretário | ≥ 10% < 25% |
| 5 | Catastrófico | Potencial para levar o negócio ou serviço ao colapso | Determina interrupções das atividades | Impacta na Presidência, podendo atingir objetivos estratégicos e missão do TJ | Prejudica o alcance da missão do TJ | Exigiria intervenção do Presidente | ≥ 25% |

**Cálculo da nota de Impacto:**

```
I = (Nota_EsforçoGestão × 0,15) + (Nota_Regulação × 0,17) + (Nota_Reputação × 0,12)
  + (Nota_NegóciosSociedade × 0,18) + (Nota_IntervençãoHierárquica × 0,13)
  + (Nota_Orçamento × 0,25)
```

O sistema deve calcular automaticamente a nota de Impacto ao final do preenchimento dos fatores.

### 6.3 Escala de Probabilidade

| Nota | Classificação | Frequência Prevista |
|---|---|---|
| 1 | Rara | < 10% — evento pode ocorrer em circunstâncias excepcionais |
| 2 | Improvável | ≥ 10% < 30% — evento pode ocorrer em algum momento |
| 3 | Possível | ≥ 30% ≤ 50% — evento deve ocorrer em algum momento |
| 4 | Provável | > 50% ≤ 90% — evento provavelmente ocorre na maioria das circunstâncias |
| 5 | Quase certo | > 90% — evento esperado na maioria das circunstâncias |

### 6.4 Nível de Risco

```
NR = P × I
```

| Faixa do NR | Classificação |
|---|---|
| 1 a 3 | Risco Pequeno |
| 4 a 6 | Risco Moderado |
| 8 a 12 | Risco Alto |
| 15 a 25 | Risco Crítico |

### 6.5 Matriz de Riscos

O sistema deve gerar automaticamente a Matriz de Riscos 5×5 (Probabilidade × Impacto) após o preenchimento das notas, com coloração por faixa de NR:

- Verde: Risco Pequeno (1-3)
- Amarelo: Risco Moderado (4-6)
- Laranja: Risco Alto (8-12)
- Vermelho: Risco Crítico (15-25)

### 6.6 Cálculo do Risco Inerente (NRI)

O Risco Inerente é calculado **sem considerar** a existência de quaisquer controles existentes. O sistema deve:

```
NRI = P × I  (sem controles)
```

- Disponibilizar o formulário de Cálculo do Risco Inerente (Aba 3 da Planilha Documentadora digital) com as escalas de Impacto (multidimensional) e Probabilidade para cada evento de risco;
- Registrar separadamente as notas atribuídas sem considerar controles;
- Calcular e exibir o NRI de cada evento.

### 6.7 Avaliação dos Controles Existentes

Após o cálculo do NRI, o sistema deve registrar os controles existentes para cada evento de risco, avaliando-os em duas dimensões independentes:

**Dimensão A — Desenho do Controle:**

| Nota | Descrição |
|---|---|
| 1 | Não há procedimento de controle |
| 2 | Há procedimentos de controle, mas não são adequados e nem estão formalizados |
| 3 | Há procedimentos de controle formalizados, mas não estão adequados (insuficientes) |
| 4 | Há procedimentos de controle adequados (suficientes), mas não estão formalizados |
| 5 | Há procedimentos de controle adequados (suficientes) e formalizados |

**Dimensão B — Operação do Controle:**

| Nota | Descrição |
|---|---|
| 1 | Não há procedimento de controle |
| 2 | Há procedimentos de controle, mas não são executados |
| 3 | Os procedimentos de controle estão sendo parcialmente executados |
| 4 | Os procedimentos de controle são executados, mas sem evidência de sua realização |
| 5 | Procedimentos de controle são executados e com evidência de sua realização |

O formulário de identificação e avaliação dos controles existentes (Aba 4 — Mapa de Riscos: Identificação dos Controles) deve conter, para cada evento de risco: descrição do controle atual, nota de Desenho e nota de Operação.

### 6.8 Cálculo do Risco Residual (NRR)

O Risco Residual é calculado **considerando** os controles existentes, refletindo o quanto eles alteram a probabilidade e/ou o impacto do evento:

```
NRR = P × I  (com controles existentes considerados)
```

O sistema deve disponibilizar formulário equivalente ao do Risco Inerente (Aba 5 da Planilha Documentadora digital), com as mesmas escalas, mas orientando o usuário a considerar o efeito dos controles já identificados sobre cada fator.

**Regra de divergência:** Caso haja divergência entre as notas atribuídas por diferentes avaliadores para o mesmo evento, o sistema deve registrar ambas as avaliações e solicitar ao Gestor de Riscos de Auditoria a deliberação, com registro de justificativa.

---

## 7. Etapa 4 — Avaliação dos Riscos

### 7.1 Finalidade

Comparar o NRR de cada evento com os critérios de apetite e tolerância a risco definidos pelo Comitê, determinando se o risco é aceitável ou requer tratamento.

### 7.2 Apetite e Tolerância a Risco

O sistema deve permitir que o Comitê defina, no início de cada ciclo e por objeto de gestão:

- **Apetite a Risco:** nível de NRR que a unidade está disposta a aceitar sem tratamento adicional;
- **Tolerância a Risco:** margem máxima acima do apetite que pode ser suportada em troca de benefícios específicos, ainda que com ciência do Comitê.

Riscos com NRR dentro da faixa de tolerância podem ser aceitos. Riscos que excedem a tolerância devem ser tratados obrigatoriamente.

### 7.3 Estratégias de Resposta ao Risco

Para cada evento com NRR acima do apetite definido, o sistema deve registrar a estratégia de resposta escolhida:

| Estratégia | Descrição |
|---|---|
| Aceitar | Tolerar o risco sem ação adicional — risco é baixo ou custo de tratamento supera o benefício |
| Evitar | Descontinuar a atividade que gera o risco |
| Compartilhar/Transferir | Compartilhar ou transferir o risco a terceiros |
| Mitigar/Reduzir | Adotar controles para tratar a probabilidade e/ou o impacto do risco |

O formulário de Plano de Controle (Aba 6 da Planilha Documentadora digital) deve registrar, para cada evento: Macroprocesso/Processo, Evento de Risco, NRR e Resposta ao Risco escolhida.

---

## 8. Etapa 5 — Tratamento dos Riscos

### 8.1 Plano de Implementação de Controles

Para cada evento que requer tratamento (estratégia Mitigar, Evitar ou Compartilhar), o sistema deve gerar e gerenciar um **Plano de Implementação de Controles**, contendo os seguintes campos:

**Identificação do Risco:**
- Macroprocesso/Processo
- Evento de Risco
- Nível de Risco Residual
- Resposta ao Risco

**O Quê (Controle Proposto):**
- Descrição sumária da proposta de controle
- Tipo de Controle (Preventivo / Corretivo / Detectivo)
- Objetivo do Controle Proposto

**Quem:**
- Responsável pela implementação do controle
- Intervenientes

**Como:**
- Detalhamento do plano de implementação (tarefas individuais com sequência)

**Quando:**
- Data de início
- Data de conclusão prevista

**Status:**
- Percentual de progresso total
- Situação: Não Iniciado / Em Andamento / Concluído / Atrasado

### 8.2 Critérios de Validação do Plano

Ao propor controles, o sistema deve orientar a equipe a verificar:

- Se o efeito da resposta afetará de fato a probabilidade e/ou o impacto do risco;
- A relação custo-benefício de cada opção de tratamento;
- Se há responsável e prazo definidos para cada tarefa.

### 8.3 Boas Práticas Sugeridas pelo Sistema

Na tela de cadastro de controles, o sistema deve exibir alerta com orientação para priorizar:

- Controles automatizados em substituição aos manuais, quando possível;
- Indicadores de desempenho associados ao controle;
- Segregação de funções;
- Políticas e procedimentos formalizados.

---

## 9. Etapa 6 — Comunicação

### 9.1 Matriz RACI do Processo de Gestão de Riscos

O sistema deve implementar o fluxo de comunicação conforme a Matriz RACI definida no Manual, gerenciando responsabilidades, frequências e meios para cada atividade do processo:

| Atividade | Comitê | Gestor de Riscos | Gestor de Processos | Frequência | Meio |
|---|---|---|---|---|---|
| Definir/revisar Política de Gestão de Riscos | R/A | C | C/I | Eventual | Portaria |
| Monitorar e analisar criticamente a Política | R/A | C | C/I | Quadrienal | Ata de Reunião |
| Definir objetos a serem gerenciados no ciclo | A | C/I | R | Anual | Planilha Documentadora |
| Definir diretrizes específicas de gestão de riscos | R/A | C | C/I | Anual | Planilha Documentadora |
| Definir contexto da análise de riscos | C/A | I | R | Anual | Planilha Documentadora |
| Estabelecer critérios, Matriz e níveis aceitáveis | A | R | C/I | Anual | Planilha Documentadora |
| Identificar riscos | A | R | C/I | Anual | Planilha Documentadora |
| Analisar e estimar riscos | A | R | C/I | Anual | Planilha Documentadora |
| Avaliar riscos | I | R/A | C | Anual | Planilha Documentadora |
| Elaborar Plano de Implementação de Controles | A | R | C/I | Anual | Planilha Documentadora |
| Comunicar riscos às partes interessadas | A | R | C/I | Anual | Reunião |
| Monitorar Plano de Implementação de Controles | A | R | C/I | Anual | Planilha Documentadora |
| Implementar controles propostos | I | C/A | R | Anual | Planilha Documentadora |
| Elaborar Relatório de Análise Crítica | I | R | C | Anual | Relatório |
| Aprovar melhorias da análise crítica | R/A | C | I | Anual | Reunião |
| Implementar melhorias aprovadas | I | C | R/A | Anual | Reunião |

**Legenda RACI:** R = Responsável pela execução / A = Aprova / C = Consultado / I = Informado

### 9.2 Funcionalidades de Comunicação

O sistema deve:

- Gerar notificações automáticas aos papéis envolvidos conforme a frequência definida na Matriz RACI;
- Registrar o envio e a confirmação de recebimento de cada comunicação;
- Disponibilizar canal de comunicação interno entre os papéis da estrutura de governança;
- Controlar a classificação de sigilo das informações de risco (públicas, internas, restritas, sigilosas), conforme a LGPD e as políticas de segurança do TJCE.

---

## 10. Etapa 7 — Monitoramento

### 10.1 Monitoramento do Plano de Implementação de Controles

O sistema deve acompanhar a execução de cada tarefa do Plano de Implementação de Controles, exibindo para cada controle proposto:

- Status atualizado (Não Iniciado / Em Andamento / Concluído / Atrasado);
- Percentual de progresso;
- Responsável atual;
- Datas de início e conclusão previstas vs. realizadas;
- Alertas automáticos para controles com prazo vencido ou em risco de atraso (7 dias antes do vencimento).

### 10.2 Relatório de Análise Crítica

O sistema deve suportar a elaboração periódica do **Relatório de Análise Crítica** por objeto de gestão de risco, contendo:

**Cabeçalho:**
- Objeto de análise crítica
- Risco(s) avaliado(s)
- Nível de Risco (NRR)
- Controle(s) sob análise
- Responsável
- Data de expedição

**Avaliação dos Controles Propostos:**
- Descrição dos controles já implementados
- Avaliação da eficácia com base em indicadores (variação do NRR em relação ao ciclo anterior)
- Verificação se as ações de controle reduziram os fatores de Impacto e/ou Probabilidade
- Avaliação dos controles quanto ao Desenho e à Operação (usando as mesmas escalas da etapa de análise)

**Análise Crítica** — campos estruturados para registrar:
- Mudanças detectadas nos contextos externo e interno
- Eventos/mudanças analisados e aprendizados do ciclo
- Eficácia e eficiência dos controles no projeto e na operação
- Riscos emergentes identificados
- Informações adicionais para melhorar a avaliação dos riscos

**Deliberação sobre cada controle analisado:**

| Campo | Opções |
|---|---|
| Identificação do Risco | — |
| NRR | — |
| Controle Proposto | — |
| Decisão | Mantém / Modifica / Novo Controle |
| Justificativa | Campo texto |

**Plano de Implementação de Melhorias** (quando identificada necessidade):
- Proposta de melhoria (descrição detalhada)
- Responsável pela estratégia
- Intervenientes
- Data de início e conclusão
- Percentual de progresso
- Situação

### 10.3 Indicadores de Monitoramento do Processo de Gestão de Riscos

O sistema deve calcular e exibir no painel de governança os seguintes indicadores, por unidade e por ciclo:

| Indicador | Fórmula |
|---|---|
| % processos mapeados por unidade | Processos mapeados / Total de processos |
| % processos essenciais mapeados | Processos essenciais mapeados / Total de processos essenciais |
| % processos relevantes mapeados | Processos relevantes mapeados / Total de processos relevantes |
| % processos moderados mapeados | Processos moderados mapeados / Total de processos moderados |
| % processos essenciais com riscos mapeados | Processos essenciais com riscos mapeados / Total de processos essenciais |
| % processos relevantes com riscos mapeados | Processos relevantes com riscos mapeados / Total de processos relevantes |
| % processos moderados com riscos mapeados | Processos moderados com riscos mapeados / Total de processos moderados |
| % controles implementados por processo | Controles concluídos / Total de controles do processo |
| % controles em andamento por processo | Controles em andamento / Total de controles do processo |
| % controles atrasados por processo | Controles atrasados / Total de controles do processo |
| % controles não iniciados por processo | Controles não iniciados / Total de controles do processo |
| % conclusão do plano de implementação | Controles concluídos / Total de controles propostos |
| % implementação de controle individual | Procedimentos executados / Total de procedimentos necessários para conclusão |

---

## 11. Etapa 8 — Melhoria Contínua

### 11.1 Ciclo de Gestão de Riscos

O processo de gestão de riscos constitui um ciclo que deve ser executado **ao menos uma vez por ano**. O sistema deve:

- Alertar o Gestor de Riscos de Auditoria 60 dias antes do encerramento do ciclo vigente para iniciar o próximo;
- Permitir ciclos de periodicidade menor que um ano para objetos de maior criticidade;
- Limitar o prazo máximo entre ciclos a **2 anos** para qualquer objeto, gerando alerta automático ao Comitê quando esse prazo for ultrapassado;
- Manter histórico completo de todos os ciclos executados para cada objeto, permitindo comparação entre NRI e NRR ao longo do tempo.

### 11.2 Aprendizado entre Ciclos

Ao iniciar um novo ciclo para um objeto já avaliado anteriormente, o sistema deve:

- Exibir o NRI e o NRR do ciclo anterior como referência;
- Indicar quais controles foram implementados, modificados ou descartados;
- Pré-preencher o Formulário de Contexto com as informações do ciclo anterior, permitindo atualização;
- Importar eventos de risco do ciclo anterior como ponto de partida para a identificação, com status de "verificar pertinência".

---

## 12. Planilha Documentadora Digital

O sistema deve digitalizar a Planilha Documentadora como instrumento central e persistente por objeto de gestão de risco e por ciclo, com as seguintes abas/seções:

| Aba | Etapa | Conteúdo Principal |
|---|---|---|
| 1 — Ambiente e Fixação de Objetivos | Estabelecimento de Contexto | Contexto interno/externo, missão, visão, objetivos, SWOT, partes interessadas |
| 2 — Mapa de Riscos (Identificação) | Identificação | Processo/atividade, evento, causas, efeitos, categoria, natureza |
| 3 — Cálculo do Risco Inerente | Análise | Notas por fator de impacto, nota de probabilidade, NRI por evento |
| 4 — Identificação dos Controles | Análise | Controles existentes, nota de Desenho, nota de Operação |
| 5 — Cálculo do Risco Residual | Análise | Notas recalculadas com controles, NRR por evento |
| 6 — Plano de Controle | Avaliação/Tratamento | Resposta ao risco, controles propostos por evento |
| 7 — Plano de Implementação | Tratamento | Tarefas, responsáveis, prazos, status, % progresso |
| 8 — Relatório de Análise Crítica | Monitoramento | Avaliação de eficácia, deliberações, plano de melhorias |

O preenchimento da Planilha Documentadora segue fluxo sequencial: só é possível avançar para a aba seguinte após o preenchimento mínimo obrigatório da aba atual. O sistema deve permitir salvar rascunhos intermediários e retomar de onde parou.

---

## 13. Integração com Outros Módulos do Sistema

| Módulo de Destino | Dados Produzidos por este Módulo |
|---|---|
| Módulo de Planejamento (6.1) | Riscos dos processos internos da AUDIN que impactam o PAA; objetos com risco crítico sinalizam necessidade de revisão do planejamento |
| Módulo de Execução (6.2) | Riscos operacionais identificados para processos de auditoria alimentam alertas durante a execução |
| Módulo de Qualidade (6.8) | Indicadores de monitoramento do processo de gestão de riscos compõem os indicadores de qualidade da AUDIN |
| Módulo de Governança (6.9) | Mapa de Riscos consolidado, indicadores de cobertura e evolução do NRR compõem o painel de governança; Relatório de Análise Crítica é insumo para o RAA |
| Módulo de Relatórios — RAA (6.3) | Restrições de acesso registradas no contexto, riscos críticos não tratados e controles implementados devem constar do Relatório Anual de Atividades |

---

## 14. Perfis de Acesso no Módulo

| Perfil | Permissões |
|---|---|
| Gestor de Processos de Auditoria (demais colaboradores) | Preencher e editar Planilha Documentadora dos objetos sob sua responsabilidade; registrar novos eventos de risco; visualizar plano de implementação |
| Gestor de Riscos de Auditoria (Secretário e Auditores coordenadores) | Acesso total ao módulo; selecionar objetos; definir apetite e tolerância; aprovar Plano de Implementação; elaborar Relatório de Análise Crítica |
| Comitê de Gestão de Riscos | Acesso a todos os Mapas de Riscos e Relatórios de Análise Crítica; deliberar sobre estratégias de resposta; registrar decisões das reuniões do Comitê |
| Secretário do Comitê | Gerenciar pautas, atas e relatórios de resultados das reuniões do Comitê |
| Presidência | Visualizar Mapa de Riscos consolidado e indicadores de cobertura; receber notificações sobre riscos críticos não tratados |

---

## 15. Requisitos Específicos de Dados

| Entidade | Atributos Principais |
|---|---|
| Objeto de Gestão de Risco | Código, denominação, tipo (processo/atividade/projeto), responsável, ciclo vigente, status, data do último ciclo concluído |
| Ciclo de Gestão de Riscos | Objeto vinculado, exercício, data de início, data de conclusão, status (Em andamento / Concluído), versão da Planilha Documentadora |
| Evento de Risco | Código, processo/atividade, descrição, causas, efeitos, categoria, natureza, NRI, NRR, estratégia de resposta, ciclo vinculado |
| Controle Existente | Evento vinculado, descrição, nota de Desenho, nota de Operação, ciclo vinculado |
| Controle Proposto | Evento vinculado, descrição, tipo, objetivo, responsável, intervenientes, tarefas, prazos, status, % progresso |
| Reunião do Comitê | Tipo (ordinária/extraordinária), data, participantes, pauta, ata, deliberações, próxima reunião |
| Relatório de Análise Crítica | Objeto, ciclo, eventos analisados, avaliação de eficácia, deliberações (mantém/modifica/novo), plano de melhorias, responsável, data |

---

*Documento gerado com base no Manual de Gestão de Riscos da AUDIN (Portaria Presidência TJCE nº 851/2020) e na Especificação Técnico-Funcional do Sistema de Gestão de Auditorias Internas (TJCE, 2026). Deve ser lido em conjunto com a especificação do Módulo de Planejamento Estratégico e Operacional, que trata da gestão de riscos dos processos das unidades auditadas (QACI e Matriz de Priorização).*
