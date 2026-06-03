# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME VIII – PROGRAMA DE QUALIDADE E MELHORIA DA AUDITORIA INTERNA (PQAUD)

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume estabelece os requisitos funcionais, regras de negócio, indicadores, avaliações e mecanismos de governança necessários para implementação integral do Programa de Qualidade e Melhoria da Auditoria Interna (PQAUD).

O módulo deverá atender às disposições:

* da Resolução CNJ nº 309/2020;
* do Estatuto da Auditoria Interna;
* das Normas Globais de Auditoria Interna do IIA;
* do Modelo IA-CM;
* do Manual de Auditoria Interna do Poder Judiciário;
* das práticas de avaliação interna e externa de qualidade.

O sistema deverá permitir:

* Avaliação Contínua;
* Autoavaliações Periódicas;
* Avaliações Independentes Internas;
* Avaliações Externas;
* Gestão dos Indicadores de Qualidade;
* Gestão dos Planos de Melhoria;
* Gestão da Maturidade da Auditoria Interna;
* Pesquisas de Satisfação;
* Gestão de Não Conformidades;
* Monitoramento do PQAUD;
* Emissão de Relatórios de Qualidade;
* Consolidação da Evolução Histórica da AUDIN.

---

# 2. ARQUITETURA FUNCIONAL

```text
PQAUD
│
├── Governança do Programa
├── Avaliação Contínua
├── Autoavaliação Periódica
├── Avaliação Independente Interna
├── Avaliação Externa
├── Indicadores de Qualidade
├── Não Conformidades
├── Planos de Melhoria
├── Gestão IA-CM
├── Pesquisas de Satisfação
├── Benchmarking
├── Relatórios de Qualidade
└── Dashboards
```

---

# 3. GOVERNANÇA DO PQAUD

## 3.1 Objetivo

Controlar a estrutura de governança do programa de qualidade.

---

## 3.2 Entidade: ProgramaQualidade

| Campo       | Tipo    |
| ----------- | ------- |
| Id          | UUID    |
| Exercício   | Inteiro |
| DataInício  | Data    |
| DataFim     | Data    |
| Coordenador | Usuário |
| Status      | Enum    |

---

## 3.3 Status

```text
Planejado
 ↓
Em Execução
 ↓
Em Avaliação
 ↓
Concluído
```

---

# 4. AVALIAÇÃO CONTÍNUA

## 4.1 Objetivo

Avaliar permanentemente a aderência metodológica dos trabalhos realizados.

---

## 4.2 Fontes Avaliadas

### Planejamento

### Execução

### Achados

### Relatórios

### Monitoramento

### Consultorias

---

## 4.3 Avaliações Automáticas

O sistema deverá verificar automaticamente:

* preenchimento obrigatório;
* rastreabilidade documental;
* existência de supervisão;
* cumprimento dos workflows;
* versionamento;
* cumprimento de prazos.

---

## 4.4 Checklists Automatizados

Para cada auditoria concluída deverá ser gerado checklist de conformidade metodológica.

---

# 5. AUTOAVALIAÇÃO PERIÓDICA

## 5.1 Objetivo

Avaliar o nível de aderência da AUDIN às normas profissionais.

---

## 5.2 Periodicidade

* Anual;
* Bienal;
* Configurável.

---

## 5.3 Estrutura

```text
Domínio
 ↓
Princípio
 ↓
Requisito
 ↓
Pergunta
 ↓
Resposta
```

---

## 5.4 Domínios Avaliados

### Governança da Auditoria Interna

### Independência e Objetividade

### Planejamento

### Execução

### Comunicação

### Monitoramento

### Gestão de Pessoas

### Tecnologia

### Gestão de Riscos

### Qualidade

---

# 6. AVALIAÇÃO INDEPENDENTE INTERNA

## 6.1 Objetivo

Permitir avaliação realizada por auditor não participante do trabalho.

