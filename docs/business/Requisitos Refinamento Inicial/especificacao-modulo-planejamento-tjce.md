# Especificação Funcional — Módulo de Planejamento Estratégico e Operacional

**Sistema de Gestão de Auditorias Internas — TJCE**  
Versão 1.1 | Junho de 2026  
Base normativa: Res. CNJ 308/2020, 309/2020, 422/2021, 633/2025 · Lei Est. 18.561/2023 · Res. OE 23/2023 · Metodologia PAA/PALP TJCE (2021)

---

## 1. Objetivo

Gerenciar o ciclo completo de planejamento da Secretaria de Auditoria Interna, compreendendo o Plano de Auditoria de Longo Prazo (PALP), o Plano Anual de Auditoria (PAA) e o Programa de Auditoria individual de cada trabalho. O módulo deve implementar a metodologia de priorização baseada em riscos do TJCE, o cálculo de força de trabalho disponível, a distribuição de carga por tipo de atividade, e os workflows de aprovação e publicação com seus prazos legais.

---

## 2. Universo de Processos Auditáveis

### 2.1 Hierarquia de Processos

O sistema deve cadastrar e manter a arquitetura de processos administrativos do TJCE em quatro níveis hierárquicos, conforme a Cadeia Integrada de Processos do Poder Judiciário:

| Nível | Denominação | Descrição |
|---|---|---|
| 1 | Macroprocesso | Agrupamento de mais alto nível (ex.: Gerir Recursos Financeiros) |
| 2 | Grupo de Processos | Conjunto de processos correlatos (ex.: Compras, Processar Contas a Pagar) |
| 3 | Processo | Série de atividades inter-relacionadas que convertem insumos em resultados |
| 4 | Subprocesso | Principais eventos realizados durante a execução de um processo |

### 2.2 Regras de Cadastro

- A arquitetura de processos é mantida pela Secretaria de Planejamento e Gestão do TJCE e deve ser importável/sincronizável pelo sistema.
- O processo "Prestar Contas" é **obrigatório** no PAA de todo exercício, por força legal (Res. CNJ 309/2020, art. 38).
- Cada processo deve conter: código, denominação, secretaria responsável, orçamento gerido (R$), data da última auditoria, e link para recomendações do TCE em aberto.

---

## 3. Matriz de Priorização das Avaliações

A matriz de priorização é o instrumento central de seleção dos trabalhos de auditoria. Ela combina quatro dimensões com pesos fixos, produzindo uma nota final que ordena os processos auditáveis de forma decrescente.

### 3.1 Fórmula Geral

```
Nota Final = (Materialidade × 0,15) + (Relevância × 0,30) + (Criticidade × 0,30) + (Risco × 0,25)
```

### 3.2 Dimensão 1 — Materialidade (peso 15%)

Avalia o valor orçamentário projetado ou efetivamente gerido por cada processo em relação ao orçamento total do PJCE.

| Percentual do Orçamento do PJCE | Nota |
|---|---|
| Menos de 1% | 1 |
| De 1% a 5% | 2 |
| Acima de 5% a 40% | 3 |
| Acima de 40% | 4 |

**Regra de implementação:** O sistema deve calcular automaticamente o percentual a partir dos valores orçamentários cadastrados no processo e do orçamento total do PJCE informado para o exercício.

### 3.3 Dimensão 2 — Relevância (peso 30%)

A relevância é composta por dois subfatores somados, convertidos em uma escala de faixa.

**Subfator A — Contribuição Estratégica** (Quadro 2)

| Grau de Contribuição Estratégica | Nota |
|---|---|
| Não há contribuição | 0 |
| Há contribuição | 1 |
| Há alta contribuição | 2 |

A contribuição é identificada pelo vínculo entre o processo auditável e os objetivos estratégicos institucionais do TJCE e da Estratégia Nacional do Poder Judiciário.

**Subfator B — Interesse da Alta Administração** (Quadro 3)

| Interesse da Alta Administração | Nota |
|---|---|
| Muito Baixo | 0 |
| Baixo | 1 |
| Médio | 2 |
| Alto | 3 |

