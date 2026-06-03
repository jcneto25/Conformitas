# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME IX – GESTÃO DE RISCOS DA AUDITORIA INTERNA (GR-AUDIN)

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume define os requisitos funcionais, estruturas de dados, regras de negócio, workflows e mecanismos analíticos necessários para implantação do processo de Gestão de Riscos da Auditoria Interna (GR-AUDIN).

O módulo tem por finalidade apoiar:

* Planejamento Baseado em Riscos (Risk-Based Internal Auditing – RBIA);
* Elaboração do Plano Anual de Auditoria (PAA);
* Priorização do Universo Auditável;
* Monitoramento do Ambiente de Riscos;
* Avaliação de Cobertura de Auditoria;
* Avaliação de Capacidade da AUDIN;
* Gestão do Apetite de Risco da Auditoria;
* Integração com Gestão de Riscos Institucional;
* Construção de Mapas de Calor;
* Identificação de Temas Emergentes;
* Definição de Auditorias Futuras;
* Suporte ao PQAUD;
* Suporte ao IA-CM.

---

# 2. FUNDAMENTAÇÃO NORMATIVA

O módulo deverá estar aderente a:

* Resolução CNJ nº 309/2020;
* Resolução CNJ nº 325/2020 (Gestão Estratégica);
* Resolução CNJ nº 347/2020 (Gestão de Riscos);
* COSO ERM;
* ISO 31000;
* Normas Globais de Auditoria Interna do IIA;
* Modelo IA-CM;
* Manual de Auditoria Interna do Poder Judiciário.

---

# 3. ARQUITETURA FUNCIONAL

```text
Gestão de Riscos da AUDIN
│
├── Universo Auditável
├── Inventário de Objetos Auditáveis
├── Cadastro de Riscos
├── Avaliação de Riscos
├── Matriz de Riscos
├── Mapa de Calor
├── Apetite de Risco
├── Cobertura de Auditoria
├── Planejamento Baseado em Riscos
├── Temas Emergentes
├── Indicadores de Risco
├── Integração com Gestão de Riscos Institucional
├── Painéis Gerenciais
└── Relatórios
```

---

# 4. UNIVERSO AUDITÁVEL

## 4.1 Objetivo

Manter o inventário completo dos objetos passíveis de auditoria.

---

## 4.2 Conceito

Universo Auditável representa o conjunto de:

* Processos;
* Macroprocessos;
* Sistemas;
* Projetos;
* Contratações;
* Programas;
* Unidades Organizacionais;
* Temas Estratégicos;
* Serviços Judiciais;
* Serviços Administrativos.

---

## 4.3 Entidade: UniversoAuditavel

| Campo              | Tipo    |
| ------------------ | ------- |
| Id                 | UUID    |
| Código             | Texto   |
| Nome               | Texto   |
| Tipo               | Enum    |
| UnidadeResponsável | Unidade |
| Criticidade        | Enum    |
| Status             | Enum    |
| DataCadastro       | Data    |
| Ativo              | Boolean |

---

# 5. INVENTÁRIO DE OBJETOS AUDITÁVEIS

## 5.1 Tipologias

### Processos de Negócio

### Processos Judiciais

### Processos Administrativos

### Contratações

### Tecnologia da Informação

### Segurança da Informação

### Gestão de Pessoas

### Governança

### Integridade

### LGPD

### Sustentabilidade

### Inovação

---

## 5.2 Hierarquia

```text
Objetivo Estratégico
        ↓
Macroprocesso
        ↓
Processo
        ↓
Subprocesso
        ↓
Objeto Auditável
```

---

# 6. CADASTRO DE RISCOS

## 6.1 Objetivo

Permitir gerenciamento estruturado dos riscos associados aos objetos auditáveis.

---

## 6.2 Entidade: RiscoAuditoria

| Campo           | Tipo        |
| --------------- | ----------- |
| Id              | UUID        |
| Código          | Texto       |
| Título          | Texto       |
| Descrição       | Texto Longo |
| Categoria       | Enum        |
| Tipo            | Enum        |
| ObjetoAuditável | UUID        |
| Proprietário    | Unidade     |
| Status          | Enum        |

---

## 6.3 Categorias

### Estratégico

### Operacional

### Financeiro

### Conformidade

### Integridade

### Tecnologia

### Continuidade

### Segurança da Informação

### Reputacional

### ESG

---

# 7. IDENTIFICAÇÃO DOS RISCOS

## 7.1 Fontes de Identificação

### Auditorias anteriores

### Monitoramentos

### Consultorias

### Gestão de Riscos Corporativa

### Correições

### Reclamações

### Ouvidoria

### Corregedoria

### CNJ

### Tribunal de Contas

### Indicadores Institucionais

### IA e Analytics

---

## 7.2 Registro Obrigatório

Todo risco deverá possuir:

* descrição;
* causa;
* consequência;
* fator gerador;
* categoria;
* unidade responsável.

---

# 8. AVALIAÇÃO DE RISCOS

## 8.1 Metodologia

A avaliação deverá utilizar:

