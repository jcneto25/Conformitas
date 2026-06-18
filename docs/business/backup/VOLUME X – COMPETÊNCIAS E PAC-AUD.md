# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME X – GESTÃO DE COMPETÊNCIAS, CAPACITAÇÃO E PAC-AUD

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume estabelece os requisitos funcionais, estruturas de dados, regras de negócio e mecanismos de governança necessários para a gestão do desenvolvimento profissional da Auditoria Interna.

O módulo deverá apoiar:

* Gestão de Competências da AUDIN;
* Gestão de Perfis Profissionais;
* Mapeamento de Conhecimentos;
* Gestão de Certificações;
* Gestão de Capacitações;
* Planejamento Anual de Capacitação da Auditoria (PAC-Aud);
* Levantamento de Necessidades de Capacitação (LNC);
* Trilhas de Aprendizagem;
* Avaliação de Efetividade das Capacitações;
* Gestão de Instrutores;
* Gestão de Eventos;
* Banco de Especialistas;
* Gestão da Capacidade Técnica da Equipe;
* Suporte ao PQAUD;
* Suporte ao IA-CM.

O módulo deverá atender às exigências da Resolução CNJ nº 309/2020 relativas à qualificação permanente da equipe de auditoria.

---

# 2. FUNDAMENTAÇÃO NORMATIVA

O módulo deverá observar:

* Resolução CNJ nº 309/2020;
* Normas Globais de Auditoria Interna do IIA;
* Modelo IA-CM;
* Política de Gestão de Pessoas do Tribunal;
* Plano Estratégico Institucional;
* PQAUD;
* PAC-Aud institucional.

---

# 3. ARQUITETURA FUNCIONAL

```text
Gestão de Competências e PAC-Aud
│
├── Inventário de Competências
├── Mapeamento de Competências
├── Perfis Profissionais
├── Banco de Conhecimentos
├── Certificações
├── Levantamento de Necessidades
├── PAC-Aud
├── Capacitações
├── Trilhas de Aprendizagem
├── Eventos
├── Instrutores
├── Avaliação de Efetividade
├── Banco de Especialistas
├── Gestão de Horas de Capacitação
├── Indicadores
└── Relatórios
```

---

# 4. MODELO DE GESTÃO DE COMPETÊNCIAS

## 4.1 Objetivo

Permitir identificar, medir e desenvolver as competências necessárias para execução das atividades de auditoria interna.

---

## 4.2 Estrutura Conceitual

```text
Competência
     ↓
Conhecimento
     ↓
Habilidade
     ↓
Atitude
```

---

## 4.3 Categorias

### Competências Técnicas

Relacionadas à execução da atividade de auditoria.

---

### Competências Gerenciais

Relacionadas à liderança e gestão.

---

### Competências Comportamentais

Relacionadas ao comportamento profissional.

---

### Competências Digitais

Relacionadas ao uso de tecnologia e análise de dados.

---

# 5. INVENTÁRIO DE COMPETÊNCIAS

## 5.1 Objetivo

Manter catálogo institucional das competências requeridas pela AUDIN.

---

## 5.2 Entidade: Competencia

| Campo       | Tipo        |
| ----------- | ----------- |
| Id          | UUID        |
| Código      | Texto       |
| Nome        | Texto       |
| Categoria   | Enum        |
| Descrição   | Texto Longo |
| Criticidade | Enum        |
| Ativa       | Boolean     |

---

## 5.3 Competências Mínimas Recomendadas

### Auditoria Governamental

### Gestão de Riscos

### Controles Internos

### Compliance

### Governança Pública

### Planejamento Estratégico

### Licitações e Contratos

### Tecnologia da Informação

### Segurança da Informação

### LGPD

### Integridade Pública

### Ciência de Dados

### Business Intelligence

### Inteligência Artificial

### Investigação e Fraude

### Gestão de Projetos

---

