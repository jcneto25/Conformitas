# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME VI – RELATÓRIOS, COMUNICAÇÃO DOS RESULTADOS E MONITORAMENTO

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume define os requisitos funcionais, regras de negócio, fluxos operacionais e estruturas de dados relacionados à:

* Comunicação dos resultados da auditoria;
* Emissão de relatórios;
* Emissão de pareceres;
* Emissão de notas técnicas;
* Emissão de comunicações preliminares;
* Gestão de recomendações;
* Gestão de determinações;
* Gestão de planos de ação;
* Monitoramento contínuo;
* Relatórios de Monitoramento de Auditoria (RMA);
* Avaliação de implementação;
* Avaliação de efetividade;
* Encerramento das recomendações;
* Reabertura de recomendações;
* Consolidação institucional dos resultados.

Este módulo materializa a transição entre a fase de auditoria e a fase de geração de valor institucional.

---

# 2. ARQUITETURA FUNCIONAL

```text
Relatórios e Monitoramento
│
├── Comunicação Preliminar
├── Relatório Preliminar
├── Manifestações
├── Relatório Final
├── Publicação
├── Recomendações
├── Determinações
├── Planos de Ação
├── Monitoramento
├── Avaliação de Implementação
├── Avaliação de Efetividade
├── RMA
├── Encerramento
└── Reabertura
```

---

# 3. COMUNICAÇÃO DOS RESULTADOS

## 3.1 Objetivo

Formalizar a comunicação dos resultados da auditoria às partes interessadas.

---

## 3.2 Tipos de Comunicação

### Comunicação Preliminar de Achados

Instrumento utilizado antes da emissão do relatório.

---

### Relatório de Auditoria

Documento principal de comunicação dos resultados.

---

### Relatório Executivo

Versão resumida destinada à alta administração.

---

### Nota Técnica

Manifestação técnica específica.

---

### Parecer

Manifestação formal sobre tema específico.

---

### Memorando

Comunicação administrativa interna.

---

# 4. RELATÓRIO DE AUDITORIA

## 4.1 Objetivo

Consolidar formalmente os resultados da auditoria.

---

## 4.2 Estrutura Obrigatória

### Capa

### Identificação do Trabalho

### Sumário Executivo

### Introdução

### Objetivos

### Escopo

### Metodologia

### Limitações

### Achados

### Recomendações

### Benefícios Esperados

### Conclusão

### Anexos

---

## 4.3 Geração Automática

O sistema deverá montar automaticamente:

* capa;
* sumário;
* quadro de resultados;
* lista de recomendações;
* lista de determinações;
* anexos referenciados.

---

# 5. MODELOS DE RELATÓRIO

## 5.1 Templates Parametrizáveis

O sistema deverá permitir múltiplos modelos.

---

## 5.2 Exemplos

### Auditoria Operacional

### Auditoria Financeira

### Auditoria de TI

### Auditoria de Conformidade

### Auditoria Coordenada

### Consultoria

---

# 6. WORKFLOW DO RELATÓRIO

## 6.1 Fluxo

```text
Rascunho
 ↓
Revisão Técnica
 ↓
Supervisão
 ↓
Aprovação AUDIN
 ↓
Ciência da Unidade
 ↓
Publicação
```

---

## 6.2 Controle de Versões

Cada alteração deverá gerar nova versão.

---

## 6.3 Histórico

Não será permitida exclusão de versões.

---

# 7. ASSINATURA ELETRÔNICA

## 7.1 Objetivo

Garantir autenticidade e integridade.

---

## 7.2 Signatários

### Auditor Líder

### Supervisor

### Coordenador

### Secretário de Auditoria

---

## 7.3 Tipos

### Assinatura Institucional

### ICP-Brasil

### Integração com Assinador Corporativo

---

# 8. PUBLICAÇÃO DOS RELATÓRIOS

## 8.1 Objetivo

Controlar divulgação institucional.

---

## 8.2 Modalidades

### Interna

### Restrita

### Pública

### Sigilosa

---

## 8.3 Controle de Acesso

Baseado em:

* perfil;
* classificação da informação;
* unidade;
* papel na auditoria.

---

# 9. GESTÃO DE RECOMENDAÇÕES

## 9.1 Objetivo