---

## 6.2 Escopo

### Auditorias

### Consultorias

### Monitoramentos

### Processos Internos da AUDIN

---

## 6.3 Critérios

### Conformidade

### Efetividade

### Eficiência

### Consistência

### Documentação

---

# 7. AVALIAÇÃO EXTERNA

## 7.1 Objetivo

Controlar avaliações externas independentes previstas pelas normas profissionais.

---

## 7.2 Modalidades

### Avaliação Externa Completa

### Autoavaliação com Validação Externa

---

## 7.3 Dados Controlados

| Campo                  |
| ---------------------- |
| Instituição Avaliadora |
| Equipe Avaliadora      |
| Escopo                 |
| Data Início            |
| Data Conclusão         |
| Relatório Final        |

---

## 7.4 Histórico

O sistema deverá manter histórico permanente das avaliações externas.

---

# 8. MODELO IA-CM

## 8.1 Objetivo

Controlar a evolução da maturidade institucional da Auditoria Interna.

---

## 8.2 Estrutura

### Nível 1 – Inicial

### Nível 2 – Infraestrutura

### Nível 3 – Integrado

### Nível 4 – Gerenciado

### Nível 5 – Otimizado

---

## 8.3 Áreas-Chave de Processo

### Serviços e Papel da Auditoria

### Gestão de Pessoas

### Práticas Profissionais

### Gestão de Desempenho

### Relacionamento Organizacional

### Estrutura de Governança

---

## 8.4 Avaliação

Cada requisito deverá possuir:

| Campo             |
| ----------------- |
| Evidência         |
| Situação Atual    |
| Meta              |
| Plano de Evolução |

---

# 9. INDICADORES DE QUALIDADE

## 9.1 Objetivo

Mensurar desempenho e qualidade da atividade de auditoria.

---

## 9.2 Categorias

### Conformidade

### Produtividade

### Efetividade

### Satisfação

### Maturidade

### Valor Agregado

---

# 10. INDICADORES OBRIGATÓRIOS

## 10.1 Conformidade Metodológica

Percentual de auditorias aderentes à metodologia institucional.

---

## 10.2 Supervisão Técnica

Percentual de trabalhos supervisionados.

---

## 10.3 Cumprimento do PAA

Percentual de execução do Plano Anual de Auditoria.

---

## 10.4 Taxa de Implementação

Obtida do módulo de monitoramento.

---

## 10.5 Taxa de Efetividade

Obtida do módulo de monitoramento.

---

## 10.6 Satisfação dos Clientes

Obtida das pesquisas de satisfação.

---

## 10.7 Benefícios Gerados

Obtidos dos módulos de auditoria e consultoria.

---

# 11. PESQUISA DE SATISFAÇÃO

## 11.1 Objetivo

Avaliar a percepção das partes interessadas.

---

## 11.2 Públicos

### Alta Administração

### Unidades Auditadas

### Comitês

### Gestores

### Equipe da AUDIN

---

## 11.3 Critérios

| Critério          |
| ----------------- |
| Qualidade Técnica |
| Clareza           |
| Tempestividade    |
| Utilidade         |
| Profissionalismo  |
| Valor Agregado    |

---

## 11.4 Escala

| Nota |
| ---- |
| 1    |
| 2    |
| 3    |
| 4    |
| 5    |

---

# 12. GESTÃO DE NÃO CONFORMIDADES

## 12.1 Objetivo

Registrar desvios identificados nas avaliações.

---

## 12.2 Classificações

### Crítica

### Alta

### Média

### Baixa

---

## 12.3 Categorias

### Normativa

### Metodológica

### Processual

### Tecnológica

### Documental

---

## 12.4 Entidade: NãoConformidade

| Campo         |
| ------------- |
| Código        |
| Descrição     |
| Origem        |
| Classificação |
| Data          |
| Responsável   |

---

# 13. PLANOS DE MELHORIA

