# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME III – PLANEJAMENTO ESTRATÉGICO E OPERACIONAL

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume especifica os requisitos funcionais e regras de negócio relacionados ao processo de Planejamento Estratégico e Operacional da Auditoria Interna.

O módulo deverá suportar integralmente:

* Planejamento baseado em riscos;
* Elaboração do PALP;
* Elaboração do PAA;
* Gestão do Universo Auditável;
* Priorização de Auditorias;
* Avaliação dos Controles Internos (QACI);
* Gestão da Capacidade Operacional;
* Simulações de Cenários;
* Cobertura do Universo Auditável;
* Cobertura do PALP;
* Planejamento de Auditorias Coordenadas (ACA);
* Planejamento do PAC-Aud.

---

# 2. ARQUITETURA FUNCIONAL DO MÓDULO

```text
Planejamento Estratégico e Operacional
│
├── Universo Auditável
├── Estrutura de Processos
├── Objetivos Estratégicos
├── Gestão de Riscos Institucionais
├── QACI
├── Matriz de Priorização
├── PALP
├── PAA
├── Capacidade Operacional
├── Simulação de Cenários
├── ACA
├── PAC-Aud
└── Dashboards
```

---

# 3. UNIVERSO AUDITÁVEL

## 3.1 Objetivo

Manter o cadastro estruturado de todos os objetos passíveis de auditoria.

O universo auditável servirá como base para:

* PALP;
* PAA;
* Matriz de Priorização;
* Planejamento Baseado em Riscos.

---

## 3.2 Estrutura Hierárquica

O sistema deverá suportar obrigatoriamente quatro níveis:

```text
Macroprocesso
    ↓
Grupo de Processo
    ↓
Processo
    ↓
Subprocesso
```

---

## 3.3 Entidade: Macroprocesso

### Campos

| Campo       | Tipo        | Obrigatório |
| ----------- | ----------- | ----------- |
| Id          | UUID        | Sim         |
| Código      | Texto       | Sim         |
| Nome        | Texto       | Sim         |
| Descrição   | Texto Longo | Sim         |
| Responsável | Usuário     | Sim         |
| Status      | Enum        | Sim         |

---

## 3.4 Entidade: Grupo de Processo

### Campos

| Campo           | Tipo  |
| --------------- | ----- |
| Id              | UUID  |
| MacroprocessoId | UUID  |
| Código          | Texto |
| Nome            | Texto |
| Descrição       | Texto |

---

## 3.5 Entidade: Processo

### Campos

| Campo           | Tipo    |
| --------------- | ------- |
| Id              | UUID    |
| GrupoProcessoId | UUID    |
| Nome            | Texto   |
| Descrição       | Texto   |
| Responsável     | Usuário |

---

## 3.6 Entidade: Subprocesso

### Campos

| Campo      | Tipo  |
| ---------- | ----- |
| Id         | UUID  |
| ProcessoId | UUID  |
| Nome       | Texto |
| Descrição  | Texto |

---

## 3.7 Integração

O sistema deverá permitir sincronização futura com:

* Cadeia Integrada de Processos do Tribunal;
* Escritório de Processos;
* Sistema de Governança.

---

# 4. OBJETIVOS ESTRATÉGICOS

## 4.1 Finalidade

Relacionar auditorias aos objetivos estratégicos institucionais.

---

## 4.2 Entidade: Objetivo Estratégico

### Campos

| Campo       | Tipo  |
| ----------- | ----- |
| Id          | UUID  |
| Código      | Texto |
| Nome        | Texto |
| Descrição   | Texto |
| Perspectiva | Enum  |

---

## 4.3 Relacionamentos

```text
Objetivo Estratégico
     ↓
Macroprocesso
     ↓
Processo
     ↓
Auditoria
```

---

# 5. GESTÃO DE RISCOS PARA PLANEJAMENTO

## 5.1 Objetivo

Identificar riscos associados aos objetos auditáveis.

---

## 5.2 Entidade: Risco de Planejamento

### Campos

| Campo         | Tipo    |
| ------------- | ------- |
| Id            | UUID    |
| ProcessoId    | UUID    |
| Descrição     | Texto   |
| Categoria     | Enum    |
| Probabilidade | Inteiro |
| Impacto       | Inteiro |
| Criticidade   | Inteiro |

---

## 5.3 Categorias

