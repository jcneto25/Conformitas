# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME VII – CONSULTORIAS, AVALIAÇÕES E SERVIÇOS DE ASSESSORAMENTO

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume especifica os requisitos funcionais, regras de negócio, fluxos operacionais e estruturas de dados relacionados aos serviços de consultoria, assessoramento e avaliação prestados pela Auditoria Interna.

O módulo deverá observar integralmente os princípios previstos no IPPF, nas Normas Globais de Auditoria Interna do IIA, na Resolução CNJ nº 309/2020 e nos normativos internos da AUDIN.

O sistema deverá suportar:

* Consultorias formais;
* Assessoramento técnico;
* Avaliações específicas;
* Participação em grupos de trabalho;
* Participação em projetos estratégicos;
* Revisão prévia de normativos;
* Orientações técnicas;
* Emissão de pareceres consultivos;
* Gestão de demandas de consultoria;
* Controle da independência da auditoria;
* Registro dos benefícios gerados.

---

# 2. ARQUITETURA FUNCIONAL

```text
Consultorias e Assessoramento
│
├── Solicitações
├── Triagem
├── Análise de Independência
├── Planejamento
├── Execução
├── Produtos Entregues
├── Pareceres
├── Orientações Técnicas
├── Participação em Projetos
├── Avaliações Específicas
├── Encerramento
├── Pesquisa de Satisfação
└── Indicadores
```

---

# 3. CONCEITOS FUNDAMENTAIS

## 3.1 Consultoria

Serviço de aconselhamento e apoio prestado mediante solicitação do cliente interno, destinado a agregar valor e melhorar processos, sem assumir responsabilidade gerencial.

---

## 3.2 Assessoramento

Atividade de suporte técnico prestada pela Auditoria Interna para subsidiar decisões da administração.

---

## 3.3 Avaliação Específica

Trabalho pontual destinado a analisar determinado tema, processo, sistema ou iniciativa institucional.

---

## 3.4 Orientação Técnica

Manifestação formal contendo interpretação técnica, esclarecimento metodológico ou recomendação preventiva.

---

# 4. PRINCÍPIOS OBRIGATÓRIOS

## 4.1 Independência

A Auditoria Interna não poderá assumir responsabilidades operacionais.

---

## 4.2 Objetividade

Toda manifestação deverá ser baseada em critérios técnicos.

---

## 4.3 Não Cogestão

A AUDIN não poderá:

* aprovar processos administrativos;
* executar controles internos;
* autorizar despesas;
* homologar contratações;
* assumir atribuições de gestão.

---

## 4.4 Preservação da Capacidade de Auditoria

Toda consultoria deverá registrar potenciais impactos futuros na independência dos trabalhos de auditoria.

---

# 5. SOLICITAÇÃO DE CONSULTORIA

## 5.1 Objetivo

Formalizar demandas encaminhadas à AUDIN.

---

## 5.2 Origens

### Presidência

### Corregedoria

### Comitês

### Secretarias

### Diretorias

### Unidades Administrativas

### Demandas Internas da AUDIN

---

## 5.3 Entidade: SolicitaçãoConsultoria

| Campo           | Tipo    |
| --------------- | ------- |
| Id              | UUID    |
| Número          | Texto   |
| DataSolicitação | Data    |
| Solicitante     | Usuário |
| Unidade         | Unidade |
| Assunto         | Texto   |
| Objetivo        | Texto   |
| Justificativa   | Texto   |
| Prioridade      | Enum    |
| Status          | Enum    |

---

# 6. TRIAGEM DAS DEMANDAS

## 6.1 Objetivo

Avaliar admissibilidade da solicitação.

---

## 6.2 Critérios

### Competência da AUDIN

### Alinhamento Estratégico

### Disponibilidade de Recursos

### Conflito de Interesse

### Impacto Institucional

### Complexidade

---

## 6.3 Resultado

### Aceita

### Aceita com Ressalvas

### Necessita Complementação

### Indeferida

---

# 7. ANÁLISE DE INDEPENDÊNCIA

## 7.1 Objetivo

Verificar riscos à independência da Auditoria Interna.

---

## 7.2 Questionário Obrigatório

O sistema deverá exigir análise sobre:

* participação futura em auditorias do tema;
* potencial conflito de interesse;
* risco de cogestão;
* responsabilidade operacional;
* influência na tomada de decisão.

---

## 7.3 Resultado

| Situação           | Consequência        |
| ------------------ | ------------------- |
| Sem Restrição      | Prosseguir          |
| Restrição Moderada | Aprovação da Chefia |
| Restrição Grave    | Indeferimento       |