# 6. PERFIS PROFISSIONAIS

## 6.1 Objetivo

Definir competências esperadas para cada função.

---

## 6.2 Perfis

### Chefe da AUDIN

### Coordenador de Auditoria

### Supervisor de Auditoria

### Auditor Interno

### Auditor de TI

### Especialista

### Apoio Administrativo

---

## 6.3 Estrutura

| Campo         |
| ------------- |
| Perfil        |
| Competência   |
| Nível Exigido |
| Obrigatória   |
| Peso          |

---

# 7. MATRIZ DE COMPETÊNCIAS

## 7.1 Objetivo

Comparar competências requeridas e competências existentes.

---

## 7.2 Escala

| Nível | Descrição     |
| ----- | ------------- |
| 1     | Básico        |
| 2     | Intermediário |
| 3     | Avançado      |
| 4     | Especialista  |
| 5     | Referência    |

---

## 7.3 Resultado

O sistema deverá identificar automaticamente:

* lacunas de competência;
* competências críticas;
* especialistas;
* riscos de conhecimento.

---

# 8. AVALIAÇÃO DE COMPETÊNCIAS

## 8.1 Objetivo

Mensurar o nível atual dos profissionais.

---

## 8.2 Métodos

### Autoavaliação

### Avaliação da Chefia

### Avaliação Técnica

### Certificações

### Histórico de Atuação

---

## 8.3 Consolidação

O sistema deverá gerar pontuação consolidada por competência.

---

# 9. BANCO DE CERTIFICAÇÕES

## 9.1 Objetivo

Controlar certificações profissionais.

---

## 9.2 Entidade: Certificacao

| Campo         |
| ------------- |
| Nome          |
| Instituição   |
| Data Emissão  |
| Data Validade |
| Certificado   |
| Status        |

---

## 9.3 Certificações Relevantes

### CIA

### CRMA

### CISA

### CISM

### CGAP

### PMP

### COBIT

### ITIL

### ISO 27001

### ISO 31000

### Data Analytics

### IA Aplicada

---

# 10. LEVANTAMENTO DE NECESSIDADES DE CAPACITAÇÃO (LNC)

## 10.1 Objetivo

Identificar necessidades de desenvolvimento.

---

## 10.2 Fontes

### PAA

### PQAUD

### IA-CM

### Gestão de Riscos

### Avaliação de Competências

### Demandas Estratégicas

---

## 10.3 Resultado

Lista priorizada de capacitações necessárias.

---

# 11. PAC-AUD

## 11.1 Objetivo

Planejar o desenvolvimento anual da equipe.

---

## 11.2 Entidade: PlanoCapacitacao

| Campo       |
| ----------- |
| Exercício   |
| Objetivo    |
| Capacitação |
| Público     |
| Horas       |
| Custo       |
| Prioridade  |

---

## 11.3 Workflow

```text
Planejamento
      ↓
Aprovação
      ↓
Execução
      ↓
Avaliação
      ↓
Encerramento
```

---

# 12. TRILHAS DE APRENDIZAGEM

## 12.1 Objetivo

Estruturar jornadas de desenvolvimento.

---

## 12.2 Exemplos

### Trilha de Auditor Interno

### Trilha de Auditor de TI

### Trilha de Gestão de Riscos

### Trilha de Governança

### Trilha de Ciência de Dados

### Trilha de Inteligência Artificial

---

## 12.3 Estrutura

```text
Trilha
 ↓
Módulo
 ↓
Curso
 ↓
Avaliação
 ↓
Certificação
```

---

# 13. GESTÃO DE CAPACITAÇÕES

## 13.1 Objetivo

Gerenciar ações de treinamento.

---

## 13.2 Modalidades

### Presencial

### EAD

### Híbrida

### Workshop

### Seminário

### Congresso

### Comunidade de Prática

### Mentoria

---

## 13.3 Dados

