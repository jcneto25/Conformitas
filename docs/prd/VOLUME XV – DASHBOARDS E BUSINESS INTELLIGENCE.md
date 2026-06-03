# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME XV – BUSINESS INTELLIGENCE, ANALYTICS, INDICADORES E APOIO À DECISÃO

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume estabelece os requisitos funcionais, analíticos, estatísticos e tecnológicos para a implementação da camada de Business Intelligence (BI), Analytics e Inteligência Gerencial da Auditoria Interna.

O módulo deverá permitir:

* Consolidação corporativa de indicadores;
* Business Intelligence da Auditoria Interna;
* Analytics Operacional;
* Analytics Gerencial;
* Analytics Estratégico;
* Dashboards executivos;
* Painéis operacionais;
* Painéis de riscos;
* Painéis de monitoramento;
* Painéis de qualidade (PQAUD);
* Painéis IA-CM;
* Indicadores de desempenho (KPIs);
* Indicadores de produtividade;
* Indicadores de benefícios;
* Indicadores de riscos;
* Indicadores de maturidade;
* Benchmarking institucional;
* Data Warehouse Analítico;
* Data Marts especializados;
* Alertas inteligentes;
* Apoio à tomada de decisão.

O módulo deverá transformar os dados operacionais do sistema em inteligência estratégica para a alta administração.

---

# 2. FUNDAMENTAÇÃO NORMATIVA

O módulo deverá observar:

* Resolução CNJ nº 309/2020;
* Normas Globais de Auditoria Interna do IIA;
* Modelo IA-CM;
* COSO;
* ISO 9001;
* ISO 31000;
* Planejamento Estratégico Institucional;
* Política de Governança do Tribunal.

---

# 3. VISÃO ARQUITETURAL

```text
Business Intelligence e Analytics
│
├── Data Warehouse
├── Data Marts
├── Indicadores Estratégicos
├── Indicadores Operacionais
├── Dashboards
├── Analytics Avançado
├── Benchmarking
├── Alertas Inteligentes
├── Painéis Executivos
├── Painéis Gerenciais
├── Painéis Operacionais
├── Cubos Analíticos
├── Self-Service BI
└── Apoio à Decisão
```

---

# 4. ARQUITETURA ANALÍTICA

## 4.1 Camadas

```text
Sistemas Operacionais
          ↓
ODS
          ↓
Data Warehouse
          ↓
Data Marts
          ↓
Analytics
          ↓
Dashboards
```

---

## 4.2 Fontes de Dados

### Planejamento

### Auditorias

### Consultorias

### Riscos

### Monitoramento

### PQAUD

### IA-CM

### Capacitação

### Conhecimento

### Integrações Corporativas

---

# 5. DATA WAREHOUSE DA AUDITORIA

## 5.1 Objetivo

Centralizar informações históricas para análise multidimensional.

---

## 5.2 Fatos Principais

### F_Auditorias

### F_Recomendações

### F_Monitoramentos

### F_Riscos

### F_Benefícios

### F_Capacitações

### F_Avaliações

---

## 5.3 Dimensões

### D_Tempo

### D_Unidade

### D_Auditor

### D_Macroprocesso

### D_Risco

### D_Tema

### D_Criticidade

---

# 6. DATA MART DE AUDITORIAS

## 6.1 Objetivo

Analisar execução dos trabalhos.

---

## 6.2 Indicadores

* auditorias realizadas;
* horas executadas;
* produtividade;
* cobertura.

---

## 6.3 Análises

* por auditor;
* por equipe;
* por unidade;
* por exercício.

---

# 7. DATA MART DE RISCOS

## 7.1 Objetivo

Analisar exposição institucional.

---

## 7.2 Indicadores

### Quantidade de Riscos

### Riscos Críticos

### Exposição Residual

### Evolução da Maturidade

---

# 8. DATA MART DE MONITORAMENTO

## 8.1 Objetivo

Monitorar implementação das recomendações.

---

## 8.2 Indicadores

### Recomendações Emitidas

### Implementadas

### Em Atraso

### Vencidas

### Não Implementadas

---

# 9. DATA MART DE QUALIDADE

## 9.1 Objetivo

Avaliar desempenho do PQAUD.

---

## 9.2 Indicadores

### Índice de Conformidade

### Não Conformidades

### Planos de Melhoria

### Avaliações Concluídas

---

# 10. CATÁLOGO DE KPIs

## 10.1 Estrutura

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Nome        | Texto   |
| Fórmula     | Texto   |
| Frequência  | Enum    |
| Meta        | Decimal |
| Responsável | Usuário |

---

## 10.2 Categorias

### Estratégicos

### Gerenciais

### Operacionais

### Qualidade

### Governança

### Riscos

---

# 11. INDICADORES ESTRATÉGICOS DA AUDIN

## 11.1 Execução do Plano Anual

Indicador percentual de execução do planejamento.

---

## 11.2 Cobertura de Riscos

Percentual dos riscos estratégicos auditados.

---

## 11.3 Implementação de Recomendações

Percentual de recomendações implementadas.

---

