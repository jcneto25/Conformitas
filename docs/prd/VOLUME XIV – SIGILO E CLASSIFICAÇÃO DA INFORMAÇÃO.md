# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME XIV – RELATÓRIO ANUAL DE ATIVIDADES, PRESTAÇÃO DE CONTAS E TRANSPARÊNCIA DA AUDITORIA INTERNA

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume estabelece os requisitos funcionais, operacionais e analíticos necessários para a elaboração, consolidação, aprovação, publicação e acompanhamento do Relatório Anual de Atividades da Auditoria Interna (RAAUD), bem como dos instrumentos de prestação de contas, transparência e reporte institucional.

O módulo deverá permitir:

* Elaboração automatizada do Relatório Anual de Atividades da Auditoria Interna (RAAUD);
* Consolidação automática de dados dos módulos do sistema;
* Prestação de contas da AUDIN;
* Geração de relatórios gerenciais e estratégicos;
* Transparência ativa;
* Produção de relatórios para o CNJ;
* Produção de relatórios para órgãos de controle;
* Geração de relatórios executivos;
* Publicação institucional;
* Gestão de indicadores anuais;
* Comparativos históricos;
* Consolidação de benefícios da auditoria;
* Consolidação da execução do PAA;
* Consolidação do PQAUD;
* Consolidação da maturidade IA-CM;
* Consolidação da gestão de riscos;
* Consolidação de recomendações e monitoramentos.

---

# 2. FUNDAMENTAÇÃO NORMATIVA

O módulo deverá observar:

* Resolução CNJ nº 309/2020;
* Lei nº 12.527/2011 (LAI);
* Lei nº 13.709/2018 (LGPD);
* Normas Globais de Auditoria Interna do IIA;
* Modelo IA-CM;
* Normas de Prestação de Contas do Tribunal;
* Planejamento Estratégico Institucional;
* Regulamento da Auditoria Interna.

---

# 3. VISÃO FUNCIONAL

```text
Relatório Anual e Prestação de Contas
│
├── Consolidação Automática
├── Relatório Anual de Atividades
├── Prestação de Contas
├── Benefícios da Auditoria
├── Indicadores Institucionais
├── Relatórios CNJ
├── Relatórios para Controle Externo
├── Transparência Ativa
├── Publicação Institucional
├── Painel Executivo
├── Comparativos Históricos
└── Gestão de Evidências do Relatório
```

---

# 4. RELATÓRIO ANUAL DE ATIVIDADES DA AUDITORIA INTERNA (RAAUD)

## 4.1 Objetivo

Produzir automaticamente o Relatório Anual de Atividades da Auditoria Interna.

---

## 4.2 Estrutura Padrão

### Mensagem Institucional

### Apresentação

### Estrutura da AUDIN

### Planejamento Executado

### Auditorias Realizadas

### Consultorias Realizadas

### Avaliações Executadas

### Benefícios Obtidos

### Gestão de Riscos

### PQAUD

### IA-CM

### Capacitação da Equipe

### Indicadores

### Desafios e Perspectivas

### Conclusão

---

## 4.3 Geração Automática

O sistema deverá preencher automaticamente todas as seções possíveis utilizando dados provenientes dos demais módulos.

---

# 5. CONSOLIDAÇÃO AUTOMÁTICA DE DADOS

## 5.1 Objetivo

Eliminar consolidações manuais.

---

## 5.2 Fontes

### Planejamento Anual

### Auditorias

### Consultorias

### Monitoramentos

### Gestão de Riscos

### PQAUD

### Capacitações

### Indicadores

### Banco de Benefícios

---

## 5.3 Frequência

* sob demanda;
* mensal;
* trimestral;
* anual.

---

# 6. GESTÃO DE BENEFÍCIOS DA AUDITORIA

## 6.1 Objetivo

Mensurar valor gerado pela Auditoria Interna.

---

## 6.2 Categorias

### Financeiros

### Não Financeiros

### Operacionais

### Estratégicos

### Governança

### Integridade

### Compliance

---

## 6.3 Entidade Beneficio

| Campo              | Tipo      |
| ------------------ | --------- |
| Id                 | UUID      |
| Categoria          | Enum      |
| Descrição          | Texto     |
| ValorEstimado      | Decimal   |
| UnidadeBeneficiada | UUID      |
| AuditoriaOrigem    | UUID      |
| Evidência          | Documento |

---

# 7. BENEFÍCIOS FINANCEIROS

## 7.1 Categorias

### Economia Gerada

### Recuperação de Valores

### Redução de Despesas

### Evitação de Gastos

### Otimização Contratual

---

## 7.2 Cálculo

O sistema deverá permitir metodologia configurável.

---

# 8. BENEFÍCIOS NÃO FINANCEIROS

## 8.1 Categorias

### Melhoria de Processos

### Fortalecimento de Controles

### Mitigação de Riscos