* Estratégico
* Operacional
* Financeiro
* Tecnologia
* Integridade
* Conformidade

---

# 6. QACI – QUESTIONÁRIO DE AVALIAÇÃO DE CONTROLE INTERNO

## 6.1 Objetivo

Avaliar a maturidade dos controles internos.

---

## 6.2 Estrutura

```text
QACI
   ↓
Blocos
   ↓
Perguntas
   ↓
Respostas
```

---

## 6.3 Blocos Obrigatórios

### Ambiente de Controle

### Avaliação de Riscos

### Atividades de Controle

### Informação e Comunicação

### Monitoramento

---

## 6.4 Escala de Avaliação

| Valor | Significado |
| ----- | ----------- |
| 1     | Inexistente |
| 2     | Inicial     |
| 3     | Parcial     |
| 4     | Adequado    |
| 5     | Otimizado   |

---

## 6.5 Cálculo

O sistema deverá calcular:

```text
Média dos Blocos
↓
Índice de Controle Interno
```

---

## 6.6 Resultado

Classificação:

| Faixa     | Resultado |
| --------- | --------- |
| 1,0 - 1,9 | Crítico   |
| 2,0 - 2,9 | Fraco     |
| 3,0 - 3,9 | Moderado  |
| 4,0 - 4,4 | Bom       |
| 4,5 - 5,0 | Excelente |

---

# 7. MATRIZ DE PRIORIZAÇÃO

## 7.1 Objetivo

Selecionar auditorias de forma objetiva.

---

## 7.2 Critérios

### Materialidade

Peso:

15%

---

### Relevância

Peso:

30%

---

### Criticidade

Peso:

30%

---

### Risco

Peso:

25%

---

## 7.3 Fórmula

```text
Nota Final =
(Materialidade × 0,15)
+
(Relevância × 0,30)
+
(Criticidade × 0,30)
+
(Risco × 0,25)
```

---

## 7.4 Escala

Cada fator:

```text
1 a 5
```

---

## 7.5 Resultado

| Faixa     | Prioridade |
| --------- | ---------- |
| 4,0 - 5,0 | Muito Alta |
| 3,0 - 3,9 | Alta       |
| 2,0 - 2,9 | Média      |
| 1,0 - 1,9 | Baixa      |

---

# 8. PALP

## 8.1 Objetivo

Gerenciar o Plano de Auditoria de Longo Prazo.

---

## 8.2 Horizonte

4 anos.

---

## 8.3 Estrutura

### Exercício

### Objetivos

### Processos Selecionados

### Justificativas

### Cobertura

---

## 8.4 Workflow

```text
Rascunho
 ↓
Revisão Técnica
 ↓
Aprovação AUDIN
 ↓
Aprovação Presidência
 ↓
Publicado
```

---

## 8.5 Cobertura do PALP

O sistema deverá calcular:

```text
Processos Planejados
÷
Universo Auditável
```

---

## 8.6 Indicadores

* Cobertura total
* Cobertura por macroprocesso
* Cobertura por risco
* Cobertura por objetivo estratégico

---

# 9. PAA

## 9.1 Objetivo

Gerenciar o Plano Anual de Auditoria.

---

## 9.2 Entradas

* PALP
* Matriz de Priorização
* Capacidade Operacional
* ACA
* PAC-Aud
* Determinações Institucionais

---

## 9.3 Auditorias Mandatórias

O sistema deverá prever inclusão automática de:

### Prestação de Contas

### ACA

### Monitoramentos Pendentes

### Demandas da Presidência

### Obrigações Normativas

---

## 9.4 Estrutura

Cada item do PAA deverá conter:

| Campo           |
| --------------- |
| Objeto          |
| Objetivo        |
| Escopo          |
| Tipo            |
| Risco           |
| Prioridade      |
| Equipe          |
| Horas Previstas |
| Prazo           |

---

## 9.5 Workflow

```text
Rascunho
 ↓
Análise Técnica
 ↓
Aprovação AUDIN
 ↓
Aprovação Presidência
 ↓
Publicado
```

---

# 10. ALTERAÇÕES DO PAA

## 10.1 Objetivo

Controlar revisões formais.

---

## 10.2 Motivos

* Nova determinação
* Nova auditoria coordenada
* Restrição de recursos
* Risco emergente

---

## 10.3 Campos Obrigatórios

* Justificativa
* Responsável
* Data
* Aprovação

---

