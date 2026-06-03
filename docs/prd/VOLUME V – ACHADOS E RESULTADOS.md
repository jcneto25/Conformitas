# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME V – ACHADOS E RESULTADOS

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume especifica os requisitos funcionais, entidades de negócio, fluxos operacionais, regras de negócio e mecanismos de controle relacionados à gestão dos resultados dos trabalhos de auditoria.

O módulo deverá permitir o gerenciamento completo de:

* Achados de Auditoria;
* Constatações;
* Não Conformidades;
* Oportunidades de Melhoria;
* Boas Práticas Identificadas;
* Recomendações;
* Determinações;
* Benefícios Esperados;
* Benefícios Efetivos;
* Quadro de Resultados;
* Manifestações da Unidade Auditada;
* Contraditório e Ampla Defesa;
* Consolidação dos Resultados da Auditoria.

O módulo representa o elo entre a fase de execução e a fase de monitoramento.

---

# 2. ARQUITETURA FUNCIONAL

```text
Resultados da Auditoria
│
├── Achados
├── Constatações
├── Evidências
├── Critérios
├── Causas
├── Efeitos
├── Riscos
├── Recomendações
├── Determinações
├── Benefícios
├── Manifestações
├── Contraditório
├── Quadro de Resultados
└── Encaminhamento ao Relatório
```

---

# 3. MODELO CONCEITUAL DOS ACHADOS

## 3.1 Estrutura Metodológica

O sistema deverá adotar o modelo recomendado pelo Manual de Auditoria do Poder Judiciário.

Todo achado deverá possuir obrigatoriamente:

```text
Critério
↓
Condição
↓
Causa
↓
Efeito
↓
Evidência
↓
Risco
↓
Recomendação
```

---

## 3.2 Conceitos

### Critério

Norma, procedimento, padrão ou expectativa utilizada como referência.

### Condição

Situação efetivamente encontrada.

### Causa

Motivo da ocorrência da situação encontrada.

### Efeito

Consequência decorrente da condição observada.

### Evidência

Elementos que sustentam a conclusão.

### Risco

Impacto potencial associado ao problema identificado.

### Recomendação

Medida proposta para correção ou melhoria.

---

# 4. ENTIDADE ACHADO

## 4.1 Objetivo

Representar formalmente um resultado identificado durante os trabalhos de auditoria.

---

## 4.2 Entidade: Achado

| Campo            | Tipo        | Obrigatório |
| ---------------- | ----------- | ----------- |
| Id               | UUID        | Sim         |
| Código           | Texto       | Sim         |
| AuditoriaId      | UUID        | Sim         |
| Título           | Texto       | Sim         |
| Resumo Executivo | Texto Longo | Sim         |
| Critério         | Texto Longo | Sim         |
| Condição         | Texto Longo | Sim         |
| Causa            | Texto Longo | Sim         |
| Efeito           | Texto Longo | Sim         |
| Risco            | Texto Longo | Sim         |
| Conclusão        | Texto Longo | Sim         |
| Materialidade    | Enum        | Sim         |
| Relevância       | Enum        | Sim         |
| Criticidade      | Enum        | Sim         |
| Status           | Enum        | Sim         |

---

## 4.3 Status do Achado

```text
Rascunho
 ↓
Em Revisão
 ↓
Validado
 ↓
Em Contraditório
 ↓
Consolidado
 ↓
Encaminhado ao Relatório
```

---

# 5. CLASSIFICAÇÃO DOS ACHADOS

## 5.1 Categorias

### Não Conformidade

Descumprimento de norma ou obrigação.

### Fragilidade de Controle

Deficiência em controles internos.

### Oportunidade de Melhoria

Possibilidade de aprimoramento.

### Ineficiência Operacional

Problema relacionado ao desempenho.

### Risco Elevado

Situação que expõe significativamente a instituição.

### Boa Prática

Prática positiva identificada.

---

## 5.2 Natureza

### Estratégica

### Tática

### Operacional

### Financeira

### Tecnologia da Informação

### Integridade

### Conformidade

---

# 6. AVALIAÇÃO DE MATERIALIDADE

## 6.1 Objetivo

Mensurar a relevância quantitativa do achado.

---

## 6.2 Escala

| Valor | Classificação |
| ----- | ------------- |
| 1     | Muito Baixa   |
| 2     | Baixa         |
| 3     | Média         |
| 4     | Alta          |
| 5     | Muito Alta    |

---

## 6.3 Critérios