### Aprimoramento da Governança

### Melhoria da Transparência

### Conformidade Regulatória

---

# 9. EXECUÇÃO DO PAA

## 9.1 Objetivo

Demonstrar execução do Plano Anual de Auditoria.

---

## 9.2 Indicadores

* auditorias planejadas;
* auditorias executadas;
* auditorias canceladas;
* auditorias reprogramadas;
* percentual de execução.

---

## 9.3 Indicador Principal

---

# 10. CONSOLIDAÇÃO DAS AUDITORIAS

## 10.1 Informações Consolidadas

### Quantidade Executada

### Horas Consumidas

### Achados

### Recomendações

### Benefícios

### Cobertura de Riscos

---

## 10.2 Agrupamentos

* por tema;
* por unidade;
* por macroprocesso;
* por criticidade.

---

# 11. CONSOLIDAÇÃO DAS CONSULTORIAS

## 11.1 Dados

### Quantidade

### Demandantes

### Benefícios

### Horas Empregadas

### Temáticas

---

# 12. CONSOLIDAÇÃO DOS MONITORAMENTOS

## 12.1 Indicadores

### Recomendações Monitoradas

### Implementadas

### Parcialmente Implementadas

### Não Implementadas

### Em Atraso

---

## 12.2 Indicador

---

# 13. CONSOLIDAÇÃO DA GESTÃO DE RISCOS

## 13.1 Informações

### Riscos Avaliados

### Riscos Críticos

### Riscos Mitigados

### Exposição Residual

### Evolução dos Riscos

---

# 14. CONSOLIDAÇÃO DO PQAUD

## 14.1 Objetivo

Apresentar resultados do Programa de Qualidade.

---

## 14.2 Informações

### Avaliações Internas

### Avaliações Externas

### Não Conformidades

### Planos de Melhoria

### Índice de Qualidade

---

# 15. CONSOLIDAÇÃO IA-CM

## 15.1 Objetivo

Evidenciar maturidade da Auditoria Interna.

---

## 15.2 Informações

### Nível Atual

### Evolução Histórica

### Capacidades Implementadas

### Lacunas

### Plano Evolutivo

---

# 16. CONSOLIDAÇÃO DE CAPACITAÇÃO

## 16.1 Informações

### Horas de Capacitação

### Certificações

### PAC-Aud

### Competências Desenvolvidas

---

# 17. INDICADORES INSTITUCIONAIS

## 17.1 Objetivo

Apresentar desempenho consolidado da AUDIN.

---

## 17.2 Indicadores Obrigatórios

### Execução do PAA

### Cobertura de Riscos

### Implementação de Recomendações

### Benefícios Gerados

### Índice de Qualidade

### Horas de Capacitação

### Maturidade IA-CM

---

# 18. COMPARATIVOS HISTÓRICOS

## 18.1 Objetivo

Demonstrar evolução institucional.

---

## 18.2 Comparações

### Últimos 5 anos

### Últimos 10 anos

### Períodos Configuráveis

---

## 18.3 Indicadores

* auditorias;
* benefícios;
* qualidade;
* riscos;
* maturidade.

---

# 19. PRESTAÇÃO DE CONTAS

## 19.1 Objetivo

Fornecer informações para órgãos de controle.

---

## 19.2 Destinatários

### Presidência

### Conselho da Magistratura

### Comitês de Governança

### CNJ

### Tribunal de Contas

### Controle Interno

---

## 19.3 Formatos

### PDF

### Word

### Excel

### HTML

---

# 20. TRANSPARÊNCIA ATIVA

## 20.1 Objetivo

Publicar informações não sigilosas.

---

## 20.2 Conteúdo Publicável

### Plano Anual

### Relatório Anual

### Indicadores

### Benefícios Consolidados

### Informações Estatísticas

---

## 20.3 Restrições

Dados sigilosos ou protegidos pela LGPD deverão ser anonimizados ou suprimidos.

---

# 21. PUBLICAÇÃO INSTITUCIONAL

## 21.1 Objetivo

Controlar ciclo de publicação.

---

## 21.2 Workflow

```text
Elaboração
      ↓
Revisão
      ↓
Validação
      ↓
Aprovação
      ↓
Publicação
      ↓
Arquivamento
```

---

# 22. GESTÃO DE EVIDÊNCIAS DO RELATÓRIO

## 22.1 Objetivo

Permitir rastreabilidade das informações apresentadas.

---

## 22.2 Funcionalidades

### Vinculação Automática

### Evidências de Origem

### Auditoria das Informações

### Validação dos Dados

---

# 23. DASHBOARD EXECUTIVO DA AUDIN

## 23.1 Presidência

Indicadores estratégicos consolidados.

---

## 23.2 Alta Administração

Indicadores de desempenho, riscos e benefícios.

---

## 23.3 AUDIN

Indicadores operacionais e gerenciais.

---