O grau de interesse é apurado por meio de pesquisa/formulário encaminhado anualmente à Superintendência da Área Administrativa.

**Classificação Final de Relevância** (Quadro 4) = Subfator A + Subfator B

| Nível de Relevância | Faixa da Soma | Nota Limite |
|---|---|---|
| Baixa Relevância | De 0 a 1 | 1 |
| Média Relevância | De 2 a 3 | 3 |
| Alta Relevância | De 4 a 5 | 5 |

**Regra de implementação:** O sistema deve disponibilizar formulário eletrônico para a pesquisa de interesse da alta administração, agregar as respostas automaticamente e pré-preencher o subfator B de cada processo.

### 3.4 Dimensão 3 — Criticidade (peso 30%)

A criticidade é calculada a partir de três subfatores ponderados internamente.

**Subfator A — Lapso Temporal entre Avaliações** (30% da nota de criticidade) — Quadro 6

| Tempo desde a última auditoria | Nota |
|---|---|
| Menos de 1 ano | 1 |
| Superior a 1 ano e inferior ou igual a 2 anos | 2 |
| Superior a 2 anos e inferior ou igual a 3 anos | 3 |
| Superior a 3 anos e inferior ou igual a 4 anos | 4 |
| Superior a 4 anos ou nunca auditado | 5 |

O sistema deve calcular automaticamente o lapso a partir da data da última auditoria concluída sobre o processo.

**Subfator B — Grau de Interesse da Auditoria Interna** (30% da nota de criticidade) — Quadro 7

| Interesse da Unidade de Auditoria Interna | Nota |
|---|---|
| Muito Baixo | 0 |
| Baixo | 1 |
| Médio | 2 |
| Alto | 3 |

Apurado por meio de consulta interna aos auditores, que avaliam quais processos demandam maior atenção.

**Subfator C — Recomendações e Determinações do TCE em Aberto** (40% da nota de criticidade) — Quadro 8

| Percepção do Controle Externo (TCE) | Nota |
|---|---|
| Não há recomendações/determinações do TCE | 0 |
| Há pelo menos 1 recomendação do TCE | 1 |
| Há mais de 1 recomendação do TCE | 2 |
| Há pelo menos 1 determinação do TCE | 3 |
| Há mais de 1 determinação do TCE | 4 |

**Fórmula interna de Criticidade:**
```
Criticidade = (Subfator A × 0,30) + (Subfator B × 0,30) + (Subfator C × 0,40)
```

**Classificação Final de Criticidade** (Quadro 5)

| Nível de Criticidade | Faixa | Nota Limite |
|---|---|---|
| Baixa Criticidade | De 0 a 1 | 1 |
| Média Criticidade | Acima de 1 a 3 | 3 |
| Alta Criticidade | Acima de 3 a 5 | 5 |

### 3.5 Dimensão 4 — Risco (peso 25%)

A dimensão Risco avalia o nível de controle interno dos processos com base na metodologia do TCU (escala de nível de confiança × risco de controle), aplicada ao TJCE por meio do Questionário de Avaliação de Controle Interno (QACI).

**Classificação do Risco** (Quadro 9)

| Avaliação dos Controles | Nível de Confiança | Risco de Controle | Nota do Risco | Classificação |
|---|---|---|---|---|
| Melhor prática — mitiga todos os aspectos relevantes | Forte (80%) | Muito Baixo (20%) | 1 | Não Elevado |
| Implementados e sustentados por ferramentas adequadas — mitiga satisfatoriamente | Satisfatório (60%) | Baixo (40%) | 2 | Não Elevado |
| Mitiga alguns aspectos, mas não todos — deficiências de desenho ou ferramentas | Mediano (40%) | Médio (60%) | 3 | Não Elevado |
| Abordagem "ad hoc" — confiança no conhecimento individual | Fraco (20%) | Alto (80%) | 4 | Elevado |
| Controles inexistentes, mal desenhados ou não funcionais | Inexistente (0%) | Muito Alto (100%) | 5 | Elevado |

**Regra de divergência:** Quando a autoavaliação da unidade e a avaliação do auditor resultarem em notas diferentes, prevalece a avaliação da Auditoria Interna.