* impacto financeiro;
* volume processual;
* alcance institucional;
* exposição reputacional.

---

# 7. AVALIAÇÃO DE CRITICIDADE

## 7.1 Objetivo

Mensurar a gravidade do problema.

---

## 7.2 Fatores

### Impacto

### Probabilidade

### Exposição

### Persistência

---

## 7.3 Resultado

```text
Baixa
Média
Alta
Crítica
```

---

# 8. GESTÃO DE EVIDÊNCIAS DOS ACHADOS

## 8.1 Objetivo

Garantir rastreabilidade entre o achado e as evidências.

---

## 8.2 Relacionamentos

```text
Achado
 ↓
Papéis de Trabalho
 ↓
Evidências
```

---

## 8.3 Regras

### RN-ACH-001

Todo achado deverá possuir ao menos uma evidência vinculada.

### RN-ACH-002

Não será permitido consolidar achado sem evidência.

---

# 9. GESTÃO DE RISCOS ASSOCIADOS

## 9.1 Objetivo

Relacionar achados aos riscos institucionais.

---

## 9.2 Estrutura

Cada achado poderá estar vinculado a:

* risco estratégico;
* risco operacional;
* risco financeiro;
* risco de conformidade;
* risco de integridade;
* risco de TI.

---

## 9.3 Integração

Integração obrigatória com o módulo:

* Gestão de Riscos da AUDIN;
* Planejamento Baseado em Riscos.

---

# 10. RECOMENDAÇÕES

## 10.1 Objetivo

Formalizar ações corretivas ou preventivas.

---

## 10.2 Entidade: Recomendação

| Campo                | Tipo        |
| -------------------- | ----------- |
| Id                   | UUID        |
| AchadoId             | UUID        |
| Código               | Texto       |
| Descrição            | Texto Longo |
| Benefício Esperado   | Texto Longo |
| Prazo Sugerido       | Data        |
| Responsável Sugerido | Usuário     |

---

## 10.3 Características

### Específica

### Mensurável

### Exequível

### Relevante

### Temporal

---

## 10.4 Classificação

### Corretiva

### Preventiva

### Detectiva

### Compensatória

### Estrutural

---

# 11. DETERMINAÇÕES

## 11.1 Objetivo

Registrar decisões obrigatórias emitidas por autoridade competente.

---

## 11.2 Diferença Conceitual

### Recomendação

Orientativa.

### Determinação

Obrigatória.

---

## 11.3 Entidade

| Campo         |
| ------------- |
| Código        |
| Origem        |
| Autoridade    |
| Fundamentação |
| Prazo         |
| Responsável   |

---

# 12. BENEFÍCIOS

## 12.1 Objetivo

Mensurar ganhos decorrentes da auditoria.

---

## 12.2 Tipos

### Financeiro

### Não Financeiro

---

## 12.3 Benefícios Financeiros

* economia;
* recuperação de valores;
* redução de despesas;
* aumento de receita.

---

## 12.4 Benefícios Não Financeiros

* melhoria de controles;
* redução de riscos;
* melhoria da governança;
* melhoria da transparência;
* melhoria de desempenho.

---

# 13. CONTRADITÓRIO E AMPLA DEFESA

## 13.1 Objetivo

Permitir manifestação formal da unidade auditada.

---

## 13.2 Fluxo

```text
Achado Validado
 ↓
Encaminhamento
 ↓
Manifestação
 ↓
Análise da Auditoria
 ↓
Aceitação ou Rejeição
 ↓
Consolidação
```

---

## 13.3 Entidade: Manifestação

| Campo       |
| ----------- |
| Unidade     |
| Responsável |
| Data        |
| Texto       |
| Anexos      |

---

## 13.4 Regras

### RN-ACH-003

Todo achado deverá passar por contraditório antes do relatório final.

---

### RN-ACH-004

Exceções deverão possuir justificativa formal.

---

# 14. ANÁLISE DAS MANIFESTAÇÕES

## 14.1 Decisões Possíveis

### Aceita Integralmente

### Aceita Parcialmente

### Não Aceita

### Necessita Complementação

---

## 14.2 Registro Obrigatório

A auditoria deverá justificar formalmente sua decisão.

---

# 15. QUADRO DE RESULTADOS

## 15.1 Objetivo

Consolidar todos os resultados do trabalho.

---

## 15.2 Estrutura

| Elemento     |
| ------------ |
| Achado       |
| Criticidade  |
| Risco        |
| Recomendação |
| Responsável  |
| Prazo        |
| Status       |

