# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME XVIII – ECOSSISTEMA INTEGRADO DE GOVERNANÇA, RISCOS, CONTROLES INTERNOS, INTEGRIDADE E COMPLIANCE (GRC)

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume estabelece os requisitos funcionais, operacionais e estratégicos para implantação de uma plataforma corporativa integrada de Governança, Gestão de Riscos, Controles Internos, Integridade, Compliance e Auditoria Interna (GRC – Governance, Risk and Compliance).

O objetivo é transformar o sistema de auditoria em uma plataforma institucional integrada capaz de conectar:

* Auditoria Interna;
* Gestão de Riscos;
* Controle Interno;
* Integridade;
* Compliance;
* Governança Corporativa;
* Gestão Estratégica;
* Gestão de Processos;
* Gestão de Controles;
* Gestão de Planos de Ação;
* Gestão de Conformidade;
* Monitoramento Institucional.

O módulo deverá permitir visão integrada da chamada **Segunda e Terceira Linhas de Defesa**, alinhada ao modelo internacional do IIA.

---

# 2. FUNDAMENTAÇÃO NORMATIVA

O módulo deverá observar:

* Resolução CNJ nº 308/2020;
* Resolução CNJ nº 309/2020;
* Resolução CNJ nº 410/2021;
* Resolução CNJ nº 347/2020;
* Lei nº 12.846/2013 (Lei Anticorrupção);
* Lei nº 13.709/2018 (LGPD);
* Decreto nº 11.529/2023 (Programa de Integridade Federal);
* COSO ERM;
* ISO 31000;
* ISO 37301 (Compliance);
* ISO 37001 (Antissuborno);
* Modelo das Três Linhas do IIA;
* Normas Globais de Auditoria Interna.

---

# 3. VISÃO FUNCIONAL

```text
Ecossistema GRC
│
├── Governança Institucional
├── Gestão de Riscos
├── Gestão de Controles
├── Compliance
├── Programa de Integridade
├── Controle Interno
├── Gestão de Processos
├── Planos de Ação
├── Auditoria Interna
├── Indicadores GRC
├── Mapa Integrado de Riscos
├── Central de Conformidade
├── Monitoramento Contínuo
└── Governança Corporativa
```

---

# 4. MODELO DAS TRÊS LINHAS

## 4.1 Primeira Linha

Gestores responsáveis pelos processos e controles.

### Responsabilidades

* execução de processos;
* execução de controles;
* tratamento de riscos;
* implementação de ações corretivas.

---

## 4.2 Segunda Linha

Funções de supervisão.

### Estruturas

* Gestão de Riscos;
* Compliance;
* Integridade;
* Controles Internos.

---

## 4.3 Terceira Linha

Auditoria Interna.

### Responsabilidades

* avaliação independente;
* consultoria;
* avaliação da governança;
* avaliação de riscos;
* avaliação dos controles.

---

# 5. GOVERNANÇA INSTITUCIONAL

## 5.1 Objetivo

Mapear e monitorar estruturas de governança.

---

## 5.2 Componentes

### Comitês

### Conselhos

### Unidades Estratégicas

### Responsáveis

### Competências

---

## 5.3 Cadastro de Estruturas

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Nome        | Texto   |
| Tipo        | Enum    |
| Responsável | Usuário |
| Finalidade  | Texto   |
| Status      | Enum    |

---

# 6. GESTÃO CORPORATIVA DE RISCOS

## 6.1 Objetivo

Centralizar a gestão de riscos institucionais.

---

## 6.2 Tipologias

### Estratégicos

### Operacionais

### Financeiros

### Tecnologia

### Segurança da Informação

### Integridade

### Continuidade

### Reputacionais

### Jurídicos

### ESG

---

## 6.3 Integração

Integração obrigatória com o Volume III – Gestão de Riscos.

---

# 7. BIBLIOTECA CORPORATIVA DE CONTROLES

## 7.1 Objetivo

Centralizar todos os controles institucionais.

---

## 7.2 Estrutura

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Nome        | Texto   |
| Processo    | UUID    |
| Objetivo    | Texto   |
| Tipo        | Enum    |
| Frequência  | Enum    |
| Responsável | Usuário |

---

## 7.3 Classificações

### Preventivo

### Detectivo

### Corretivo

### Automatizado

### Manual

### Compensatório

---

# 8. GESTÃO DE CONTROLES INTERNOS

## 8.1 Objetivo

Monitorar efetividade dos controles.

---

## 8.2 Funcionalidades

### Cadastro

### Testes

### Autoavaliação

### Avaliação Independente

### Monitoramento

---

## 8.3 Resultado

Determinação do nível de efetividade.

---

# 9. AUTOAVALIAÇÃO DE CONTROLES (CSA)

## 9.1 Objetivo

Permitir Control Self Assessment.

---

## 9.2 Funcionalidades

### Questionários

### Evidências

### Avaliação

### Planos de Ação

---

## 9.3 Escalas

### Efetivo

### Parcialmente Efetivo