# 24. RELATÓRIOS GERENCIAIS

## 24.1 Operacionais

### Execução do Plano

### Auditorias

### Consultorias

### Recomendações

---

## 24.2 Gerenciais

### Benefícios

### Qualidade

### Capacitação

### Governança

---

## 24.3 Estratégicos

### Relatório Anual

### Prestação de Contas

### Evolução Institucional

---

# 25. SUBMÓDULO AVANÇADO – GERADOR AUTOMÁTICO DO RAAUD

## 25.1 Objetivo

Produzir automaticamente a minuta do relatório anual.

---

## 25.2 Funcionalidades

### Consolidação Automática

### Geração de Narrativas

### Geração de Gráficos

### Geração de Tabelas

### Revisão Assistida por IA

---

## 25.3 Resultado

Produção automática de versão preliminar para validação da AUDIN.

---

# 26. SUBMÓDULO AVANÇADO – BANCO DE BENEFÍCIOS DA AUDITORIA

## 26.1 Objetivo

Manter histórico institucional de benefícios.

---

## 26.2 Funcionalidades

### Cadastro

### Consolidação

### Validação

### Evidenciação

### Comparação Histórica

---

## 26.3 Uso

* prestação de contas;
* relatórios;
* BI;
* indicadores estratégicos.

---

# 27. REGRAS DE NEGÓCIO

## RN-RAAUD-001

Todo benefício deverá possuir auditoria de origem.

---

## RN-RAAUD-002

Toda informação consolidada deverá possuir rastreabilidade.

---

## RN-RAAUD-003

O relatório anual deverá ser gerado a partir dos dados oficiais do sistema.

---

## RN-RAAUD-004

Dados publicados deverão respeitar a LGPD.

---

## RN-RAAUD-005

O sistema deverá recalcular automaticamente indicadores quando houver alterações.

---

## RN-RAAUD-006

Benefícios financeiros deverão possuir metodologia documentada.

---

## RN-RAAUD-007

Toda publicação deverá possuir aprovação formal.

---

## RN-RAAUD-008

O histórico anual deverá ser preservado permanentemente.

---

## RN-RAAUD-009

As evidências utilizadas no relatório deverão permanecer acessíveis.

---

## RN-RAAUD-010

O relatório anual deverá permitir complementações manuais autorizadas.

---

## RN-RAAUD-011

Toda informação consolidada deverá indicar sua origem.

---

## RN-RAAUD-012

O sistema deverá permitir reaproveitamento de informações em relatórios futuros.

---

# 28. REQUISITOS NÃO FUNCIONAIS ESPECÍFICOS

## RNF-RAAUD-001

Geração de relatório completo em até 5 minutos.

---

## RNF-RAAUD-002

Exportação simultânea para PDF, DOCX e XLSX.

---

## RNF-RAAUD-003

Capacidade de armazenamento histórico ilimitado.

---

## RNF-RAAUD-004

Rastreabilidade integral das informações consolidadas.

---

## RNF-RAAUD-005

Compatibilidade com ferramentas de BI.

---

## RNF-RAAUD-006

Capacidade de publicação em portal institucional.

---

# 29. MATRIZ DE FONTES DE DADOS

| Módulo Origem | Dados Consumidos           |
| ------------- | -------------------------- |
| Planejamento  | PAA, auditorias planejadas |
| Execução      | Auditorias realizadas      |
| Monitoramento | Recomendações              |
| Riscos        | Riscos avaliados           |
| PQAUD         | Avaliações                 |
| Capacitação   | PAC-Aud                    |
| Conhecimento  | Boas práticas              |
| BI            | Indicadores consolidados   |

---

# 30. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Gerar automaticamente o Relatório Anual de Atividades.
2. Consolidar informações de todos os módulos do sistema.
3. Controlar benefícios financeiros e não financeiros.
4. Gerar indicadores institucionais.
5. Permitir prestação de contas para órgãos internos e externos.
6. Implementar transparência ativa.
7. Produzir relatórios executivos.
8. Manter rastreabilidade das informações.
9. Integrar-se ao BI institucional.
10. Atender às exigências da Resolução CNJ nº 309/2020.
11. Permitir geração assistida por IA.
12. Disponibilizar histórico institucional permanente.

---

## Dependências para os Próximos Volumes

As informações consolidadas neste módulo serão consumidas diretamente por:

* **Volume XV – Business Intelligence, Analytics e Indicadores Estratégicos**
* **Volume XVI – Inteligência Artificial e Auditoria Aumentada**
* **Volume XVII – Portal Executivo e Governança da Auditoria**
* **Volume XVIII – Ecossistema Integrado de Governança, Riscos e Controle**

Este volume representa a principal camada de prestação de contas, transparência, demonstração de valor e comunicação institucional da Auditoria Interna, transformando os dados operacionais produzidos pelos demais módulos em informações estratégicas para a alta administração e órgãos de controle.
