# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME I – VISÃO ESTRATÉGICA E NEGÓCIO

### Versão 3.0

---

# 1. INTRODUÇÃO

## 1.1 Objetivo do Documento

Este documento estabelece a visão estratégica, o escopo funcional, os objetivos institucionais, os princípios de negócio e a arquitetura conceitual do Sistema Automatizado de Gestão de Auditorias Internas e Controle Interno, destinado à Secretaria de Auditoria Interna (AUDIN) do Tribunal de Justiça.

O documento servirá como referência para:

* Product Requirements Document (PRD);
* Modelagem de processos;
* Modelagem de dados;
* Arquitetura de software;
* Desenvolvimento da solução;
* Contratação de fornecedores;
* Governança do produto.

---

## 1.2 Objetivo do Sistema

Disponibilizar uma plataforma corporativa integrada para gestão do ciclo completo de auditorias internas, consultorias, monitoramento de recomendações, gestão da qualidade, gestão de riscos da AUDIN, planejamento estratégico e operacional, capacitação, governança e conformidade institucional.

O sistema deverá apoiar a atuação da Auditoria Interna como atividade independente e objetiva de avaliação e consultoria destinada a agregar valor e melhorar as operações institucionais.

---

## 1.3 Escopo

O sistema abrangerá integralmente:

### Planejamento

* Universo auditável
* PALP
* PAA
* QACI
* Priorização
* Gestão da capacidade operacional

### Execução

* Auditorias
* Consultorias
* ACA
* Papéis de trabalho
* Evidências
* Supervisão

### Resultados

* Achados
* Quadro de Resultados
* Relatórios
* Recomendações
* Determinações

### Monitoramento

* RMA
* Acompanhamento
* Validação de implementação
* Reabertura

### Qualidade

* PQAUD
* Avaliações contínuas
* Avaliações periódicas
* Avaliações externas
* IA-CM

### Governança

* Gestão de riscos da AUDIN
* Ética
* Independência
* Transparência
* Comunicação de fraudes

---

## 1.4 Público-Alvo

O sistema será utilizado por:

### Internamente

* Auditores
* Supervisores
* Coordenadores
* Secretário de Auditoria
* Equipe Administrativa da AUDIN

### Externamente

* Presidência
* Órgão Especial
* Comitês
* Unidades Auditadas
* Gestores
* Avaliadores Externos

---

## 1.5 Benefícios Esperados

### Institucionais

* Maior efetividade da auditoria interna;
* Aumento da maturidade institucional;
* Melhoria da governança;
* Aprimoramento do controle interno;
* Redução de riscos.

### Operacionais

* Eliminação de controles paralelos;
* Automação de fluxos;
* Padronização metodológica;
* Rastreabilidade integral.

### Estratégicos

* Planejamento baseado em riscos;
* Priorização objetiva;
* Transparência institucional;
* Tomada de decisão baseada em dados.

---

## 1.6 Premissas

* Existência de estrutura formal de Auditoria Interna.
* Existência de planejamento estratégico institucional.
* Existência de normativos internos vigentes.
* Disponibilidade de infraestrutura tecnológica corporativa.
* Integração com sistemas corporativos do Tribunal.

---

## 1.7 Restrições

* Observância obrigatória da LGPD.
* Observância das políticas de segurança da informação.
* Observância das normas do CNJ.
* Observância das resoluções do TJ.
* Respeito aos níveis de sigilo das informações.

---

## 1.8 Glossário

### Auditoria

Atividade independente e objetiva de avaliação e consultoria.

### Achado

Resultado identificado durante os trabalhos de auditoria.

### Evidência

Informação utilizada para sustentar conclusões de auditoria.

### Risco

Possibilidade de ocorrência de evento que afete objetivos institucionais.

### Controle

Medida destinada a reduzir riscos.

### Recomendação

Ação proposta para tratamento de achados.

### Determinação

Providência obrigatória decorrente de decisão administrativa.

---

## 1.9 Acrônimos

| Sigla | Descrição                                      |
| ----- | ---------------------------------------------- |
| AUDIN | Auditoria Interna                              |
| PALP  | Plano de Auditoria de Longo Prazo              |
| PAA   | Plano Anual de Auditoria                       |
| ACA   | Auditoria Coordenada                           |
| QACI  | Questionário de Avaliação de Controle Interno  |
| RMA   | Relatório de Monitoramento de Auditoria        |
| RAA   | Relatório Anual de Atividades                  |
| PQAUD | Programa de Qualidade da Auditoria             |
| IA-CM | Internal Audit Capability Model                |
| IPPF  | International Professional Practices Framework |

---

# 2. REFERENCIAL NORMATIVO

## 2.1 Constituição Federal

Base jurídica para os mecanismos de controle interno, auditoria e governança.

---

## 2.2 Resolução CNJ nº 309/2020

Norma estruturante da atividade de Auditoria Interna do Poder Judiciário.

---

## 2.3 Resolução TJCE nº 23/2023

Normativo institucional da Auditoria Interna.

---

## 2.4 Manual de Auditoria do Poder Judiciário

Referência metodológica principal para execução dos trabalhos.

---

## 2.5 Programa de Qualidade de Auditoria (PQAUD)