---

# 8. CLASSIFICAÇÃO DOS SERVIÇOS

## 8.1 Consultoria

Prestação estruturada de aconselhamento.

---

## 8.2 Assessoramento

Apoio técnico à administração.

---

## 8.3 Orientação Técnica

Resposta técnica específica.

---

## 8.4 Avaliação Específica

Análise pontual.

---

## 8.5 Participação em Projeto

Atuação consultiva em projetos institucionais.

---

## 8.6 Revisão de Normativo

Análise técnica de regulamentos e políticas.

---

# 9. PLANEJAMENTO DA CONSULTORIA

## 9.1 Objetivo

Definir escopo e metodologia.

---

## 9.2 Campos Obrigatórios

| Campo                |
| -------------------- |
| Objetivo             |
| Escopo               |
| Metodologia          |
| Equipe               |
| Cronograma           |
| Produtos Esperados   |
| Riscos Identificados |

---

## 9.3 Workflow

```text
Rascunho
 ↓
Revisão
 ↓
Aprovação
 ↓
Execução
```

---

# 10. EXECUÇÃO DA CONSULTORIA

## 10.1 Atividades Possíveis

### Reuniões Técnicas

### Workshops

### Entrevistas

### Avaliação de Documentos

### Avaliação de Processos

### Avaliação de Sistemas

### Benchmarking

### Apoio Metodológico

---

## 10.2 Registro de Atividades

Cada atividade deverá registrar:

| Campo         |
| ------------- |
| Data          |
| Participantes |
| Objetivo      |
| Resultado     |
| Anexos        |

---

# 11. GESTÃO DE EVIDÊNCIAS

## 11.1 Objetivo

Registrar elementos utilizados nas análises.

---

## 11.2 Tipos

### Documentos

### Normativos

### Atas

### Estudos

### Relatórios

### Bases de Dados

### Evidências Externas

---

# 12. PRODUTOS ENTREGUES

## 12.1 Tipos

### Relatório Consultivo

### Parecer Técnico

### Nota Técnica

### Orientação Técnica

### Relatório de Avaliação

### Manifestação Técnica

### Ata de Encerramento

---

# 13. RELATÓRIO CONSULTIVO

## 13.1 Estrutura

### Identificação

### Contexto

### Objetivos

### Escopo

### Metodologia

### Análise

### Conclusões

### Recomendações

### Limitações

### Anexos

---

## 13.2 Características

Diferentemente da auditoria:

* não gera achados obrigatórios;
* não gera determinações;
* não possui contraditório formal obrigatório;
* não gera monitoramento automático.

---

# 14. ORIENTAÇÕES TÉCNICAS

## 14.1 Objetivo

Emitir posicionamentos técnicos formais.

---

## 14.2 Estrutura

### Consulta

### Fundamentação

### Entendimento Técnico

### Orientação

### Referências

---

# 15. PARECERES TÉCNICOS

## 15.1 Objetivo

Emitir opinião especializada.

---

## 15.2 Estrutura

### Contextualização

### Análise

### Fundamentação

### Conclusão

### Responsáveis

---

# 16. PARTICIPAÇÃO EM PROJETOS

## 16.1 Objetivo

Controlar atuação consultiva em projetos institucionais.

---

## 16.2 Dados

| Campo               |
| ------------------- |
| Projeto             |
| Unidade Responsável |
| Papel da AUDIN      |
| Data Início         |
| Data Fim            |
| Horas Empregadas    |

---

## 16.3 Restrições

### RN-CON-001

A AUDIN não poderá assumir papel de gestor do projeto.

---

# 17. PARTICIPAÇÃO EM COMITÊS

## 17.1 Objetivo

Registrar participação institucional.

---

## 17.2 Tipos

### Comitê de Governança

### Comitê de Riscos

### Comitê de Integridade

### Comitê de Segurança

### Outros Comitês Institucionais

---

## 17.3 Dados

* período;
* representante;
* função exercida;
* deliberações acompanhadas.

---

# 18. AVALIAÇÕES ESPECÍFICAS

## 18.1 Objetivo

Executar avaliações pontuais sem caracterizar auditoria completa.

---

## 18.2 Exemplos

### Avaliação de Processo

### Avaliação de Sistema

### Avaliação de Controle

### Avaliação de Projeto

### Avaliação de Risco

---

# 19. PESQUISA DE SATISFAÇÃO

## 19.1 Objetivo

Avaliar percepção dos clientes.

---

## 19.2 Aplicação