### 3.6 QACI — Questionário de Avaliação de Controle Interno

O QACI é o instrumento que alimenta a dimensão Risco da matriz. O sistema deve:

- Disponibilizar o QACI em portal específico para as unidades administrativas respondentes;
- Enviar automaticamente o questionário às áreas no início de cada exercício (até 31 de janeiro);
- Registrar as respostas da unidade e permitir que o auditor responsável insira sua avaliação paralela;
- Aplicar a regra de divergência automaticamente (prevalece a nota do auditor);
- Calcular a nota de Risco para cada processo e alimentar a matriz de priorização;
- Manter histórico das respostas por exercício para fins comparativos.

**Estrutura mínima do QACI:**
- Identificação do processo e da unidade responsável
- Perguntas sobre o desenho dos controles (existência, formalização, abrangência)
- Perguntas sobre a implementação dos controles (aplicação prática, ferramentas, evidências)
- Escala de resposta inversa: quanto maior o controle, menor a nota de risco
- Campo para o auditor registrar sua avaliação e justificativa de divergência

### 3.7 Geração e Visualização da Matriz

O sistema deve gerar a Matriz de Priorização de forma automática ao final de cada ciclo de coleta de dados, apresentando:

- Tabela ranqueada com todos os processos auditáveis em ordem decrescente de Nota Final;
- Notas individuais por dimensão e nota final consolidada;
- Classificação de cada processo por nível em cada dimensão (ex.: Alta Relevância, Média Criticidade);
- Indicação visual dos processos com classificação de Risco Elevado (notas 4 ou 5);
- Exportação em PDF e Excel para documentação do planejamento;
- Histórico de matrizes por exercício com controle de versão.

---

## 4. Cálculo de Força de Trabalho

O PAA somente pode ser elaborado após o cálculo da força de trabalho disponível da equipe de auditoria para o exercício. O sistema deve executar esse cálculo automaticamente com base no cadastro de servidores e no calendário do TJCE.

### 4.1 Algoritmo de Cálculo

**Passo 1 — Dias úteis totais do exercício**

```
Dias úteis brutos = Dias corridos do ano
                  − Fins de semana
                  − Feriados nacionais, estaduais e municipais (Fortaleza)
                  − Recesso forense do TJCE
```

**Passo 2 — Dias úteis disponíveis por servidor**

```
Dias disponíveis por servidor = Dias úteis brutos
    − 10 dias (treinamento/capacitação)
    − (Dias úteis brutos × 4%)  (absenteísmo)
    − 22 dias (férias do exercício corrente)
    − (Saldo de férias de anos anteriores × 50%)  [se houver]
    − (Folgas do TRE × 50%)  [se o servidor possuir]
```

**Passo 3 — Força de trabalho total da equipe**

```
Força de trabalho total = Σ (Dias disponíveis de cada servidor)
```

### 4.2 Dados necessários do cadastro de servidores

Para cada auditor, o sistema deve registrar e manter atualizados:

- Categoria (auditor, técnico judiciário, analista, apoio administrativo, estagiário);
- Saldo de férias de anos anteriores (em dias úteis);
- Folgas do TRE acumuladas (em dias úteis);
- Afastamentos já programados para o exercício (licenças, cedências, cargo em comissão).

### 4.3 Relatório de Força de Trabalho

O sistema deve gerar relatório por servidor e consolidado da equipe, exibindo:

- Dias úteis brutos do exercício;
- Deduções individualizadas por categoria (treinamento, absenteísmo, férias, saldos);
- Dias úteis disponíveis por servidor;
- Total da equipe disponível para distribuição no PAA.

---

## 5. Distribuição da Força de Trabalho no PAA

### 5.1 Categorias de Atividade e Reservas Obrigatórias

Antes de alocar auditorias, o sistema deve reservar automaticamente a carga mínima obrigatória para cada categoria de atividade:

| Categoria de Atividade | Reserva Obrigatória | Observação |
|---|---|---|
| Consultoria | 60 dias úteis | Fixo por exercício, executado sob demanda |
| Monitoramento de recomendações | 5 dias úteis por atividade | Multiplicado pelo número de monitoramentos previstos |
| Prestação de Contas Anual | Definido pela equipe | Trabalho obrigatório por força legal |
| Capacitação (PAC-Aud) | Calculado pelo Módulo 7 | Mínimo 40h/auditor/ano |

O saldo remanescente após essas reservas é distribuído entre as auditorias priorizadas na matriz.

**Regra de aceitação de consultorias:** O sistema deve validar, ao aceitar uma nova demanda de consultoria, se a carga acumulada de consultorias no PAA não ultrapassa os 60 dias reservados. Ultrapassado o limite, o Secretário de Auditoria deve autorizar explicitamente a inclusão, com registro de justificativa.

### 5.2 Classificação de Auditorias por Porte

Cada auditoria incluída no PAA deve ser classificada por porte, que define seu prazo máximo de execução:

| Porte | Prazo Máximo de Execução |
|---|---|
| Grande | Até 90 dias úteis |
| Médio | Até 60 dias úteis |
| Pequeno | Até 30 dias úteis |

O porte é atribuído pela equipe de auditoria com base na complexidade do objeto, escopo e recursos necessários.

### 5.3 Lógica de Distribuição

O sistema deve suportar a seguinte lógica de distribuição da força de trabalho:

1. Deduzir as reservas obrigatórias (consultorias, monitoramentos, prestação de contas) da força de trabalho total;
2. Apresentar o saldo disponível para distribuição entre auditorias;
3. Selecionar as auditorias a partir da matriz de priorização em ordem decrescente de nota;
4. Permitir à equipe definir porte e equipe designada para cada auditoria selecionada;
5. Calcular automaticamente a carga alocada (soma dos prazos por porte) e o saldo restante;
6. Alertar quando a carga alocada exceder a força de trabalho disponível;
7. Permitir alterações manuais justificadas, com registro de auditoria.

### 5.4 Inclusão de Atividades Mandatórias

Independentemente do ranking da matriz, as seguintes atividades devem ser incluídas automaticamente no PAA:

- Auditoria de Prestação de Contas Anual (obrigatória por lei);
- Ações Coordenadas de Auditoria (ACA) determinadas pelo CNJ;
- Prioridades designadas expressamente pela Presidência do TJCE;
- Monitoramentos em curso de auditorias de exercícios anteriores.

---

## 6. Plano Anual de Auditoria (PAA)

### 6.1 Estrutura do PAA

O PAA deve conter, no mínimo, os seguintes elementos:

- Identificação do exercício e da equipe responsável pela elaboração;
- Força de trabalho calculada (por servidor e total);
- Matriz de priorização do exercício (completa, com notas por dimensão);
- Lista de auditorias selecionadas, com: processo auditável, modalidade, porte, prazo máximo, equipe designada, mês/trimestre previsto de início;
- Lista de ACAs previstas pelo CNJ;
- Carga reservada para consultorias (60 dias úteis);
- Carga reservada para monitoramentos (5 dias por atividade);
- Trabalhos obrigatórios (prestação de contas e demais determinações);
- Plano Anual de Capacitação (PAC-Aud) vinculado;
- Síntese dos riscos e fragilidades identificadas para o exercício.

### 6.2 Modalidades de Auditoria

O sistema deve suportar as seguintes modalidades, selecionáveis por auditoria:

| Modalidade | Descrição Resumida |
|---|---|
| Auditoria de Conformidade/Compliance | Verificação de atos e fatos frente às normas e regulamentos aplicáveis |
| Auditoria Operacional/Desempenho | Avaliação de economicidade, eficiência, eficácia e efetividade |
| Auditoria Financeira/Contábil | Exame da exatidão dos registros e demonstrações contábeis |
| Auditoria de Gestão | Certificação de regularidade de contas, contratos, convênios e governança |
| Auditoria Especial | Exame de fatos incomuns ou extraordinários, por solicitação de autoridade competente |
| Ação Coordenada de Auditoria (ACA) | Execução de auditoria determinada pelo CNJ em caráter coordenado nacional |

### 6.3 Workflow de Aprovação e Publicação