## 11.4 Benefícios Gerados

Valor financeiro e não financeiro agregado.

---

## 11.5 Índice de Qualidade

Resultado consolidado do PQAUD.

---

## 11.6 Maturidade IA-CM

Nível institucional alcançado.

---

# 12. INDICADORES OPERACIONAIS

## 12.1 Produtividade

* horas por auditoria;
* horas por auditor;
* produtividade da equipe.

---

## 12.2 Prazos

* prazo planejado;
* prazo executado;
* desvios.

---

## 12.3 Eficiência

* taxa de retrabalho;
* tempo médio de execução;
* taxa de aprovação.

---

# 13. INDICADORES DE RISCOS

## 13.1 Cobertura

* riscos avaliados;
* riscos não avaliados.

---

## 13.2 Criticidade

* alto;
* médio;
* baixo.

---

## 13.3 Tendência

* crescente;
* estável;
* decrescente.

---

# 14. INDICADORES DE BENEFÍCIOS

## 14.1 Financeiros

* economia gerada;
* redução de custos;
* recuperação de valores.

---

## 14.2 Não Financeiros

* melhoria de processos;
* fortalecimento de controles;
* melhoria da governança.

---

# 15. INDICADORES DE QUALIDADE

## 15.1 PQAUD

* conformidade;
* efetividade;
* melhoria contínua.

---

## 15.2 Auditorias

* satisfação;
* aderência metodológica;
* qualidade documental.

---

# 16. DASHBOARD EXECUTIVO

## 16.1 Público-Alvo

### Presidência

### Corregedoria

### Comitê de Governança

### Alta Administração

---

## 16.2 Componentes

### KPIs Estratégicos

### Mapa de Riscos

### Benefícios

### Execução do Plano

### Qualidade

---

# 17. DASHBOARD GERENCIAL

## 17.1 Público-Alvo

### Chefe da AUDIN

### Coordenadores

### Supervisores

---

## 17.2 Componentes

### Auditorias

### Recursos

### Prazos

### Produtividade

### Monitoramento

---

# 18. DASHBOARD OPERACIONAL

## 18.1 Público-Alvo

### Auditores

### Equipes

---

## 18.2 Componentes

### Minhas Auditorias

### Minhas Pendências

### Evidências

### Recomendações

### Tarefas

---

# 19. SCORECARD ESTRATÉGICO

## 19.1 Objetivo

Avaliar contribuição da Auditoria Interna para a estratégia institucional.

---

## 19.2 Perspectivas

### Governança

### Riscos

### Processos

### Pessoas

### Resultados

---

# 20. BENCHMARKING

## 20.1 Objetivo

Comparar desempenho ao longo do tempo e entre instituições.

---

## 20.2 Comparações

### Histórico

### Outras Unidades

### Outros Tribunais

### Referenciais CNJ

---

# 21. SELF-SERVICE BI

## 21.1 Objetivo

Permitir criação de análises pelos usuários.

---

## 21.2 Funcionalidades

### Construção de Consultas

### Filtros

### Gráficos

### Tabelas Dinâmicas

### Exportação

---

## 21.3 Controle

Respeitar permissões e classificação da informação.

---

# 22. ALERTAS INTELIGENTES

## 22.1 Objetivo

Identificar desvios automaticamente.

---

## 22.2 Alertas

### Auditorias em atraso

### Recomendações vencidas

### Riscos críticos

### Indicadores abaixo da meta

### Não conformidades

---

## 22.3 Notificações

* sistema;
* e-mail;
* integração corporativa.

---

# 23. ANÁLISE MULTIDIMENSIONAL (OLAP)

## 23.1 Operações

### Drill Down

### Drill Up

### Slice

### Dice

### Pivot

---

## 23.2 Dimensões

### Tempo

### Unidade

### Auditor

### Tema

### Criticidade

---

# 24. EXPORTAÇÃO ANALÍTICA

## 24.1 Formatos

### XLSX

### CSV

### PDF

### JSON

### API

---

## 24.2 Controle

Toda exportação deverá ser auditada.

---

# 25. GOVERNANÇA DOS INDICADORES

## 25.1 Objetivo

Garantir consistência dos indicadores.

---

## 25.2 Elementos

### Proprietário

### Fórmula

### Meta

### Periodicidade

### Fonte

### Histórico

---

# 26. SUBMÓDULO AVANÇADO – CENTRO DE INTELIGÊNCIA DA AUDITORIA

## 26.1 Objetivo

Concentrar análises estratégicas da AUDIN.

---

## 26.2 Funcionalidades

### Consolidação Corporativa

### Painéis Estratégicos

### Simulações

### Tendências

### Apoio à Decisão

---

## 26.3 Usuários

### Presidência

### Administração Superior

### AUDIN

---

# 27. SUBMÓDULO AVANÇADO – OBSERVATÓRIO DE RISCOS E CONTROLES

## 27.1 Objetivo

Monitorar continuamente riscos institucionais.

---

## 27.2 Funcionalidades

### Mapa Dinâmico

### Evolução Histórica

### Correlação de Indicadores