Ao encerramento da consultoria.

---

## 19.3 Critérios

### Utilidade

### Clareza

### Tempestividade

### Qualidade Técnica

### Atendimento da Necessidade

---

## 19.4 Escala

| Nota |
| ---- |
| 1    |
| 2    |
| 3    |
| 4    |
| 5    |

---

# 20. BENEFÍCIOS GERADOS

## 20.1 Objetivo

Mensurar valor agregado.

---

## 20.2 Categorias

### Governança

### Gestão de Riscos

### Controles Internos

### Integridade

### Eficiência Operacional

### Transformação Digital

### Transparência

---

# 21. DASHBOARD DE CONSULTORIAS

## 21.1 Indicadores Operacionais

* Consultorias em andamento;
* Consultorias concluídas;
* Demandas pendentes;
* Prazo médio de atendimento.

---

## 21.2 Indicadores Gerenciais

* Horas dedicadas;
* Benefícios gerados;
* Unidades atendidas;
* Participação em projetos.

---

## 21.3 Indicadores Estratégicos

* Índice de satisfação;
* Impacto institucional;
* Temas mais demandados;
* Tendências de governança.

---

# 22. INTEGRAÇÃO COM O PLANEJAMENTO

## 22.1 Integração com PAA

O sistema deverá controlar:

* horas planejadas para consultorias;
* horas executadas;
* saldo de capacidade operacional.

---

## 22.2 Regras

### RN-CON-002

Consultorias extraordinárias deverão impactar automaticamente a capacidade operacional disponível.

---

# 23. INTEGRAÇÃO COM O PQAUD

## 23.1 Objetivo

Avaliar qualidade dos serviços prestados.

---

## 23.2 Indicadores Alimentados

### Satisfação do Cliente

### Tempestividade

### Aderência Metodológica

### Valor Agregado

### Efetividade Percebida

---

# 24. WORKFLOW GERAL

```text
Solicitação
 ↓
Triagem
 ↓
Análise de Independência
 ↓
Planejamento
 ↓
Execução
 ↓
Produto Entregue
 ↓
Pesquisa de Satisfação
 ↓
Encerramento
```

---

# 25. REGRAS DE NEGÓCIO

## RN-CON-003

Toda consultoria deverá possuir solicitação formal registrada.

---

## RN-CON-004

Toda consultoria deverá passar por análise de independência.

---

## RN-CON-005

Toda consultoria deverá possuir responsável técnico.

---

## RN-CON-006

Toda consultoria deverá possuir produto final registrado.

---

## RN-CON-007

Não será permitido encerrar consultoria sem registro das atividades executadas.

---

## RN-CON-008

A participação em projetos deverá possuir declaração formal de ausência de cogestão.

---

## RN-CON-009

Toda orientação técnica emitida deverá possuir fundamentação registrada.

---

## RN-CON-010

Toda manifestação técnica deverá possuir histórico de versões.

---

## RN-CON-011

A pesquisa de satisfação deverá ser enviada automaticamente após o encerramento.

---

## RN-CON-012

Consultorias classificadas como estratégicas deverão ser reportadas automaticamente no Relatório Anual de Atividades.

---

# 26. CRITÉRIOS DE ACEITAÇÃO

O módulo será considerado aceito quando:

1. Permitir gestão completa das solicitações de consultoria.
2. Implementar análise obrigatória de independência.
3. Controlar consultorias, assessoramentos e avaliações específicas.
4. Permitir emissão de pareceres, notas técnicas e orientações.
5. Controlar participação em projetos e comitês.
6. Registrar benefícios gerados.
7. Aplicar pesquisa de satisfação automatizada.
8. Integrar-se ao planejamento anual da AUDIN.
9. Alimentar automaticamente os indicadores do PQAUD.
10. Garantir rastreabilidade integral das atividades consultivas.
11. Preservar a independência e objetividade da Auditoria Interna.
12. Atender às Normas Globais de Auditoria Interna do IIA, à Resolução CNJ nº 309/2020 e aos normativos institucionais da AUDIN.

---

## Dependências para os Próximos Volumes

As informações produzidas neste módulo serão consumidas diretamente por:

* **Volume VIII – Programa de Qualidade da Auditoria Interna (PQAUD)**
* **Volume X – Gestão de Competências e PAC-Aud**
* **Volume XIV – Relatório Anual de Atividades (RAA)**
* **Volume XV – Business Intelligence e Analytics**

e constituem a base para mensuração do valor agregado dos serviços de consultoria prestados pela Auditoria Interna.