* Probabilidade;
* Impacto;
* Velocidade;
* Vulnerabilidade;
* Detectabilidade.

---

## 8.2 Escala de Probabilidade

| Valor | Descrição   |
| ----- | ----------- |
| 1     | Muito Baixa |
| 2     | Baixa       |
| 3     | Média       |
| 4     | Alta        |
| 5     | Muito Alta  |

---

## 8.3 Escala de Impacto

| Valor | Descrição      |
| ----- | -------------- |
| 1     | Insignificante |
| 2     | Baixo          |
| 3     | Moderado       |
| 4     | Alto           |
| 5     | Crítico        |

---

## 8.4 Cálculo do Risco Inerente

---

## 8.5 Classificação

| Faixa | Classificação |
| ----- | ------------- |
| 1–4   | Baixo         |
| 5–9   | Moderado      |
| 10–16 | Alto          |
| 17–25 | Crítico       |

---

# 9. CONTROLES INTERNOS

## 9.1 Objetivo

Registrar controles mitigadores existentes.

---

## 9.2 Entidade: ControleInterno

| Campo       |
| ----------- |
| Código      |
| Nome        |
| Descrição   |
| Responsável |
| Tipo        |
| Efetividade |

---

## 9.3 Tipos

### Preventivo

### Detectivo

### Corretivo

### Compensatório

---

# 10. AVALIAÇÃO DOS CONTROLES

## 10.1 Escala

| Nível | Significado |
| ----- | ----------- |
| 1     | Inexistente |
| 2     | Fraco       |
| 3     | Parcial     |
| 4     | Adequado    |
| 5     | Forte       |

---

## 10.2 Resultado

Determinação automática da efetividade do controle.

---

# 11. RISCO RESIDUAL

## 11.1 Objetivo

Mensurar risco após consideração dos controles existentes.

---

## 11.2 Fórmula

---

## 11.3 Classificação

### Baixo

### Moderado

### Alto

### Crítico

---

# 12. MATRIZ DE RISCOS

## 12.1 Objetivo

Consolidar riscos avaliados.

---

## 12.2 Estrutura

| Campo            |
| ---------------- |
| Objeto Auditável |
| Risco            |
| Probabilidade    |
| Impacto          |
| Risco Inerente   |
| Controle         |
| Risco Residual   |
| Tratamento       |

---

## 12.3 Visualização

* tabela;
* matriz;
* gráfico;
* heatmap.

---

# 13. MAPA DE CALOR (HEATMAP)

## 13.1 Objetivo

Representar visualmente os riscos.

---

## 13.2 Estrutura

```text
Impacto
5 | Crítico
4 |
3 |
2 |
1 |
   1 2 3 4 5
    Probabilidade
```

---

## 13.3 Funcionalidades

* filtro por unidade;
* filtro por processo;
* filtro por categoria;
* filtro por exercício.

---

# 14. APETITE DE RISCO DA AUDIN

## 14.1 Objetivo

Definir nível de exposição aceitável para fins de planejamento.

---

## 14.2 Faixas

| Faixa    | Situação    |
| -------- | ----------- |
| Verde    | Aceitável   |
| Amarela  | Atenção     |
| Vermelha | Prioritária |

---

## 14.3 Utilização

O sistema deverá utilizar o apetite para:

* priorização do PAA;
* definição de auditorias;
* definição de monitoramentos.

---

# 15. PLANEJAMENTO BASEADO EM RISCOS

## 15.1 Objetivo

Selecionar auditorias a partir do nível de risco.

---

## 15.2 Critérios de Priorização

### Risco Residual

### Materialidade

### Relevância Estratégica

### Cobertura Histórica

### Demandas Externas

### Interesse da Administração

---

## 15.3 Índice de Priorização

---

# 16. COBERTURA DE AUDITORIA

## 16.1 Objetivo

Mensurar alcance da atividade de auditoria.

---

## 16.2 Indicador

---

## 16.3 Análises

### Cobertura por Processo

### Cobertura por Unidade

### Cobertura por Risco

### Cobertura por Categoria

---

# 17. TEMAS EMERGENTES

## 17.1 Objetivo

Identificar riscos novos ou em crescimento.

---

## 17.2 Fontes

### IA Generativa

### Cibersegurança

### LGPD

### ESG

### Integridade

### Contratações Públicas

### Inovação

### Transformação Digital

---

## 17.3 Alertas

O sistema deverá gerar alertas para riscos emergentes não cobertos pelo planejamento vigente.

---

# 18. INDICADORES DE RISCO

## 18.1 KRIs (Key Risk Indicators)

### Quantidade de Riscos Críticos

### Riscos sem Controle

### Riscos sem Cobertura de Auditoria

### Riscos Reincidentes

### Riscos Emergentes

---

## 18.2 Indicadores Estratégicos

### Exposição Institucional

### Cobertura de Auditoria

### Efetividade dos Controles

### Tendência de Risco

---

# 19. INTEGRAÇÃO COM AUDITORIAS

## 19.1 Integração Obrigatória

Cada auditoria deverá poder:

* consultar riscos;
* atualizar riscos;
* registrar novos riscos;
* vincular achados a riscos.

