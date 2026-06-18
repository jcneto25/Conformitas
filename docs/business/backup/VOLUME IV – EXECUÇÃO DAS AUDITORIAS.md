# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME IV – EXECUÇÃO DAS AUDITORIAS

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume define os requisitos funcionais, regras de negócio, fluxos operacionais, entidades de dados e mecanismos de controle relacionados à execução dos trabalhos de auditoria interna.

O módulo deverá suportar integralmente:

* Auditorias de Avaliação;
* Auditorias de Conformidade;
* Auditorias Operacionais;
* Auditorias Financeiras;
* Auditorias de TI;
* Auditorias Coordenadas (ACA);
* Consultorias com metodologia de auditoria;
* Planejamento Específico dos Trabalhos;
* Programas de Auditoria;
* Papéis de Trabalho;
* Evidências;
* Técnicas de Auditoria;
* Amostragem;
* Supervisão Técnica;
* Controle de Qualidade da Execução;
* Gestão do Ciclo de Vida dos Trabalhos.

---

# 2. ARQUITETURA FUNCIONAL

```text
Execução de Auditorias
│
├── Cadastro da Auditoria
├── Designação da Equipe
├── Planejamento Específico
├── Programa de Auditoria
├── Matriz de Planejamento
├── Solicitações de Informação
├── Papéis de Trabalho
├── Evidências
├── Entrevistas
├── Testes
├── Amostragem
├── Achados
├── Supervisão
├── Controle de Qualidade
└── Encerramento da Execução
```

---

# 3. CADASTRO DA AUDITORIA

## 3.1 Objetivo

Formalizar a abertura de um trabalho de auditoria previsto no PAA ou autorizado extraordinariamente.

---

## 3.2 Tipos de Auditoria

### Auditoria de Conformidade

Avaliação da aderência a normas e regulamentos.

### Auditoria Operacional

Avaliação de eficiência, eficácia e efetividade.

### Auditoria Financeira

Avaliação de informações financeiras.

### Auditoria de Tecnologia da Informação

Avaliação de governança, segurança e controles de TI.

### Auditoria Integrada

Combinação de múltiplas abordagens.

### Auditoria Coordenada (ACA)

Auditoria conduzida em conjunto com outros órgãos.

### Auditoria Extraordinária

Trabalho não previsto originalmente no PAA.

---

## 3.3 Entidade: Auditoria

| Campo              | Tipo    |
| ------------------ | ------- |
| Id                 | UUID    |
| Código             | Texto   |
| Exercício          | Inteiro |
| Tipo               | Enum    |
| Objeto             | Texto   |
| Processo Auditável | FK      |
| Objetivo           | Texto   |
| Escopo             | Texto   |
| Justificativa      | Texto   |
| Origem             | Enum    |
| Prioridade         | Enum    |
| Status             | Enum    |

---

## 3.4 Estados da Auditoria

```text
Planejada
 ↓
Iniciada
 ↓
Planejamento
 ↓
Execução
 ↓
Supervisão
 ↓
Relatório
 ↓
Monitoramento
 ↓
Encerrada
```

---

# 4. DESIGNAÇÃO DA EQUIPE

## 4.1 Objetivo

Formalizar a composição da equipe responsável.

---

## 4.2 Papéis

### Auditor Líder

Responsável técnico pelo trabalho.

### Auditor

Executa procedimentos.

### Especialista

Apoio técnico especializado.

### Supervisor

Responsável pela revisão técnica.

### Revisor de Qualidade

Responsável pelo controle metodológico.

---

## 4.3 Regras

### RN-EXE-001

Todo trabalho deverá possuir Auditor Líder.

### RN-EXE-002

Todo trabalho deverá possuir Supervisor designado.

### RN-EXE-003

O sistema deverá validar conflitos de interesse antes da designação.

---

# 5. DECLARAÇÃO DE INDEPENDÊNCIA

## 5.1 Objetivo

Garantir conformidade com os princípios de independência e objetividade.

---

## 5.2 Questionário Obrigatório

O sistema deverá exigir declaração eletrônica contendo:

* vínculo com a unidade auditada;
* participação prévia no processo;
* interesse pessoal;
* impedimento funcional;
* conflito de interesse.

---

## 5.3 Resultado

| Situação            | Ação     |
| ------------------- | -------- |
| Sem conflito        | Liberar  |
| Conflito potencial  | Análise  |
| Conflito confirmado | Bloquear |