Gerenciar ações corretivas decorrentes dos achados.

---

## 9.2 Estrutura

```text
Achado
 ↓
Recomendação
 ↓
Plano de Ação
 ↓
Implementação
 ↓
Validação
 ↓
Encerramento
```

---

## 9.3 Entidade: RecomendaçãoMonitoramento

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Código      | Texto   |
| AchadoId    | UUID    |
| Descrição   | Texto   |
| Prioridade  | Enum    |
| Responsável | Usuário |
| Unidade     | Unidade |
| Prazo       | Data    |
| Status      | Enum    |

---

# 10. DETERMINAÇÕES

## 10.1 Objetivo

Controlar decisões obrigatórias.

---

## 10.2 Características

* vinculantes;
* monitoráveis;
* rastreáveis.

---

## 10.3 Regras

### RN-MON-001

Determinações sempre possuirão monitoramento obrigatório.

---

# 11. PLANO DE AÇÃO

## 11.1 Objetivo

Permitir que a unidade auditada informe as medidas adotadas.

---

## 11.2 Estrutura

| Campo                |
| -------------------- |
| Ação                 |
| Responsável          |
| Prazo                |
| Recursos Necessários |
| Indicador            |
| Evidência Prevista   |

---

## 11.3 Workflow

```text
Elaboração
 ↓
Análise AUDIN
 ↓
Aprovação
 ↓
Execução
 ↓
Validação
```

---

# 12. MONITORAMENTO

## 12.1 Objetivo

Acompanhar implementação das recomendações.

---

## 12.2 Modalidades

### Monitoramento Periódico

### Monitoramento Contínuo

### Monitoramento Extraordinário

---

## 12.3 Ciclos

* Mensal
* Trimestral
* Semestral
* Anual

---

# 13. STATUS DE IMPLEMENTAÇÃO

## 13.1 Classificações

### Não Iniciada

### Em Planejamento

### Em Implementação

### Implementada

### Parcialmente Implementada

### Não Implementada

### Cancelada

---

# 14. AVALIAÇÃO DE IMPLEMENTAÇÃO

## 14.1 Objetivo

Verificar se a ação foi executada.

---

## 14.2 Critérios

### Evidência Apresentada

### Validação Técnica

### Consistência

### Abrangência

---

## 14.3 Resultado

| Situação                  |
| ------------------------- |
| Implementada              |
| Parcialmente Implementada |
| Não Implementada          |

---

# 15. AVALIAÇÃO DE EFETIVIDADE

## 15.1 Objetivo

Verificar se o problema foi efetivamente resolvido.

---

## 15.2 Critérios

### Risco Mitigado

### Controle Implantado

### Processo Melhorado

### Benefício Obtido

---

## 15.3 Resultado

| Situação             |
| -------------------- |
| Efetiva              |
| Parcialmente Efetiva |
| Inefetiva            |

---

# 16. RELATÓRIO DE MONITORAMENTO DE AUDITORIA (RMA)

## 16.1 Objetivo

Consolidar o resultado dos monitoramentos.

---

## 16.2 Estrutura

### Introdução

### Escopo

### Recomendações Monitoradas

### Situação Atual

### Determinações

### Avaliação de Efetividade

### Conclusão

---

## 16.3 Geração Automática

O sistema deverá gerar automaticamente:

* quadros de acompanhamento;
* estatísticas;
* gráficos;
* indicadores.

---

# 17. ENCERRAMENTO DE RECOMENDAÇÕES

## 17.1 Critérios

Uma recomendação somente poderá ser encerrada quando:

* implementação validada;
* efetividade avaliada;
* aprovação registrada.

---

## 17.2 Fluxo

```text
Implementação
 ↓
Validação
 ↓
Efetividade
 ↓
Encerramento
```

---

# 18. REABERTURA DE RECOMENDAÇÕES

## 18.1 Objetivo

Permitir retomada do monitoramento.

---

## 18.2 Motivos

### Evidência insuficiente

### Falha identificada posteriormente

### Reincidência

### Novo risco

---

## 18.3 Regras

### RN-MON-002

Toda reabertura deverá possuir justificativa.

---

# 19. BENEFÍCIOS IMPLEMENTADOS

## 19.1 Objetivo