```
Elaboração (equipe de auditoria)
    ↓
Revisão interna (Secretário de Auditoria)
    ↓
Submissão à Presidência [prazo: até 30 de novembro]
    ↓
Aprovação pela Presidência
    ↓
Publicação na intranet [prazo: até 15 de dezembro]
```

O sistema deve:

- Gerar alertas automáticos 30 dias, 15 dias e 5 dias antes do prazo de submissão (30/11);
- Bloquear a submissão enquanto campos obrigatórios não estiverem preenchidos;
- Registrar data/hora e responsável em cada transição de estado;
- Publicar automaticamente na intranet após confirmação de aprovação, respeitando a data de 15/12;
- Manter histórico de versões com controle de alterações.

### 6.4 Alterações ao PAA em Curso de Exercício

- Qualquer inclusão, exclusão ou substituição de atividade requer autorização formal da Presidência do TJCE;
- O sistema deve registrar a justificativa, o responsável pela solicitação e o ato de autorização;
- A realização de atividade não prevista pode ocorrer em detrimento de atividade prevista, desde que autorizada;
- O sistema deve manter o histórico completo de alterações com rastreabilidade de quem aprovou cada mudança.

---

## 7. Plano de Auditoria de Longo Prazo (PALP)

### 7.1 Características Gerais

O PALP é o instrumento estratégico de auditoria com ciclo de 4 (quatro) anos, devendo:

- Estar alinhado ao Planejamento Estratégico do TJCE e à Estratégia Nacional do Poder Judiciário;
- Estabelecer as áreas ou temas auditáveis em sentido amplo, sem o detalhamento operacional do PAA;
- Definir objetivos gerais das avaliações por área ou tema;
- Ser aprovado pela Presidência até 30 de novembro do ano de início do quadriênio;
- Ser publicado na intranet/portal de transparência até o 15º dia útil de dezembro;
- Servir de referência para a elaboração dos PAAs anuais.

### 7.2 Metodologia de Construção

Para definir os processos que constarão do PALP, o sistema deve utilizar a mesma Matriz de Priorização descrita na seção 3, com horizonte temporal de 4 anos. As áreas podem ser descritas em sentido amplo e sofrer atualizações sistemáticas anuais.

### 7.3 Revisão Anual Obrigatória

O PALP deve ser revisado anualmente para garantir aderência às prioridades vigentes. O sistema deve:

- Alertar a equipe de auditoria no início de cada exercício sobre a necessidade de revisão anual do PALP;
- Gerar relatório de comparação entre o PALP vigente e os resultados da nova matriz de priorização;
- Registrar as alterações aprovadas com justificativa, mantendo o histórico de versões;
- Comunicar a Presidência sobre alterações significativas no escopo do PALP.

### 7.4 Vínculo PAA ↔ PALP

O sistema deve garantir que:

- Toda auditoria incluída no PAA esteja vinculada a uma área ou tema do PALP vigente;
- Áreas do PALP não contempladas por nenhum PAA dos últimos 2 anos gerem alerta automático;
- O módulo exiba painel de cobertura do PALP ao longo do quadriênio, indicando quais áreas já foram auditadas e quais permanecem pendentes.

---

## 8. Programa de Auditoria (Papel de Trabalho de Planejamento)

### 8.1 Geração Automática

Para cada auditoria incluída no PAA e iniciada formalmente, o sistema deve gerar automaticamente um Programa de Auditoria pré-estruturado, contendo:

- Identificação: número/código da auditoria, modalidade, processo auditável, unidade auditada, equipe designada;
- Referência ao PAA e ao PALP;
- Objetivos e escopo do trabalho;
- Período de referência (exercício ou período específico);
- Cronograma detalhado (fases: planejamento, execução, relatório e monitoramento);
- Testes e técnicas de auditoria previstos (editáveis pela equipe);
- Critérios de auditoria aplicáveis (normas, leis, regulamentos);
- Estimativa de carga (dias úteis por fase e por servidor);
- Campo para registro de alterações supervenientes durante a execução.

### 8.2 Regras de Complementação