---

# 6. PLANEJAMENTO ESPECÍFICO DA AUDITORIA

## 6.1 Objetivo

Detalhar a estratégia de execução do trabalho.

---

## 6.2 Elementos Obrigatórios

### Objeto

### Objetivos

### Escopo

### Critérios

### Questões de Auditoria

### Riscos

### Metodologia

### Cronograma

### Equipe

---

## 6.3 Matriz de Planejamento

Estrutura:

| Questão | Critério | Procedimento | Evidência Esperada |
| ------- | -------- | ------------ | ------------------ |

---

# 7. PROGRAMA DE AUDITORIA

## 7.1 Objetivo

Definir os procedimentos que serão executados.

---

## 7.2 Estrutura

```text
Programa
 ↓
Objetivos
 ↓
Procedimentos
 ↓
Testes
 ↓
Evidências
```

---

## 7.3 Entidade: ProgramaAuditoria

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| AuditoriaId | UUID    |
| Versão      | Inteiro |
| DataCriação | Data    |
| Status      | Enum    |

---

## 7.4 Procedimentos

Cada procedimento deverá possuir:

| Campo       |
| ----------- |
| Código      |
| Descrição   |
| Objetivo    |
| Critério    |
| Responsável |
| Prazo       |

---

# 8. SOLICITAÇÕES DE INFORMAÇÃO

## 8.1 Objetivo

Gerenciar solicitações enviadas às unidades auditadas.

---

## 8.2 Funcionalidades

* emissão;
* acompanhamento;
* resposta;
* controle de prazo;
* anexação documental.

---

## 8.3 Status

```text
Aberta
 ↓
Respondida
 ↓
Validada
```

---

# 9. GESTÃO DE EVIDÊNCIAS

## 9.1 Objetivo

Controlar todas as evidências obtidas.

---

## 9.2 Tipos

### Documental

### Física

### Eletrônica

### Analítica

### Testemunhal

### Fotográfica

### Audiovisual

---

## 9.3 Entidade: Evidencia

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Código      | Texto   |
| Tipo        | Enum    |
| Descrição   | Texto   |
| Origem      | Texto   |
| Responsável | Usuário |
| DataColeta  | Data    |

---

## 9.4 Regras

### RN-EXE-004

Toda conclusão deverá estar vinculada a evidências.

### RN-EXE-005

Nenhuma evidência poderá ser removida após aprovação.

---

# 10. PAPÉIS DE TRABALHO

## 10.1 Objetivo

Documentar os procedimentos realizados.

---

## 10.2 Estrutura

```text
Papel de Trabalho
 ↓
Procedimento
 ↓
Evidências
 ↓
Conclusão
 ↓
Revisão
```

---

## 10.3 Entidade: PapelTrabalho

| Campo          | Tipo    |
| -------------- | ------- |
| Id             | UUID    |
| Código         | Texto   |
| AuditoriaId    | UUID    |
| ProcedimentoId | UUID    |
| Responsável    | Usuário |
| Objetivo       | Texto   |
| Conclusão      | Texto   |

---

## 10.4 Status

* Em elaboração
* Em revisão
* Aprovado
* Rejeitado
* Arquivado

---

# 11. ENTREVISTAS E REUNIÕES

## 11.1 Objetivo

Registrar evidências testemunhais.

---

## 11.2 Dados

| Campo         |
| ------------- |
| Participantes |
| Unidade       |
| Data          |
| Local         |
| Assunto       |
| Ata           |

---

## 11.3 Funcionalidades

* registro de ata;
* assinatura eletrônica;
* anexação de gravações.

---

# 12. AMOSTRAGEM

## 12.1 Objetivo

Documentar metodologia amostral.

---

## 12.2 Métodos

### Aleatória Simples

### Estratificada

### Sistemática

### Julgamental

### Por Materialidade

### Por Risco

---

## 12.3 Entidade: PlanoAmostral

| Campo         |
| ------------- |
| Universo      |
| Método        |
| Critério      |
| Quantidade    |
| Justificativa |

---

## 12.4 Regras

### RN-EXE-006

Toda amostragem deverá possuir justificativa técnica.

---

# 13. TESTES DE AUDITORIA

## 13.1 Objetivo

Executar procedimentos de validação.

---

## 13.2 Tipos

### Teste de Observância

Avalia controles.

### Teste Substantivo

Avalia transações e resultados.

### Teste Analítico

Avalia tendências.

