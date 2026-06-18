# ESPECIFICAÇÃO TÉCNICO-FUNCIONAL

# SISTEMA AUTOMATIZADO DE GESTÃO DE AUDITORIAS INTERNAS E CONTROLE INTERNO

## VOLUME II – PERFIS, SEGURANÇA E ADMINISTRAÇÃO

### Versão 3.0

---

# 1. OBJETIVO DO VOLUME

Este volume define os requisitos funcionais, regras de negócio, perfis de acesso, mecanismos de autenticação, autorização, rastreabilidade, auditoria, governança de usuários e administração da plataforma.

O objetivo é garantir que o sistema possua mecanismos robustos de segurança, segregação de funções, independência da atividade de auditoria, rastreabilidade completa e conformidade com:

* Resolução CNJ nº 309/2020;
* Resolução TJCE nº 23/2023;
* LGPD;
* ISO 27001;
* Boas práticas OWASP;
* IPPF;
* IA-CM.

---

# 2. ARQUITETURA DE CONTROLE DE ACESSO

## 2.1 Modelo de Segurança

O sistema deverá utilizar:

### RBAC

Role Based Access Control

Permissões concedidas através de perfis.

### ABAC

Attribute Based Access Control

Restrições complementares baseadas em:

* unidade organizacional;
* papel no processo;
* classificação da informação;
* sigilo;
* participação na auditoria.

---

## 2.2 Princípios Obrigatórios

### Menor Privilégio

Usuário receberá apenas as permissões necessárias.

### Segregação de Funções

O sistema deverá impedir conflitos operacionais.

Exemplos:

* Auditor não aprova a própria auditoria.
* Autor não aprova o próprio relatório.
* Avaliador PQAUD não avalia seu próprio trabalho.

### Necessidade de Conhecimento

Informações serão disponibilizadas apenas aos usuários autorizados.

### Rastreabilidade

Toda operação deverá gerar registro auditável.

---

# 3. ESTRUTURA ORGANIZACIONAL

## 3.1 Unidade Organizacional

Representa a estrutura administrativa do Tribunal.

### Campos

| Campo  | Tipo  |
| ------ | ----- |
| Id     | UUID  |
| Código | Texto |
| Nome   | Texto |
| Sigla  | Texto |
| Tipo   | Enum  |
| Status | Enum  |

---

## 3.2 Tipos de Unidade

* Presidência
* Corregedoria
* Secretaria
* Coordenadoria
* Diretoria
* AUDIN
* Comitê
* Comissão
* Unidade Auditada

---

## 3.3 Hierarquia Organizacional

O sistema deverá suportar:

```text
Tribunal
 ├── Presidência
 ├── Corregedoria
 ├── Secretarias
 ├── AUDIN
 └── Demais Unidades
```

---

# 4. GESTÃO DE USUÁRIOS

## 4.1 Cadastro de Usuário

### Dados Básicos

| Campo                | Obrigatório |
| -------------------- | ----------- |
| Nome                 | Sim         |
| Matrícula            | Sim         |
| CPF                  | Sim         |
| E-mail Institucional | Sim         |
| Unidade              | Sim         |
| Cargo                | Sim         |
| Status               | Sim         |

---

## 4.2 Situações

* Ativo
* Inativo
* Bloqueado
* Afastado
* Excluído

---

## 4.3 Origem do Cadastro

### Manual

Administrador

### Automática

Integração LDAP/AD

---

# 5. PERFIS FUNCIONAIS

## 5.1 Administrador do Sistema

Responsável pela administração técnica.

### Permissões

* Gerenciar usuários
* Gerenciar perfis
* Parametrizações
* Integrações
* Logs

### Restrições

Não participa de auditorias.

---

## 5.2 Secretário de Auditoria

Responsável pela gestão administrativa da AUDIN.

### Permissões

* Cadastrar auditorias
* Controlar agendas
* Gerenciar documentos
* Gerenciar publicações

---

## 5.3 Auditor

Responsável pela execução dos trabalhos.

### Permissões

* Elaborar papéis de trabalho
* Inserir evidências
* Registrar entrevistas
* Registrar achados
* Elaborar relatórios

### Restrições

Não pode aprovar seus próprios trabalhos.

---

## 5.4 Auditor Líder

Responsável pela coordenação de uma auditoria.

### Permissões adicionais

* Planejamento
* Distribuição de atividades
* Encerramento técnico

---

## 5.5 Supervisor

Responsável pela revisão técnica.

### Permissões

* Revisar papéis de trabalho
* Aprovar evidências
* Aprovar achados
* Aprovar programas

---

## 5.6 Coordenador

Responsável pela gestão da equipe.

### Permissões

* Aprovar auditorias
* Aprovar planos
* Aprovar monitoramentos

---

## 5.7 Secretário de Auditoria Interna

Perfil gerencial máximo da AUDIN.

### Permissões

* Aprovação final
* Publicação
* Assinaturas institucionais
* Declarações de conformidade

---

## 5.8 Presidência

### Permissões

* Consulta executiva
* Aprovação do PALP
* Aprovação do PAA
* Consulta de relatórios

---

## 5.9 Unidade Auditada

### Permissões

* Receber solicitações
* Encaminhar documentos
* Manifestar-se
* Acompanhar recomendações

---

## 5.10 Avaliador Externo

### Permissões

* Avaliação PQAUD
* Avaliação IA-CM

---

## 5.11 Comitê de Riscos

### Permissões

* Avaliar riscos
* Deliberar planos de tratamento

---

# 6. GESTÃO DE PERFIS

## 6.1 Estrutura

Perfil composto por:

```text
Perfil
 ↓
Módulos
 ↓
Funcionalidades
 ↓
Permissões
```

---