- O Programa de Auditoria pode ser complementado a qualquer momento durante a execução, desde que as circunstâncias justifiquem (Art. 20, III — Res. 23/2023);
- Toda complementação deve ser registrada com data, responsável e justificativa;
- O sistema deve manter versões anteriores do programa acessíveis para fins de rastreabilidade.

---

## 9. Integração com Outros Módulos

| Módulo de Destino | Dado Produzido pelo Módulo de Planejamento |
|---|---|
| Módulo de Execução (6.2) | Programa de Auditoria gerado automaticamente; equipe designada; cronograma |
| Módulo de Monitoramento/RMA (6.4) | Lista de monitoramentos previstos no PAA; carga de 5 dias/atividade reservada |
| Módulo de ACA (6.5) | ACAs previstas no PAA com cronograma e equipe |
| Módulo de Consultorias (6.6) | Saldo de 60 dias úteis reservados; validação de carga ao aceitar demandas |
| Módulo de Capacitação/PAC-Aud (6.7) | Lacunas de conhecimento identificadas a partir dos temas e objetos do PAA |
| Módulo de Qualidade (6.8) | Indicadores de auditorias planejadas vs. realizadas para o RAA |
| Módulo de Governança (6.9) | PAA publicado na intranet; PALP publicado no portal de transparência |

---

## 10. Requisitos Específicos de Dados

| Entidade | Atributos Principais |
|---|---|
| Processo Auditável | Código, denominação, nível hierárquico, secretaria responsável, orçamento gerido, data última auditoria, status TCE |
| Exercício de Planejamento | Ano, orçamento total do PJCE, calendário de dias úteis, datas de feriados e recesso |
| Servidor da Auditoria | Matrícula, nome, categoria, saldo de férias anteriores, folgas TRE, afastamentos programados |
| Avaliação de Processo (matriz) | Processo, exercício, nota por dimensão, nota final, nível em cada dimensão, usuário avaliador, data |
| QACI | Processo, unidade, exercício, respostas da unidade, avaliação do auditor, nota final, campo de divergência |
| Auditoria no PAA | Código, processo vinculado, PALP vinculado, modalidade, porte, prazo máximo, equipe, início previsto, status |
| Alteração do PAA | Auditoria afetada, tipo de alteração, justificativa, solicitante, ato de autorização da Presidência, data |

---

## 11. Prazos e Alertas Automáticos

| Evento | Prazo Legal | Alertas Automáticos |
|---|---|---|
| Envio do QACI às unidades | Até 31 de janeiro | — |
| Fechamento de respostas ao QACI | Definido pelo Secretário | Lembrete às unidades 5 dias antes |
| Submissão do PAA à Presidência | Até 30 de novembro | 30, 15 e 5 dias antes |
| Publicação do PAA na intranet | Até 15 de dezembro | Imediato após aprovação; alerta 5 dias antes do prazo |
| Revisão anual do PALP | Início de cada exercício | Janeiro de cada ano |
| Aprovação do PALP (quadrienal) | Até 30 de novembro do ano de início | 30 dias antes |

---

## 12. Perfis de Acesso no Módulo de Planejamento

| Perfil | Permissões |
|---|---|
| Auditor | Visualizar e editar auditorias do PAA das quais participa; preencher avaliações na matriz (subfator B de criticidade) |
| Coordenador de Equipe | Idem ao auditor; criar e editar Programa de Auditoria; propor inclusões/exclusões no PAA |
| Secretário de Auditoria | Acesso total; submeter PAA à Presidência; autorizar alterações; aprovar QACI; definir prazo de resposta |
| Presidência | Aprovar PAA e PALP; aprovar alterações em curso; visualizar painéis consolidados |
| Gestor Auditado | Responder ao QACI referente à sua unidade; visualizar trabalhos programados para sua área |
| CNJ | Visualizar ACAs previstas no PAA; enviar diretrizes e cronogramas de ACAs |

---

*Documento gerado com base na Especificação Técnico-Funcional do Sistema de Gestão de Auditorias Internas (TJCE, 2026) e na Metodologia para os Planos de Auditoria de Longo Prazo e Anual de Auditoria (TJCE, 2021). Deve ser lido em conjunto com as especificações dos demais módulos do sistema.*