### Teste de Conformidade

Avalia aderência normativa.

---

# 14. TÉCNICAS DE AUDITORIA

## 14.1 Catálogo

### Inspeção

### Observação

### Confirmação

### Reexecução

### Recálculo

### Entrevista

### Análise Documental

### Mineração de Dados

### Analytics

### Cruzamento de Bases

---

# 15. SUPERVISÃO TÉCNICA

## 15.1 Objetivo

Garantir qualidade metodológica.

---

## 15.2 Atividades

### Revisão do Planejamento

### Revisão dos Papéis

### Revisão das Evidências

### Revisão das Conclusões

### Revisão dos Achados

---

## 15.3 Checklist Obrigatório

O supervisor deverá validar:

* suficiência;
* relevância;
* confiabilidade;
* consistência;
* rastreabilidade.

---

# 16. CONTROLE DE QUALIDADE DA EXECUÇÃO

## 16.1 Objetivo

Avaliar aderência metodológica.

---

## 16.2 Critérios

### Planejamento Adequado

### Evidências Suficientes

### Papéis Completos

### Supervisão Realizada

### Conclusões Fundamentadas

---

## 16.3 Integração

Todos os registros deverão alimentar automaticamente o módulo PQAUD.

---

# 17. GESTÃO DE PRAZOS

## 17.1 Objetivo

Controlar cronogramas.

---

## 17.2 Eventos Controlados

* início;
* solicitações;
* entrevistas;
* testes;
* supervisão;
* relatório.

---

## 17.3 Alertas

### 30 dias

### 15 dias

### 7 dias

### Prazo vencido

---

# 18. ENCERRAMENTO DA EXECUÇÃO

## 18.1 Critérios

O trabalho somente poderá ser encerrado quando:

* todos os procedimentos estiverem concluídos;
* todos os papéis aprovados;
* todas as evidências vinculadas;
* supervisão concluída.

---

## 18.2 Checklist de Encerramento

### Planejamento aprovado

### Procedimentos executados

### Evidências registradas

### Revisões concluídas

### Achados formalizados

---

# 19. DASHBOARDS

## 19.1 Dashboard Operacional

Indicadores:

* Auditorias em andamento;
* Auditorias atrasadas;
* Procedimentos pendentes;
* Evidências pendentes.

---

## 19.2 Dashboard de Supervisão

Indicadores:

* Papéis revisados;
* Papéis pendentes;
* Não conformidades.

---

## 19.3 Dashboard Executivo

Indicadores:

* Auditorias concluídas;
* Horas executadas;
* Produtividade;
* Tempo médio de execução.

---

# 20. REGRAS DE NEGÓCIO

## RN-EXE-007

Toda auditoria deverá possuir planejamento específico aprovado.

---

## RN-EXE-008

Todo procedimento deverá estar vinculado a um objetivo de auditoria.

---

## RN-EXE-009

Toda conclusão deverá possuir evidência associada.

---

## RN-EXE-010

Nenhum papel de trabalho poderá ser aprovado pelo próprio autor.

---

## RN-EXE-011

Toda auditoria deverá possuir supervisão registrada.

---

## RN-EXE-012

Toda entrevista deverá possuir registro formal.

---

## RN-EXE-013

Toda alteração em papel de trabalho deverá gerar nova versão.

---

## RN-EXE-014

Nenhum trabalho poderá ser encerrado sem checklist de encerramento completo.

---

## RN-EXE-015

Registros aprovados deverão permanecer imutáveis, preservando histórico e versionamento.

---

# 21. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa do ciclo de execução.
2. Implementar programas de auditoria.
3. Implementar papéis de trabalho eletrônicos.
4. Implementar gestão de evidências.
5. Implementar entrevistas e reuniões.
6. Implementar amostragem documentada.
7. Implementar supervisão técnica.
8. Implementar controle de qualidade da execução.
9. Garantir rastreabilidade integral.
10. Alimentar automaticamente os módulos de Achados, Relatórios, Monitoramento e PQAUD.

---

## Entregas para os próximos volumes

O Volume IV produz informações que serão consumidas por:

* **Volume V – Achados e Resultados**
* **Volume VI – Relatórios e Monitoramento**
* **Volume VIII – PQAUD**
* **Volume IX – Gestão de Riscos da AUDIN**
* **Volume XV – Dashboards e Business Intelligence**

e constitui o núcleo operacional da solução de Auditoria Interna.