## 6.2 Tipos de Permissão

### Consulta

Visualizar

### Inclusão

Criar

### Alteração

Editar

### Exclusão

Excluir

### Aprovação

Aprovar

### Publicação

Publicar

### Administração

Administrar

---

# 7. DELEGAÇÕES E SUBSTITUIÇÕES

## 7.1 Delegação Temporária

Permite transferência controlada de atribuições.

### Campos

* Delegante
* Delegado
* Início
* Fim
* Motivo

---

## 7.2 Substituição Formal

Utilizada em:

* Férias
* Licenças
* Afastamentos

---

## 7.3 Regras

RN-ADM-001

Nenhuma delegação poderá exceder 180 dias.

RN-ADM-002

Toda delegação deverá possuir justificativa.

RN-ADM-003

Toda delegação deverá ser auditável.

---

# 8. GRUPOS DE TRABALHO

## 8.1 Equipes de Auditoria

### Composição

* Líder
* Auditores
* Especialistas

---

## 8.2 Comitês

### Tipos

* Comitê de Riscos
* Comitê de Qualidade
* Comitê Gestor

---

# 9. AUTENTICAÇÃO

## 9.1 Métodos

### LDAP/AD

Método principal.

### SSO

Single Sign-On institucional.

### Login Local

Somente contingência.

---

## 9.2 MFA

Obrigatório para:

* Coordenadores
* Administradores
* Secretário de Auditoria

Opcional para demais usuários.

---

# 10. AUTORIZAÇÃO

## 10.1 Controle por Perfil

RBAC.

---

## 10.2 Controle por Unidade

ABAC.

---

## 10.3 Controle por Sigilo

ABAC.

---

## 10.4 Controle por Participação

Somente membros da auditoria poderão acessar documentos internos.

---

# 11. CLASSIFICAÇÃO DA INFORMAÇÃO

## 11.1 Níveis

### Público

Livre acesso.

### Restrito

Somente usuários autorizados.

### Confidencial

Controle especial.

### Sigiloso

Controle máximo.

---

## 11.2 Regras

RN-SEG-001

Documentos sigilosos não poderão ser compartilhados externamente.

RN-SEG-002

Toda visualização deverá ser registrada.

---

# 12. ASSINATURA ELETRÔNICA

## 12.1 Tipos

### Assinatura Simples

Fluxos internos.

### Assinatura Avançada

Documentos institucionais.

### Assinatura ICP-Brasil

Documentos oficiais.

---

## 12.2 Aplicações

* Relatórios
* PALP
* PAA
* RAA
* RMA
* Declarações

---

# 13. TRILHAS DE AUDITORIA

## 13.1 Objetivo

Garantir rastreabilidade completa.

---

## 13.2 Eventos Registrados

### Autenticação

* Login
* Logout
* Falhas

### Dados

* Inclusão
* Alteração
* Exclusão

### Fluxos

* Aprovação
* Publicação
* Encerramento

---

## 13.3 Campos do Log

| Campo         | Obrigatório |
| ------------- | ----------- |
| DataHora      | Sim         |
| Usuário       | Sim         |
| IP            | Sim         |
| Operação      | Sim         |
| Entidade      | Sim         |
| Identificador | Sim         |

---

# 14. VERSIONAMENTO

## 14.1 Objetivo

Garantir histórico integral.

---

## 14.2 Objetos Versionáveis

* PALP
* PAA
* Programa de Auditoria
* Papéis de Trabalho
* Relatórios
* Planos de Ação
* Avaliações PQAUD

---

## 14.3 Regras

RN-VERS-001

Nenhuma versão poderá ser removida.

RN-VERS-002

Toda alteração deverá gerar nova versão.

---

# 15. NOTIFICAÇÕES

## 15.1 Canais

* Sistema
* E-mail
* Integrações futuras

---

## 15.2 Eventos

* Aprovação pendente
* Prazo vencido
* Nova manifestação
* Novo documento
* Novo risco
* Nova avaliação

---

# 16. PARÂMETROS GERAIS

## 16.1 Calendário Institucional

* Feriados
* Recessos
* Pontos facultativos

---

## 16.2 Tipos Parametrizáveis

* Tipos de auditoria
* Tipos de consultoria
* Tipos de risco
* Tipos de evidência
* Tipos de achado

---

# 17. REGRAS GERAIS DE SEGURANÇA

## RN-SEG-001

Todo acesso deverá ser autenticado.

## RN-SEG-002

Toda operação deverá ser auditável.

## RN-SEG-003

Perfis deverão obedecer segregação de funções.

## RN-SEG-004

Documentos sigilosos deverão possuir controle de acesso granular.

## RN-SEG-005

Toda exclusão deverá ser lógica.

## RN-SEG-006

Logs não poderão ser alterados.

## RN-SEG-007

MFA obrigatório para perfis críticos.

## RN-SEG-008

Contas inativas por mais de 90 dias poderão ser bloqueadas automaticamente.

---

# 18. CRITÉRIOS DE ACEITAÇÃO DO VOLUME

O sistema deverá:

1. Suportar RBAC e ABAC simultaneamente.
2. Possuir segregação de funções configurável.
3. Possuir trilha completa de auditoria.
4. Permitir integração LDAP/AD.
5. Possuir MFA.
6. Implementar versionamento nativo.
7. Suportar classificação da informação.
8. Permitir delegações e substituições.
9. Garantir rastreabilidade integral.
10. Atender aos requisitos de governança, segurança e conformidade da Auditoria Interna.

---

**Próximo volume recomendado:** **Volume III – Planejamento Estratégico e Operacional**, detalhando PALP, PAA, universo auditável, QACI, matriz de priorização, capacidade operacional, cobertura do PALP e geração automática do plano anual.