---

## 19.2 Integração com Achados

Todo achado relevante deverá permitir vinculação a:

* risco existente;
* novo risco;
* risco emergente.

---

# 20. INTEGRAÇÃO COM PQAUD

## 20.1 Objetivo

Avaliar maturidade da gestão de riscos da AUDIN.

---

## 20.2 Indicadores Compartilhados

### Cobertura Baseada em Riscos

### Atualização do Universo Auditável

### Evolução da Maturidade

### Efetividade do RBIA

---

# 21. DASHBOARDS

## 21.1 Dashboard Executivo

Indicadores:

* riscos críticos;
* riscos altos;
* cobertura;
* exposição institucional.

---

## 21.2 Dashboard Operacional

Indicadores:

* riscos cadastrados;
* riscos atualizados;
* riscos sem controle;
* riscos sem responsável.

---

## 21.3 Dashboard Estratégico

Indicadores:

* evolução dos riscos;
* tendências;
* temas emergentes;
* aderência ao apetite.

---

# 22. RELATÓRIOS

## 22.1 Relatórios Operacionais

### Inventário de Riscos

### Matriz de Riscos

### Controles Internos

### Universo Auditável

---

## 22.2 Relatórios Gerenciais

### Priorização do PAA

### Cobertura

### Exposição ao Risco

### Riscos Emergentes

---

## 22.3 Relatórios Estratégicos

### Perfil de Riscos da Organização

### Evolução Histórica

### Maturidade da Gestão de Riscos

---

# 23. WORKFLOW DE GESTÃO DE RISCOS

```text
Identificação
      ↓
Análise
      ↓
Avaliação
      ↓
Priorização
      ↓
Planejamento
      ↓
Monitoramento
      ↓
Revisão
```

---

# 24. REGRAS DE NEGÓCIO

## RN-GR-001

Todo risco deverá estar vinculado a um objeto auditável.

---

## RN-GR-002

Não será permitido excluir riscos vinculados a auditorias concluídas.

---

## RN-GR-003

Todo risco deverá possuir responsável institucional.

---

## RN-GR-004

Riscos críticos deverão gerar alerta automático.

---

## RN-GR-005

Todo risco sem controle associado deverá ser destacado nos dashboards.

---

## RN-GR-006

O universo auditável deverá ser revisado ao menos uma vez por exercício.

---

## RN-GR-007

A atualização do perfil de riscos deverá gerar nova versão histórica.

---

## RN-GR-008

O cálculo da priorização do PAA deverá ser automático e auditável.

---

## RN-GR-009

Todo risco emergente deverá ser submetido à avaliação da chefia da AUDIN.

---

## RN-GR-010

O histórico de avaliações de risco deverá ser permanente.

---

## RN-GR-011

Riscos associados a recomendações não implementadas deverão possuir marcação especial.

---

## RN-GR-012

A cobertura de auditoria deverá ser recalculada automaticamente após conclusão de auditorias.

---

# 25. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa do universo auditável.
2. Implementar metodologia estruturada de avaliação de riscos.
3. Gerar matriz de riscos e mapas de calor.
4. Implementar cálculo de risco inerente e residual.
5. Permitir definição de apetite de risco.
6. Implementar Planejamento Baseado em Riscos (RBIA).
7. Medir cobertura da atividade de auditoria.
8. Identificar riscos emergentes.
9. Integrar-se aos módulos de Planejamento, Auditorias, Achados, Monitoramento e PQAUD.
10. Gerar indicadores estratégicos de risco.
11. Possuir rastreabilidade integral das avaliações realizadas.
12. Atender aos requisitos da Resolução CNJ nº 309/2020, Resolução CNJ nº 347/2020, ISO 31000, COSO ERM, IA-CM e Normas Globais de Auditoria Interna.

---

# 26. SUBMÓDULO AVANÇADO – MATRIZ DINÂMICA DE PRIORIZAÇÃO DO PAA

## 26.1 Objetivo

Automatizar a construção do Plano Anual de Auditoria com base em critérios ponderados.

---

## 26.2 Variáveis Consideradas

* risco residual;
* materialidade;
* relevância estratégica;
* tempo desde última auditoria;
* demandas da administração;
* recomendações pendentes;
* criticidade dos achados históricos;
* exposição institucional.

---

## 26.3 Resultado

O sistema deverá gerar automaticamente:

* ranking dos objetos auditáveis;
* proposta preliminar do PAA;
* justificativas técnicas da seleção;
* trilha de auditoria das decisões de priorização.

---

## Dependências para os Próximos Volumes

As informações produzidas neste módulo serão consumidas diretamente por:

* **Volume X – Gestão de Competências e PAC-Aud**
* **Volume XI – Gestão Documental e Conhecimento**
* **Volume XIV – Relatório Anual de Atividades**
* **Volume XV – Business Intelligence e Analytics**
* **Volume XVI – Inteligência Analítica e IA Aplicada à Auditoria**

e constituem a principal base metodológica para implementação do Planejamento Baseado em Riscos (RBIA) e para o direcionamento estratégico da atividade de Auditoria Interna do Tribunal.