Referência para avaliação contínua da qualidade.

---

## 2.6 Manual de Gestão de Riscos da AUDIN

Referência para gestão dos riscos internos da atividade de auditoria.

---

## 2.7 Normas do IIA

Referencial internacional de auditoria interna.

---

## 2.8 IPPF

Estrutura internacional de práticas profissionais.

---

## 2.9 IA-CM

Modelo de avaliação da capacidade institucional da auditoria.

---

## 2.10 ISO 31000

Referencial para gestão de riscos.

---

## 2.11 LGPD

Lei Geral de Proteção de Dados Pessoais.

---

# 3. ARQUITETURA DE NEGÓCIO

## 3.1 Visão Geral

O sistema deverá suportar o ciclo completo da atividade de auditoria interna, desde o planejamento estratégico até a avaliação da efetividade das recomendações implementadas.

---

## 3.2 Modelo das Três Linhas

### Primeira Linha

Gestores responsáveis pela execução dos processos.

### Segunda Linha

Unidades responsáveis pela supervisão e conformidade.

### Terceira Linha

Auditoria Interna.

O sistema deverá permitir o registro e a rastreabilidade das interações entre as três linhas.

---

## 3.3 Cadeia de Valor da Auditoria

Planejamento
↓
Priorização
↓
Auditoria
↓
Achados
↓
Relatório
↓
Monitoramento
↓
Avaliação da Efetividade
↓
Melhoria Contínua

---

## 3.4 Macroprocessos da AUDIN

### Planejamento

Elaboração do PALP e PAA.

### Execução

Realização de auditorias e consultorias.

### Monitoramento

Acompanhamento de recomendações.

### Qualidade

Avaliação da conformidade metodológica.

### Gestão de Riscos

Gerenciamento dos riscos da própria AUDIN.

### Desenvolvimento Institucional

PAC-Aud e capacitação.

---

## 3.5 Capacidades de Negócio

### Planejamento Baseado em Riscos

Capacidade de selecionar trabalhos utilizando critérios objetivos.

### Execução Metodológica

Capacidade de conduzir auditorias conforme metodologia institucional.

### Gestão do Conhecimento

Capacidade de armazenar e reutilizar conhecimento organizacional.

### Gestão da Qualidade

Capacidade de avaliar continuamente a atividade de auditoria.

### Gestão de Riscos

Capacidade de identificar, analisar e tratar riscos da AUDIN.

### Transparência

Capacidade de disponibilizar informações institucionais de forma controlada.

---

## 3.6 Princípios Norteadores

### Independência

A atividade de auditoria deverá manter independência funcional.

### Objetividade

As avaliações deverão ser imparciais.

### Transparência

As informações deverão ser acessíveis conforme nível de sigilo.

### Rastreabilidade

Toda ação relevante deverá possuir trilha de auditoria.

### Integridade

Os registros deverão possuir garantia de autenticidade.

### Eficiência

Os processos deverão ser executados com o menor esforço operacional possível.

### Melhoria Contínua

A solução deverá apoiar a evolução contínua da atividade de auditoria.

---

## 3.7 Objetivos Estratégicos do Sistema

### OE-01

Fortalecer a governança institucional.

### OE-02

Aprimorar a gestão de riscos.

### OE-03

Aumentar a efetividade das auditorias.

### OE-04

Padronizar processos metodológicos.

### OE-05

Aprimorar a qualidade da atividade de auditoria.

### OE-06

Ampliar a transparência institucional.

### OE-07

Fortalecer a cultura de controle interno.

### OE-08

Apoiar decisões estratégicas baseadas em evidências.

---

## 3.8 Indicadores Estratégicos

### Planejamento

* Cobertura do PALP
* Cobertura do universo auditável

### Execução

* Auditorias concluídas
* Auditorias em atraso

### Qualidade

* Índice PQAUD
* Nível IA-CM

### Monitoramento

* Taxa de implementação
* Taxa de implementação tempestiva

### Governança

* Quantidade de riscos críticos
* Cobertura dos controles

### Transparência

* Relatórios publicados
* Demandas atendidas

---

# 4. VISÃO MACRO DA SOLUÇÃO

## 4.1 Domínios Funcionais

### Planejamento Estratégico e Operacional

### Execução de Auditorias

### Consultorias

### Monitoramento

### Gestão da Qualidade

### Gestão de Riscos da AUDIN

### Gestão de Competências

### Ética e Independência

### Governança e Transparência

### Comunicação de Fraudes

### Biblioteca Metodológica

### Administração e Segurança

---

## 4.2 Fluxo Corporativo Principal

PALP
↓
PAA
↓
Priorização
↓
Auditoria
↓
Achados
↓
Relatório
↓
Monitoramento
↓
PQAUD
↓
RAA
↓
Melhoria Contínua

---

# 5. DIRETRIZES PARA OS VOLUMES SUBSEQUENTES

Os volumes subsequentes da especificação deverão detalhar:

* Requisitos funcionais;
* Casos de uso;
* Regras de negócio;
* Perfis e permissões;
* Modelo conceitual de dados;
* APIs;
* BPMN;
* Dashboards;
* Integrações;
* Requisitos não funcionais;
* Critérios de aceitação.