### Inefetivo

---

# 10. PROGRAMA DE INTEGRIDADE

## 10.1 Objetivo

Gerenciar o Programa de Integridade do Tribunal.

---

## 10.2 Componentes

### Governança

### Gestão de Riscos de Integridade

### Capacitação

### Comunicação

### Monitoramento

### Canal de Integridade

---

# 11. GESTÃO DE RISCOS DE INTEGRIDADE

## 11.1 Objetivo

Identificar e monitorar riscos de integridade.

---

## 11.2 Categorias

### Corrupção

### Fraude

### Conflito de Interesses

### Nepotismo

### Assédio

### Violação Ética

---

# 12. COMPLIANCE CORPORATIVO

## 12.1 Objetivo

Gerenciar conformidade regulatória.

---

## 12.2 Estrutura

### Obrigações

### Normativos

### Controles

### Evidências

### Avaliações

---

# 13. CENTRAL DE OBRIGAÇÕES DE COMPLIANCE

## 13.1 Objetivo

Manter inventário regulatório.

---

## 13.2 Entidade Obrigacao

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Norma       | Texto   |
| Requisito   | Texto   |
| Responsável | Usuário |
| Criticidade | Enum    |
| Status      | Enum    |

---

# 14. GESTÃO DE PROCESSOS INSTITUCIONAIS

## 14.1 Objetivo

Relacionar processos, riscos e controles.

---

## 14.2 Componentes

### Cadeia de Valor

### Macroprocessos

### Processos

### Subprocessos

### Atividades

---

## 14.3 Integração

Obrigatória com riscos, controles e auditorias.

---

# 15. MATRIZ PROCESSO-RISCO-CONTROLE

## 15.1 Objetivo

Estabelecer rastreabilidade completa.

---

## 15.2 Relacionamentos

```text
Processo
    ↓
Risco
    ↓
Controle
    ↓
Teste
    ↓
Resultado
```

---

# 16. GESTÃO DE PLANOS DE AÇÃO CORPORATIVOS

## 16.1 Objetivo

Centralizar ações corretivas institucionais.

---

## 16.2 Origens

### Auditorias

### Compliance

### Integridade

### Gestão de Riscos

### Autoavaliações

### Inspeções

---

# 17. REPOSITÓRIO DE EVIDÊNCIAS GRC

## 17.1 Objetivo

Centralizar evidências corporativas.

---

## 17.2 Funcionalidades

### Armazenamento

### Versionamento

### Assinatura

### Cadeia de Custódia

### Auditoria

---

# 18. MAPA CORPORATIVO DE RISCOS

## 18.1 Objetivo

Consolidar riscos institucionais.

---

## 18.2 Visões

### Estratégica

### Operacional

### Unidade

### Processo

### Objetivo Estratégico

---

# 19. MONITORAMENTO CONTÍNUO

## 19.1 Objetivo

Realizar acompanhamento permanente.

---

## 19.2 Objetos Monitorados

### Riscos

### Controles

### Compliance

### Integridade

### Auditorias

### Indicadores

---

# 20. INDICADORES GRC

## 20.1 Governança

* maturidade;
* efetividade;
* participação dos comitês.

---

## 20.2 Riscos

* riscos críticos;
* cobertura;
* tratamento.

---

## 20.3 Compliance

* conformidade;
* obrigações atendidas;
* desvios.

---

## 20.4 Integridade

* riscos;
* incidentes;
* capacitações.

---

## 20.5 Controles

* efetividade;
* cobertura;
* falhas.

---

# 21. DASHBOARD EXECUTIVO GRC

## 21.1 Componentes

### Governança

### Riscos

### Compliance

### Integridade

### Auditoria

### Controles

---

## 21.2 Público

### Presidência

### Comitês

### Administração Superior

---

# 22. DASHBOARD OPERACIONAL GRC

## 22.1 Componentes

### Obrigações

### Riscos

### Controles

### Avaliações

### Pendências

---

# 23. CENTRAL DE NÃO CONFORMIDADES

## 23.1 Objetivo

Registrar desvios identificados.

---

## 23.2 Origens

### Auditorias

### Compliance

### Integridade

### Avaliações

### Fiscalizações

---

## 23.3 Classificação

### Crítica

### Alta

### Média

### Baixa

---

# 24. GESTÃO DE INCIDENTES DE INTEGRIDADE

## 24.1 Objetivo

Controlar eventos relacionados à integridade.

---

## 24.2 Tipologias

### Corrupção

### Fraude

### Assédio

### Violação Ética

### Conflito de Interesse

---

## 24.3 Fluxo

```text
Registro
   ↓
Avaliação
   ↓
Tratamento
   ↓
Monitoramento
   ↓
Encerramento
```

---

# 25. SUBMÓDULO AVANÇADO – CENTRAL GRC CORPORATIVA

## 25.1 Objetivo

Disponibilizar ambiente unificado de Governança, Riscos e Compliance.

---

## 25.2 Capacidades

### Consolidação Corporativa