## 13.1 Objetivo

Gerenciar ações corretivas decorrentes das avaliações.

---

## 13.2 Estrutura

```text
Não Conformidade
 ↓
Plano de Melhoria
 ↓
Ação
 ↓
Implementação
 ↓
Validação
```

---

## 13.3 Campos

| Campo              |
| ------------------ |
| Ação               |
| Responsável        |
| Prazo              |
| Indicador          |
| Resultado Esperado |

---

# 14. GESTÃO DE BOAS PRÁTICAS

## 14.1 Objetivo

Registrar práticas bem-sucedidas.

---

## 14.2 Fontes

### Auditorias

### Consultorias

### Avaliações Externas

### Benchmarking

---

## 14.3 Benefícios

* compartilhamento de conhecimento;
* padronização;
* inovação;
* melhoria contínua.

---

# 15. BENCHMARKING

## 15.1 Objetivo

Comparar a AUDIN com organizações similares.

---

## 15.2 Fontes

### Tribunais

### Órgãos de Controle

### Poder Judiciário

### Administração Pública

---

## 15.3 Dados Comparativos

* estrutura;
* produtividade;
* maturidade;
* indicadores;
* práticas adotadas.

---

# 16. RELATÓRIO DE QUALIDADE

## 16.1 Objetivo

Consolidar os resultados do PQAUD.

---

## 16.2 Estrutura

### Introdução

### Metodologia

### Indicadores

### Não Conformidades

### Planos de Melhoria

### IA-CM

### Satisfação

### Conclusões

### Recomendações

---

## 16.3 Geração Automática

O sistema deverá gerar automaticamente:

* gráficos;
* indicadores;
* tendências;
* comparativos históricos.

---

# 17. MATRIZ DE MATURIDADE

## 17.1 Objetivo

Mensurar evolução institucional.

---

## 17.2 Dimensões

| Dimensão     |
| ------------ |
| Governança   |
| Pessoas      |
| Tecnologia   |
| Metodologia  |
| Qualidade    |
| Riscos       |
| Planejamento |

---

## 17.3 Escala

| Nível |
| ----- |
| 1     |
| 2     |
| 3     |
| 4     |
| 5     |

---

# 18. DASHBOARD DO PQAUD

## 18.1 Dashboard Executivo

Indicadores:

* nível IA-CM;
* conformidade metodológica;
* cumprimento do PAA;
* satisfação.

---

## 18.2 Dashboard Operacional

Indicadores:

* avaliações realizadas;
* não conformidades abertas;
* planos de melhoria pendentes;
* avaliações externas.

---

## 18.3 Dashboard Estratégico

Indicadores:

* evolução da maturidade;
* tendências;
* riscos da AUDIN;
* capacidade institucional.

---

# 19. INTEGRAÇÃO COM TODOS OS MÓDULOS

## 19.1 Planejamento

Receber:

* execução do PAA;
* cobertura do universo auditável.

---

## 19.2 Execução

Receber:

* qualidade dos papéis de trabalho;
* supervisão;
* evidências.

---

## 19.3 Achados

Receber:

* qualidade dos resultados;
* reincidências.

---

## 19.4 Monitoramento

Receber:

* implementação;
* efetividade.

---

## 19.5 Consultorias

Receber:

* satisfação;
* benefícios.

---

# 20. MATRIZ DE CONFORMIDADE NORMATIVA

## 20.1 Objetivo

Avaliar aderência da AUDIN aos normativos aplicáveis.

---

## 20.2 Referenciais

* Resolução CNJ nº 309/2020;
* Estatuto da Auditoria Interna;
* Normas Globais de Auditoria Interna;
* IA-CM;
* PQAUD Institucional.

---

## 20.3 Resultado

| Situação              |
| --------------------- |
| Conforme              |
| Parcialmente Conforme |
| Não Conforme          |

---

# 21. WORKFLOW DO PQAUD