Mensurar valor gerado pela auditoria.

---

## 19.2 Tipos

### Financeiros

* economia;
* recuperação de recursos;
* redução de gastos.

### Não Financeiros

* governança;
* transparência;
* conformidade;
* controles internos.

---

## 19.3 Consolidação

O sistema deverá manter histórico anual dos benefícios.

---

# 20. ALERTAS E NOTIFICAÇÕES

## 20.1 Eventos

### Prazo próximo do vencimento

### Prazo vencido

### Manifestação pendente

### Plano de ação pendente

### Validação pendente

### Encerramento pendente

---

## 20.2 Canais

* Sistema;
* E-mail;
* Integrações futuras.

---

# 21. DASHBOARDS DE MONITORAMENTO

## 21.1 Dashboard Operacional

Indicadores:

* recomendações abertas;
* recomendações encerradas;
* monitoramentos pendentes;
* validações pendentes.

---

## 21.2 Dashboard Executivo

Indicadores:

* taxa de implementação;
* taxa de implementação tempestiva;
* taxa de efetividade;
* recomendações críticas.

---

## 21.3 Dashboard Estratégico

Indicadores:

* benefícios gerados;
* riscos mitigados;
* reincidências;
* evolução anual.

---

# 22. INDICADORES INSTITUCIONAIS

## 22.1 Indicadores Obrigatórios

### Taxa de Implementação

---

### Taxa de Implementação Tempestiva

---

### Taxa de Efetividade

---

# 23. INTEGRAÇÃO COM OUTROS MÓDULOS

## 23.1 Entradas

Recebe dados de:

* Volume IV – Execução das Auditorias;
* Volume V – Achados e Resultados.

---

## 23.2 Saídas

Fornece dados para:

* Volume VIII – PQAUD;
* Volume IX – Gestão de Riscos da AUDIN;
* Volume XV – BI e Analytics;
* Relatório Anual de Atividades (RAA).

---

# 24. REGRAS DE NEGÓCIO

## RN-MON-003

Toda recomendação deverá possuir responsável definido.

---

## RN-MON-004

Toda recomendação deverá possuir prazo.

---

## RN-MON-005

Toda alteração de status deverá gerar histórico.

---

## RN-MON-006

Toda implementação deverá possuir evidência.

---

## RN-MON-007

Toda avaliação deverá ser registrada eletronicamente.

---

## RN-MON-008

Não será permitido encerrar recomendação sem validação.

---

## RN-MON-009

Não será permitido encerrar recomendação sem avaliação de efetividade quando esta for exigida pela metodologia institucional.

---

## RN-MON-010

Toda recomendação crítica vencida deverá gerar alerta automático à chefia da AUDIN.

---

## RN-MON-011

Toda determinação vencida deverá ser destacada nos dashboards executivos.

---

## RN-MON-012

O histórico de monitoramento deverá ser permanente e imutável.

---

# 25. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir emissão de relatórios de auditoria parametrizáveis.
2. Implementar fluxo completo de aprovação e publicação.
3. Controlar recomendações e determinações.
4. Permitir cadastro e aprovação de planos de ação.
5. Implementar monitoramento contínuo e periódico.
6. Implementar validação de implementação.
7. Implementar avaliação de efetividade.
8. Gerar automaticamente RMA.
9. Calcular indicadores institucionais.
10. Permitir encerramento e reabertura de recomendações.
11. Mensurar benefícios financeiros e não financeiros.
12. Garantir rastreabilidade integral entre auditoria, achados, recomendações e monitoramento.
13. Atender aos requisitos metodológicos previstos pelo Manual de Auditoria do Poder Judiciário, Resolução CNJ nº 309/2020 e Programa de Qualidade da Auditoria Interna (PQAUD).

---

### Dependências para os próximos volumes

As informações produzidas neste módulo serão utilizadas diretamente por:

* **Volume VII – Consultorias e Serviços de Avaliação**
* **Volume VIII – PQAUD**
* **Volume IX – Gestão de Riscos da AUDIN**
* **Volume XIV – Relatório Anual de Atividades (RAA)**
* **Volume XV – Business Intelligence e Analytics**

constituindo o principal mecanismo de comprovação da efetividade da atividade de Auditoria Interna.