| Campo         |
| ------------- |
| Curso         |
| Instituição   |
| Carga Horária |
| Participantes |
| Custo         |
| Resultado     |

---

# 14. GESTÃO DE EVENTOS

## 14.1 Objetivo

Controlar participação em eventos.

---

## 14.2 Tipos

### Congresso

### Fórum

### Seminário

### Workshop

### Encontro Técnico

### Capacitação Externa

---

## 14.3 Informações

* local;
* data;
* participantes;
* custos;
* resultados obtidos.

---

# 15. BANCO DE ESPECIALISTAS

## 15.1 Objetivo

Identificar especialistas internos.

---

## 15.2 Critérios

### Experiência

### Certificações

### Produção Técnica

### Capacitações

### Avaliações

---

## 15.3 Utilização

O banco deverá ser utilizado para:

* composição de equipes;
* consultorias;
* avaliações especializadas;
* capacitações internas.

---

# 16. GESTÃO DE INSTRUTORES

## 16.1 Objetivo

Gerenciar instrutores internos e externos.

---

## 16.2 Dados

| Campo           |
| --------------- |
| Nome            |
| Especialidade   |
| Currículo       |
| Certificações   |
| Avaliação Média |

---

# 17. AVALIAÇÃO DAS CAPACITAÇÕES

## 17.1 Objetivo

Mensurar qualidade e efetividade.

---

## 17.2 Níveis de Avaliação

### Reação

Satisfação imediata.

---

### Aprendizagem

Aquisição de conhecimento.

---

### Aplicação

Uso no trabalho.

---

### Resultado

Impacto organizacional.

---

## 17.3 Modelo

Baseado no modelo Kirkpatrick.

---

# 18. AVALIAÇÃO DE EFETIVIDADE

## 18.1 Objetivo

Verificar geração de valor institucional.

---

## 18.2 Indicadores

### Aplicação do Conhecimento

### Melhoria de Desempenho

### Aumento de Produtividade

### Evolução das Competências

---

## 18.3 Prazo

Avaliação realizada entre 90 e 180 dias após a capacitação.

---

# 19. GESTÃO DE HORAS DE CAPACITAÇÃO

## 19.1 Objetivo

Controlar cumprimento das metas anuais.

---

## 19.2 Controle

| Campo            |
| ---------------- |
| Servidor         |
| Exercício        |
| Horas Planejadas |
| Horas Executadas |
| Saldo            |

---

## 19.3 Indicador

---

# 20. INTEGRAÇÃO COM O PQAUD

## 20.1 Objetivo

Apoiar melhoria contínua da atividade de auditoria.

---

## 20.2 Indicadores Compartilhados

### Horas de Capacitação

### Cobertura de Competências

### Maturidade Técnica

### Especialização da Equipe

### Evolução IA-CM

---

# 21. INTEGRAÇÃO COM A GESTÃO DE RISCOS

## 21.1 Objetivo

Identificar riscos relacionados à capacidade técnica.

---

## 21.2 Exemplos

### Ausência de Especialistas

### Dependência de Conhecimento

### Certificações Críticas Expiradas

### Competências Emergentes Não Cobertas

---

# 22. DASHBOARD DE COMPETÊNCIAS

## 22.1 Dashboard Executivo

Indicadores:

* percentual de competências atendidas;
* horas de capacitação;
* certificações vigentes;
* especialistas disponíveis.

---

## 22.2 Dashboard Gerencial

Indicadores:

* lacunas por competência;
* evolução da equipe;
* execução do PAC-Aud;
* distribuição de especialidades.

---

## 22.3 Dashboard Estratégico

Indicadores:

* maturidade técnica;
* riscos de conhecimento;
* competências emergentes;
* aderência ao IA-CM.

---

# 23. RELATÓRIOS

## 23.1 Operacionais

### Matriz de Competências

### Certificações

### Capacitações

### Participação em Eventos

---

## 23.2 Gerenciais