```text
Planejamento
 ↓
Avaliação
 ↓
Identificação de Não Conformidades
 ↓
Plano de Melhoria
 ↓
Implementação
 ↓
Validação
 ↓
Relatório
 ↓
Encerramento
```

---

# 22. REGRAS DE NEGÓCIO

## RN-PQA-001

Toda auditoria concluída deverá alimentar automaticamente os indicadores de qualidade.

---

## RN-PQA-002

Toda avaliação deverá gerar histórico permanente.

---

## RN-PQA-003

Não conformidades críticas deverão gerar plano de melhoria obrigatório.

---

## RN-PQA-004

Toda ação corretiva deverá possuir responsável e prazo.

---

## RN-PQA-005

O sistema deverá preservar todas as evidências utilizadas nas avaliações.

---

## RN-PQA-006

O resultado das avaliações externas deverá permanecer disponível permanentemente.

---

## RN-PQA-007

Indicadores deverão ser recalculados automaticamente.

---

## RN-PQA-008

Toda alteração metodológica deverá ser registrada para fins de rastreabilidade.

---

## RN-PQA-009

O sistema deverá manter histórico evolutivo do IA-CM.

---

## RN-PQA-010

Planos de melhoria vencidos deverão gerar alertas automáticos.

---

## RN-PQA-011

Não conformidades reincidentes deverão ser destacadas nos dashboards executivos.

---

## RN-PQA-012

O relatório anual do PQAUD deverá ser gerado automaticamente a partir dos dados consolidados.

---

# 23. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Implementar integralmente o Programa de Qualidade e Melhoria da Auditoria Interna.
2. Permitir avaliações contínuas, periódicas, internas e externas.
3. Implementar gestão completa de não conformidades.
4. Implementar gestão de planos de melhoria.
5. Controlar maturidade IA-CM.
6. Consolidar indicadores institucionais de qualidade.
7. Aplicar pesquisas de satisfação.
8. Gerar relatórios automáticos de qualidade.
9. Possuir dashboards operacionais, gerenciais e estratégicos.
10. Manter rastreabilidade completa das avaliações.
11. Integrar-se a todos os módulos do sistema.
12. Permitir monitoramento da evolução institucional da AUDIN.
13. Atender integralmente à Resolução CNJ nº 309/2020, às Normas Globais de Auditoria Interna e ao modelo IA-CM.

---

# 24. SUBMÓDULO ESPECÍFICO – AVALIAÇÃO DE QUALIDADE DOS TRABALHOS (AQT)

## 24.1 Objetivo

Executar avaliação formal da qualidade de cada auditoria realizada.

---

## 24.2 Dimensões Avaliadas

### Planejamento

### Execução

### Evidências

### Achados

### Relatório

### Monitoramento

---

## 24.3 Pontuação

| Faixa    | Resultado          |
| -------- | ------------------ |
| 90 a 100 | Excelente          |
| 80 a 89  | Muito Bom          |
| 70 a 79  | Adequado           |
| 60 a 69  | Necessita Melhoria |
| < 60     | Não Conforme       |

---

## 24.4 Resultado

A nota da AQT deverá alimentar:

* Indicadores do PQAUD;
* Avaliação IA-CM;
* Relatório Anual da AUDIN;
* Painéis Executivos.

---

## Dependências para os Próximos Volumes

As informações produzidas neste módulo serão utilizadas diretamente por:

* **Volume IX – Gestão de Riscos da AUDIN**
* **Volume X – Gestão de Competências e PAC-Aud**
* **Volume XI – Gestão Documental e Conhecimento**
* **Volume XIV – Relatório Anual de Atividades**
* **Volume XV – Business Intelligence e Analytics**

e constituem o principal mecanismo de governança, melhoria contínua e demonstração da conformidade da atividade de Auditoria Interna perante a Alta Administração, CNJ e órgãos de controle.