### Gestão Integrada

### Monitoramento Estratégico

### Relatórios Executivos

---

# 26. SUBMÓDULO AVANÇADO – MATURIDADE GRC

## 26.1 Objetivo

Avaliar maturidade institucional.

---

## 26.2 Domínios

### Governança

### Riscos

### Compliance

### Integridade

### Controles

### Auditoria

---

## 26.3 Escala

### Inicial

### Repetível

### Definido

### Gerenciado

### Otimizado

---

# 27. SUBMÓDULO AVANÇADO – UNIVERSO DE AUDITORIA BASEADO EM RISCOS

## 27.1 Objetivo

Conectar riscos institucionais ao planejamento da auditoria.

---

## 27.2 Funcionalidades

### Priorização

### Ranking

### Cobertura

### Seleção Automática

---

## 27.3 Integração

Obrigatória com o módulo de Planejamento de Auditoria.

---

# 28. INTEGRAÇÃO COM IA E ANALYTICS

## 28.1 Objetivo

Aprimorar monitoramento e avaliação.

---

## 28.2 Funcionalidades

### Predição de Riscos

### Detecção de Padrões

### Anomalias

### Recomendações Inteligentes

### Monitoramento Automatizado

---

# 29. MATRIZ DE RELACIONAMENTOS GRC

| Objeto        | Relaciona-se Com |
| ------------- | ---------------- |
| Processo      | Risco            |
| Risco         | Controle         |
| Controle      | Teste            |
| Teste         | Resultado        |
| Resultado     | Plano de Ação    |
| Plano de Ação | Auditoria        |
| Auditoria     | Indicadores      |
| Compliance    | Obrigações       |
| Integridade   | Riscos           |

---

# 30. REGRAS DE NEGÓCIO

## RN-GRC-001

Todo risco deverá estar vinculado a processo ou objetivo institucional.

---

## RN-GRC-002

Todo controle deverá possuir responsável definido.

---

## RN-GRC-003

Toda não conformidade deverá gerar tratamento formal.

---

## RN-GRC-004

Toda obrigação regulatória deverá possuir responsável institucional.

---

## RN-GRC-005

Todo incidente de integridade deverá possuir trilha de auditoria.

---

## RN-GRC-006

A matriz Processo-Risco-Controle deverá permanecer íntegra.

---

## RN-GRC-007

Os planos de ação deverão possuir prazo e responsável.

---

## RN-GRC-008

Todo indicador deverá possuir fonte rastreável.

---

## RN-GRC-009

A avaliação de maturidade deverá preservar histórico.

---

## RN-GRC-010

Riscos críticos deverão gerar alertas automáticos.

---

## RN-GRC-011

Toda evidência utilizada em avaliações deverá permanecer acessível.

---

## RN-GRC-012

O sistema deverá permitir consolidação integrada de Governança, Riscos, Compliance e Auditoria.

---

# 31. REQUISITOS NÃO FUNCIONAIS ESPECÍFICOS

## RNF-GRC-001

Suporte a milhões de registros históricos.

---

## RNF-GRC-002

Disponibilidade mínima de 99,5%.

---

## RNF-GRC-003

Escalabilidade horizontal.

---

## RNF-GRC-004

Rastreabilidade integral dos objetos GRC.

---

## RNF-GRC-005

Compatibilidade com BI Corporativo.

---

## RNF-GRC-006

Integração com motores de IA.

---

## RNF-GRC-007

Controle granular de permissões.

---

## RNF-GRC-008

Conformidade com LGPD.

---

# 32. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Implementar plataforma corporativa GRC integrada.
2. Disponibilizar gestão de Governança, Riscos, Controles, Integridade e Compliance.
3. Implementar biblioteca corporativa de controles.
4. Disponibilizar matriz Processo-Risco-Controle.
5. Permitir autoavaliação de controles (CSA).
6. Implementar Programa de Integridade.
7. Disponibilizar central de obrigações regulatórias.
8. Implementar gestão de não conformidades.
9. Disponibilizar monitoramento contínuo institucional.
10. Integrar-se aos módulos de Auditoria Interna, Riscos, BI e IA.
11. Disponibilizar dashboards executivos e operacionais.
12. Constituir a plataforma oficial de Governança, Riscos e Compliance do Tribunal.

---

## Dependências para os Próximos Volumes

Os recursos deste volume servirão como base para:

* **Volume XIX – Auditoria Contínua e Monitoramento Inteligente**
* **Volume XX – Plataforma Corporativa de Conhecimento e Inteligência Institucional**
* **Volume XXI – Centro Integrado de Governança e Controle (CIGC)**
* **Volume XXII – Ecossistema Digital de Governança do Poder Judiciário**

Este volume representa a convergência entre Auditoria Interna, Gestão de Riscos, Integridade, Compliance, Governança e Controles Internos, transformando o sistema em uma plataforma corporativa de GRC alinhada às melhores práticas internacionais e às diretrizes do CNJ para fortalecimento da governança pública.