---

## 15.3 Consolidação

O sistema deverá gerar automaticamente:

* resumo executivo;
* quadro de achados;
* quadro de recomendações;
* quadro de riscos;
* quadro de benefícios.

---

# 16. MATRIZ DE PRIORIDADE DAS RECOMENDAÇÕES

## 16.1 Objetivo

Determinar ordem de implementação.

---

## 16.2 Critérios

### Risco

### Impacto

### Urgência

### Complexidade

---

## 16.3 Resultado

| Faixa       | Prioridade |
| ----------- | ---------- |
| Muito Alta  | 5          |
| Alta        | 4          |
| Média       | 3          |
| Baixa       | 2          |
| Muito Baixa | 1          |

---

# 17. ENCAMINHAMENTO AO RELATÓRIO

## 17.1 Objetivo

Transferir automaticamente resultados para o módulo de Relatórios.

---

## 17.2 Dados Transferidos

### Achados

### Recomendações

### Determinações

### Benefícios

### Manifestações

### Riscos

### Evidências Referenciadas

---

# 18. DASHBOARD DE RESULTADOS

## 18.1 Indicadores Operacionais

### Quantidade de Achados

### Quantidade de Recomendações

### Quantidade de Determinações

### Benefícios Identificados

---

## 18.2 Indicadores Estratégicos

### Achados por Macroprocesso

### Achados por Unidade

### Achados por Criticidade

### Achados por Categoria

### Achados por Risco

---

## 18.3 Indicadores de Governança

### Fragilidades de Controle

### Riscos Críticos

### Tendências de Reincidência

### Tempo Médio de Resolução

---

# 19. REGRAS DE NEGÓCIO

## RN-ACH-005

Todo achado deverá possuir critério, condição, causa e efeito.

---

## RN-ACH-006

Todo achado deverá possuir risco associado.

---

## RN-ACH-007

Toda recomendação deverá estar vinculada a um único achado.

---

## RN-ACH-008

Uma recomendação poderá gerar múltiplos planos de ação.

---

## RN-ACH-009

Não será permitido excluir achados consolidados.

---

## RN-ACH-010

Toda alteração deverá gerar nova versão.

---

## RN-ACH-011

O contraditório deverá ser registrado eletronicamente.

---

## RN-ACH-012

A rejeição de manifestação deverá possuir justificativa obrigatória.

---

## RN-ACH-013

Toda determinação deverá possuir autoridade emissora registrada.

---

## RN-ACH-014

Achados classificados como críticos deverão gerar alerta automático à chefia da AUDIN.

---

## RN-ACH-015

Achados reincidentes deverão ser destacados automaticamente.

---

# 20. IDENTIFICAÇÃO DE REINCIDÊNCIA

## 20.1 Objetivo

Detectar problemas recorrentes.

---

## 20.2 Critérios

O sistema deverá identificar:

* mesma unidade;
* mesmo processo;
* mesmo risco;
* mesmo controle;
* mesma causa.

---

## 20.3 Classificações

### Primeira Ocorrência

### Reincidência

### Reincidência Crônica

---

# 21. BENEFÍCIOS PARA O PQAUD

## 21.1 Integração

O módulo deverá alimentar automaticamente:

### Avaliações Contínuas

### Indicadores de Qualidade

### Maturidade IA-CM

### Efetividade das Auditorias

---

# 22. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa dos achados.
2. Implementar metodologia Critério-Condição-Causa-Efeito.
3. Controlar recomendações e determinações.
4. Implementar contraditório eletrônico.
5. Consolidar quadro de resultados.
6. Identificar reincidências automaticamente.
7. Mensurar benefícios financeiros e não financeiros.
8. Integrar-se ao módulo de Relatórios.
9. Integrar-se ao módulo de Monitoramento.
10. Possuir rastreabilidade completa entre achados, evidências e recomendações.
11. Possuir indicadores operacionais, táticos e estratégicos.
12. Atender integralmente ao Manual de Auditoria do Poder Judiciário e às exigências da Resolução CNJ nº 309/2020.

---

## Dependências para os Próximos Volumes

As informações produzidas neste módulo serão consumidas diretamente por:

* **Volume VI – Relatórios e Monitoramento**
* **Volume VIII – PQAUD**
* **Volume IX – Gestão de Riscos da AUDIN**
* **Volume XV – Dashboards e Business Intelligence**

sendo o principal repositório institucional dos resultados produzidos pela atividade de auditoria interna.