### Alertas Preventivos

### Heatmaps

---

## 27.3 Integrações

* gestão de riscos;
* planejamento;
* monitoramento;
* BI.

---

# 28. SUBMÓDULO AVANÇADO – PORTAL DE INDICADORES DA AUDIN

## 28.1 Objetivo

Disponibilizar indicadores institucionais para consulta.

---

## 28.2 Funcionalidades

### Catálogo de Indicadores

### Metadados

### Histórico

### Metas

### Comparativos

---

# 29. RELATÓRIOS ANALÍTICOS

## 29.1 Operacionais

### Produtividade

### Prazos

### Monitoramento

### Auditorias

---

## 29.2 Gerenciais

### Qualidade

### Benefícios

### Governança

### Riscos

---

## 29.3 Estratégicos

### Performance da AUDIN

### Evolução Institucional

### Maturidade IA-CM

### Prestação de Contas

---

# 30. REGRAS DE NEGÓCIO

## RN-BI-001

Todo indicador deverá possuir fórmula documentada.

---

## RN-BI-002

Toda informação analítica deverá possuir fonte identificada.

---

## RN-BI-003

Os indicadores deverão ser recalculados automaticamente conforme periodicidade configurada.

---

## RN-BI-004

Toda alteração em indicadores deverá gerar histórico.

---

## RN-BI-005

Dashboards deverão respeitar o perfil de acesso do usuário.

---

## RN-BI-006

Indicadores estratégicos deverão manter histórico permanente.

---

## RN-BI-007

Toda exportação deverá ser auditada.

---

## RN-BI-008

Dados utilizados em relatórios estratégicos deverão ser rastreáveis.

---

## RN-BI-009

Alertas deverão ser gerados automaticamente quando metas forem descumpridas.

---

## RN-BI-010

Toda análise deverá respeitar classificações de sigilo e LGPD.

---

## RN-BI-011

Indicadores corporativos deverão possuir responsável institucional.

---

## RN-BI-012

As informações utilizadas em benchmarking deverão possuir validação metodológica.

---

# 31. REQUISITOS NÃO FUNCIONAIS ESPECÍFICOS

## RNF-BI-001

Atualização incremental de indicadores.

---

## RNF-BI-002

Tempo máximo de carregamento de dashboards: 5 segundos.

---

## RNF-BI-003

Suporte a milhões de registros históricos.

---

## RNF-BI-004

Compatibilidade com Power BI, Metabase e Superset.

---

## RNF-BI-005

Suporte a Data Warehouse corporativo.

---

## RNF-BI-006

Disponibilidade mínima de 99,5%.

---

## RNF-BI-007

Suporte a consultas analíticas concorrentes.

---

## RNF-BI-008

Escalabilidade horizontal para crescimento institucional.

---

# 32. MATRIZ DE INDICADORES ESTRATÉGICOS DA AUDIN

| Indicador                      | Fonte            | Frequência |
| ------------------------------ | ---------------- | ---------- |
| Execução do PAA                | Planejamento     | Mensal     |
| Cobertura de Riscos            | Gestão de Riscos | Mensal     |
| Implementação de Recomendações | Monitoramento    | Mensal     |
| Benefícios Financeiros         | Auditorias       | Trimestral |
| Benefícios Não Financeiros     | Auditorias       | Trimestral |
| Índice PQAUD                   | Qualidade        | Semestral  |
| Maturidade IA-CM               | IA-CM            | Anual      |
| Horas de Capacitação           | Capacitação      | Mensal     |
| Produtividade da Equipe        | Auditorias       | Mensal     |
| Tempo Médio de Auditoria       | Auditorias       | Mensal     |

---

# 33. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Implementar Data Warehouse da Auditoria Interna.
2. Disponibilizar Data Marts especializados.
3. Possuir catálogo corporativo de indicadores.
4. Disponibilizar dashboards executivos, gerenciais e operacionais.
5. Implementar analytics multidimensional (OLAP).
6. Implementar alertas inteligentes baseados em indicadores.
7. Possibilitar benchmarking institucional.
8. Disponibilizar ambiente Self-Service BI.
9. Garantir rastreabilidade completa dos dados analíticos.
10. Integrar-se aos módulos de Planejamento, Auditoria, Riscos, PQAUD e IA-CM.
11. Atender aos requisitos da Resolução CNJ nº 309/2020.
12. Constituir a camada oficial de inteligência e apoio à decisão da Auditoria Interna.

---

## Dependências para os Próximos Volumes

Os ativos analíticos produzidos neste volume serão utilizados diretamente por:

* **Volume XVI – Inteligência Artificial e Auditoria Aumentada**
* **Volume XVII – Portal Executivo e Governança da Auditoria**
* **Volume XVIII – Ecossistema Integrado de Governança, Riscos, Controle e Compliance**
* **Volume XIX – Auditoria Contínua e Monitoramento Inteligente**

Este volume constitui a camada corporativa de inteligência analítica da Auditoria Interna, responsável por transformar dados operacionais em informação gerencial, conhecimento institucional e suporte estratégico à tomada de decisão.