## 10.4 Workflow

```text
Solicitação
 ↓
Justificativa
 ↓
Análise
 ↓
Aprovação
 ↓
Publicação
```

---

# 11. CAPACIDADE OPERACIONAL

## 11.1 Objetivo

Calcular a capacidade real da AUDIN.

---

## 11.2 Entidade

CapacidadeOperacionalAnual

---

## 11.3 Campos

| Campo                |
| -------------------- |
| Exercício            |
| Quantidade Auditores |
| Dias Úteis           |
| Férias               |
| Licenças             |
| Capacitações         |
| ACA                  |
| Reserva Técnica      |

---

## 11.4 Fórmula

```text
Capacidade Disponível =
Dias Úteis
-
Férias
-
Licenças
-
Capacitações
-
Reservas
```

---

# 12. DISTRIBUIÇÃO AUTOMÁTICA DE CARGA

## 12.1 Objetivo

Distribuir trabalhos automaticamente.

---

## 12.2 Critérios

### Disponibilidade

### Especialidade

### Experiência

### Conflitos de Interesse

### Independência

---

## 12.3 Resultado

Sugestão automática de equipe.

---

# 13. SIMULAÇÃO DE CENÁRIOS

## 13.1 Objetivo

Permitir análises prospectivas.

---

## 13.2 Cenários

### Otimista

### Realista

### Restritivo

---

## 13.3 Simulações

* Inclusão de auditorias
* Remoção de auditorias
* Alteração de recursos
* Alteração de prazos

---

# 14. ACA – AUDITORIAS COORDENADAS

## 14.1 Objetivo

Planejar participações em ACA.

---

## 14.2 Dados

| Campo             |
| ----------------- |
| Tema              |
| Órgão Coordenador |
| Prazo             |
| Horas Previstas   |

---

# 15. PAC-AUD

## 15.1 Objetivo

Planejar capacitações.

---

## 15.2 Entradas

* IA-CM
* PQAUD
* Competências
* Lacunas identificadas

---

## 15.3 Indicadores

* Horas planejadas
* Horas realizadas
* Cobertura por auditor

---

# 16. DASHBOARDS

## 16.1 Dashboard de Planejamento

Indicadores:

* Cobertura PALP
* Cobertura Universo Auditável
* Auditorias Planejadas
* Auditorias Executadas

---

## 16.2 Dashboard de Priorização

Indicadores:

* Ranking de Processos
* Ranking de Riscos
* Distribuição de Prioridades

---

## 16.3 Dashboard de Capacidade

Indicadores:

* Capacidade disponível
* Capacidade comprometida
* Capacidade restante

---

# 17. REGRAS DE NEGÓCIO

## RN-PLN-001

Toda auditoria deverá estar vinculada a um processo do universo auditável.

---

## RN-PLN-002

Toda auditoria deverá possuir risco associado.

---

## RN-PLN-003

Nenhum PAA poderá exceder a capacidade operacional disponível.

---

## RN-PLN-004

Toda alteração do PAA exigirá justificativa formal.

---

## RN-PLN-005

Toda alteração do PAA deverá manter histórico.

---

## RN-PLN-006

Toda auditoria mandatória deverá ser incluída automaticamente.

---

## RN-PLN-007

O sistema deverá recalcular automaticamente a matriz de priorização quando houver alteração nos critérios.

---

## RN-PLN-008

A cobertura do PALP deverá ser recalculada automaticamente.

---

## RN-PLN-009

Auditores impedidos não poderão ser alocados em trabalhos relacionados.

---

## RN-PLN-010

O sistema deverá manter versões históricas do PALP e do PAA.

---

# 18. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa do universo auditável.
2. Implementar a hierarquia de processos em quatro níveis.
3. Implementar QACI.
4. Implementar matriz de priorização.
5. Implementar PALP.
6. Implementar PAA.
7. Calcular capacidade operacional.
8. Simular cenários.
9. Distribuir carga automaticamente.
10. Gerar indicadores e dashboards de planejamento.
11. Manter rastreabilidade e histórico de alterações.
12. Atender integralmente à metodologia de planejamento da AUDIN.

Este volume estabelece a base metodológica para todo o ciclo de auditoria e servirá como entrada para o **Volume IV – Execução das Auditorias**, onde serão detalhados os programas de auditoria, papéis de trabalho, evidências, amostragem, supervisão técnica e gestão dos achados.