### Execução do PAC-Aud

### Lacunas de Competências

### Especialistas Disponíveis

### Custos de Capacitação

---

## 23.3 Estratégicos

### Evolução Institucional

### Maturidade Técnica

### Capacidade Operacional

### Conformidade com Normas

---

# 24. WORKFLOW DE DESENVOLVIMENTO PROFISSIONAL

```text
Avaliação
      ↓
Identificação de Lacunas
      ↓
LNC
      ↓
PAC-Aud
      ↓
Capacitação
      ↓
Avaliação
      ↓
Efetividade
      ↓
Atualização da Competência
```

---

# 25. REGRAS DE NEGÓCIO

## RN-CAP-001

Toda competência deverá possuir categoria definida.

---

## RN-CAP-002

Todo perfil profissional deverá possuir competências mínimas associadas.

---

## RN-CAP-003

Toda capacitação deverá estar vinculada a pelo menos uma competência.

---

## RN-CAP-004

Certificações com validade expirada deverão gerar alertas automáticos.

---

## RN-CAP-005

Toda ação do PAC-Aud deverá possuir responsável e orçamento.

---

## RN-CAP-006

O sistema deverá recalcular automaticamente a matriz de competências após conclusão de capacitações.

---

## RN-CAP-007

Toda avaliação de efetividade deverá ser registrada eletronicamente.

---

## RN-CAP-008

Capacitações obrigatórias não concluídas deverão ser destacadas nos dashboards.

---

## RN-CAP-009

O histórico de competências e certificações deverá ser permanente.

---

## RN-CAP-010

Toda trilha de aprendizagem deverá possuir critérios objetivos de conclusão.

---

## RN-CAP-011

A composição de equipes de auditoria deverá poder utilizar automaticamente a matriz de competências como critério de seleção.

---

## RN-CAP-012

O sistema deverá identificar competências emergentes com base em temas estratégicos e riscos institucionais.

---

# 26. SUBMÓDULO AVANÇADO – MOTOR DE ALOCAÇÃO INTELIGENTE DE AUDITORES

## 26.1 Objetivo

Auxiliar a formação das equipes de auditoria com base em competências e disponibilidade.

---

## 26.2 Critérios Utilizados

* competências requeridas;
* certificações;
* experiência anterior;
* disponibilidade;
* carga de trabalho;
* independência;
* conflitos de interesse.

---

## 26.3 Resultado

O sistema deverá sugerir automaticamente:

* equipe ideal;
* lacunas da equipe;
* necessidade de capacitação;
* necessidade de apoio externo.

---

# 27. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa das competências da AUDIN.
2. Implementar matriz de competências e perfis profissionais.
3. Controlar certificações e capacitações.
4. Implementar o PAC-Aud e o LNC.
5. Controlar trilhas de aprendizagem.
6. Aplicar avaliações de reação, aprendizagem e efetividade.
7. Gerar indicadores e dashboards gerenciais.
8. Integrar-se ao PQAUD e ao IA-CM.
9. Apoiar a formação de equipes de auditoria.
10. Identificar lacunas e riscos de conhecimento.
11. Possuir rastreabilidade histórica completa.
12. Atender às exigências da Resolução CNJ nº 309/2020, das Normas Globais de Auditoria Interna e do modelo IA-CM.

---

## Dependências para os Próximos Volumes

As informações produzidas neste módulo serão utilizadas diretamente por:

* **Volume XI – Gestão Documental e Gestão do Conhecimento**
* **Volume XII – Administração do Sistema e Segurança**
* **Volume XIV – Relatório Anual de Atividades**
* **Volume XV – Business Intelligence e Analytics**
* **Volume XVI – Inteligência Analítica e IA Aplicada à Auditoria**

e constituem a base para o desenvolvimento contínuo da capacidade institucional, da maturidade profissional da AUDIN e da sustentabilidade técnica da atividade de Auditoria Interna.
