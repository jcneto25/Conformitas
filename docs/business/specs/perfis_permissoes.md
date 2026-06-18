# CONFORMITAS (SGI) — PERFIS E PERMISSÕES

**Versão:** 1.0 | **Data:** 16/06/2026 | **Responsável:** IA (Step 1)

---

## 1. INTRODUÇÃO

### 1.1 Objetivo do Documento
Este documento define os 10 perfis de acesso, a matriz de permissões e as regras de autorização do CONFORMITAS, servindo como referência para implementação do backend de autorização, configuração de middlewares, testes de segurança e auditoria de acessos.

### 1.2 Modelo de Controle de Acesso
O sistema adota o modelo **RBAC híbrido com restrições ABAC**, onde permissões são agrupadas em perfis atribuídos a usuários, com controles adicionais baseados em atributos de escopo (unidade) e classificação de sigilo.

---

## 2. CATÁLOGO DE PERFIS

### 2.1 Resumo dos Perfis

| ID | Perfil | Descrição | Escopo | Base Normativa |
|----|--------|-----------|--------|----------------|
| P01 | Auditor-Chefe | Titular da AUDIN. Supervisiona todas as atividades, aprova planos e relatórios, gere qualidade | Global (AUDIN) | CNJ 308 art. 4-6; CNJ 309 art. 27-28 |
| P02 | Auditor | Servidor em exercício na AUDIN. Executa auditorias, registra evidências, achados e papéis de trabalho | Auditorias designadas | CNJ 309 art. 29, 47 |
| P03 | Presidente | Presidente do TJCE. Aprova PAA/PALP, recebe comunicações de obstrução e fraudes | Leitura estratégica + aprovações | CNJ 308 art. 4º, II |
| P04 | Órgão Colegiado | Órgão colegiado competente. Recebe e delibera sobre relatório anual da AUDIN | Leitura do relatório anual | CNJ 308 art. 4º, I; art. 5º |
| P05 | Gestor Unidade Auditada | Gestor da 1ª linha. Recebe comunicados, manifesta-se sobre achados, implementa recomendações | Sua unidade | CNJ 309 art. 46 §5º, 53-54 |
| P06 | Gestor 2ª Linha | Secretaria-Geral / Núcleo Controle Interno. Monitora implementação de recomendações, supervisiona conformidade | Visão consolidada | Lei 18.561 art. 10-13 |
| P07 | Avaliador Externo | Avaliador independente ou de outra AUDIN. Conduz avaliações externas do PQAUD | Temporário, escopo definido | CNJ 309 art. 67 |
| P08 | Comitê SIAUD-Jud | Membro do Comitê de Governança e Coordenação. Propõe ações coordenadas e diretrizes | Leitura de indicadores | CNJ 308 art. 15-18 |
| P09 | CPA | Conselheiro da Comissão Permanente de Auditoria do CNJ. Aprova Ações Coordenadas | Leitura de ações coordenadas | CNJ 308 art. 13-14 |
| P10 | Administrador do Sistema | Gestão técnica da plataforma. Gerencia usuários, perfis, configurações e logs | Acesso técnico (sem dados de auditoria) | — |

### 2.2 Detalhamento por Perfil

#### P01 — Auditor-Chefe
- **Função institucional:** Titular da unidade de auditoria interna, mandato de 2 anos (máx. 6)
- **Responsabilidades:** Aprovar PAA/PALP, supervisionar auditorias, homologar relatórios, gerir qualidade (PQAUD), autorizar consultorias
- **Restrições:** Não audita operações com envolvimento nos últimos 12 meses. Não acumula outros perfis
- **Nível de criticidade:** Crítico

#### P02 — Auditor
- **Função institucional:** Servidor efetivo/comissionado em exercício na AUDIN
- **Responsabilidades:** Executar auditorias, coletar evidências, registrar achados e papéis de trabalho, elaborar relatórios preliminares
- **Restrições:** Acesso apenas às auditorias designadas. Não aprova relatórios finais nem submete planos
- **Nível de criticidade:** Alto

#### P03 — Presidente
- **Função institucional:** Presidente do TJCE — reporte administrativo da AUDIN
- **Responsabilidades:** Aprovar PAA/PALP, receber comunicações de obstrução grave e fraudes, autorizar auditorias sigilosas
- **Restrições:** Acesso somente leitura. Não edita nem executa atividades operacionais
- **Nível de criticidade:** Médio

#### P04 — Órgão Colegiado
- **Função institucional:** Órgão colegiado competente do TJCE — reporte funcional da AUDIN
- **Responsabilidades:** Receber e deliberar sobre Relatório Anual de Atividades
- **Restrições:** Acesso apenas ao Relatório Anual e documentos de governança
- **Nível de criticidade:** Baixo

#### P05 — Gestor de Unidade Auditada
- **Função institucional:** Responsável por unidade da 1ª Linha de Defesa
- **Responsabilidades:** Receber comunicados, responder requisições, manifestar-se sobre achados, implementar recomendações
- **Restrições:** Escopo limitado à sua unidade. Não acessa dados de outras unidades nem dados internos da AUDIN
- **Nível de criticidade:** Médio

#### P06 — Gestor de 2ª Linha
- **Função institucional:** Secretaria-Geral Administrativa / Núcleo de Controle Interno da Gestão
- **Responsabilidades:** Monitorar implementação de recomendações, supervisionar conformidade de controles internos
- **Restrições:** Visão consolidada de recomendações. Não acessa evidências nem papéis de trabalho detalhados
- **Nível de criticidade:** Médio

#### P07 — Avaliador Externo
- **Função institucional:** Profissional independente ou de outra AUDIN para avaliação externa do PQAUD
- **Responsabilidades:** Conduzir avaliações de qualidade conforme CNJ 309 art. 67
- **Restrições:** Acesso temporário (prazo definido), somente leitura, escopo restrito à avaliação contratada
- **Nível de criticidade:** Médio

#### P08 — Comitê SIAUD-Jud
- **Função institucional:** Membro do Comitê de Governança e Coordenação do SIAUD-Jud
- **Responsabilidades:** Propor ações coordenadas, avaliar indicadores nacionais, emitir notas técnicas
- **Restrições:** Leitura de indicadores e relatórios consolidados. Não acessa dados operacionais individuais
- **Nível de criticidade:** Baixo

#### P09 — CPA
- **Função institucional:** Conselheiro do CNJ, membro da Comissão Permanente de Auditoria
- **Responsabilidades:** Aprovar Ações Coordenadas, emitir recomendações e determinações
- **Restrições:** Leitura apenas de relatórios de ações coordenadas
- **Nível de criticidade:** Baixo

#### P10 — Administrador do Sistema
- **Função institucional:** Responsável técnico pela plataforma (TI do TJCE)
- **Responsabilidades:** Gerenciar usuários, perfis, configurações, logs de sistema
- **Restrições:** NÃO acessa dados de auditoria, evidências, achados ou relatórios da AUDIN
- **Perfis incompatíveis:** P01, P02, P05 (qualquer perfil de negócio)
- **Nível de criticidade:** Crítico

---

## 3. MATRIZ DE PERMISSÕES

Legenda: **C** = Criar, **R** = Ler, **U** = Atualizar, **D** = Excluir/Inativar, **E** = Executar ação especial, **P** = Parcial (escopo), **X** = Sem acesso

| Módulo / Funcionalidade | P01 | P02 | P03 | P04 | P05 | P06 | P07 | P08 | P09 | P10 |
|--------------------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| **ADMINISTRAÇÃO** |||||||||||
| Gerenciar usuários | X | X | X | X | X | X | X | X | X | CRUD |
| Atribuir/remover perfis | X | X | X | X | X | X | X | X | X | CRUD |
| Visualizar logs do sistema | R | X | X | X | X | X | X | X | X | R |
| Configurar parâmetros | X | X | X | X | X | X | X | X | X | CRUD |
| Gerenciar mandatos | R | X | R | R | X | X | X | X | X | CRUD |
| **PLANEJAMENTO** |||||||||||
| Universo auditável | CRUD | R | X | X | X | X | X | X | X | X |
| PALP/PAA — criar/editar | CRUD | R | X | X | X | X | X | X | X | X |
| PAA — submeter | E | X | X | X | X | X | X | X | X | X |
| PAA — aprovar | X | X | E | X | X | X | X | X | X | X |
| Matriz de priorização | CRUD | R | X | X | X | X | X | X | X | X |
| Força de trabalho | CRUD | R | X | X | X | X | X | X | X | X |
| **EXECUÇÃO** |||||||||||
| Auditorias — abrir | E | X | X | X | X | X | X | X | X | X |
| Auditorias — executar | R | CRUD | X | X | X | X | X | X | X | X |
| Evidências — upload | R | CRUD | X | X | X | X | X | X | X | X |
| Papéis de trabalho | R | CRUD | X | X | X | X | X | X | X | X |
| Requisições à unidade | R | CRUD | X | X | R | R | X | X | X | X |
| **ACHADOS** |||||||||||
| Achados — registrar/editar | R | CRUD | X | X | X | X | X | X | X | X |
| Manifestações | R | R | X | X | CRUD | X | X | X | X | X |
| Quadro de achados | R | R | X | X | P | P | R | X | X | X |
| **RELATÓRIOS** |||||||||||
| Relatório Preliminar | E | CRUD | X | X | R | R | R | X | X | X |
| Relatório Final | E | CRU | X | X | R | R | R | X | X | X |
| Recomendações — emitir | E | X | X | X | X | X | X | X | X | X |
| Recomendações — responder | X | X | X | X | CRU | X | X | X | X | X |
| Relatório Anual | CRUD | R | R | R | X | X | X | R | R | X |
| Monitoramento | R | R | R | X | P | R | X | X | X | X |
| **CONSULTORIAS** |||||||||||
| Solicitar consultoria | X | X | X | X | C | X | X | X | X | X |
| Analisar/aceitar | E | X | X | X | X | X | X | X | X | X |
| Registrar consultoria | CRUD | R | X | X | X | X | R | X | X | X |
| **QUALIDADE (PQAUD)** |||||||||||
| Avaliações qualidade | CRUD | R | X | X | X | X | R | X | X | X |
| Não conformidades | CRUD | R | X | X | X | X | R | X | X | X |
| Indicadores qualidade | R | R | X | X | X | X | R | R | R | X |
| **GESTÃO DE RISCOS** |||||||||||
| Riscos AUDIN | CRUD | R | X | X | X | X | X | X | X | X |
| Matriz de riscos | R | R | X | X | X | X | X | X | X | X |
| **CAPACITAÇÃO (PAC-Aud)** |||||||||||
| Competências | CRUD | R | X | X | X | X | X | X | X | X |
| Capacitações | CRUD | R | X | X | X | X | X | X | X | X |
| **ÉTICA** |||||||||||
| Declaração independência | E | CRU | X | X | X | X | X | X | X | X |
| Impedimentos | R | CRU | X | X | X | X | X | X | X | X |
| **GOVERNANÇA** |||||||||||
| Publicação de relatórios | E | X | X | X | X | X | X | X | X | X |
| Determinações TCE/CNJ | CRUD | R | R | X | X | X | X | R | R | X |
| Registro de fraudes | CRUD | R | R | X | X | X | X | X | X | X |
| **BIBLIOTECA** |||||||||||
| Documentos metodológicos | CRUD | R | R | X | X | X | X | X | X | X |
| **SIGILO** |||||||||||
| Classificar documentos | CRUD | R | X | X | X | X | X | X | X | X |
| Trilha de acesso sigiloso | R | X | X | X | X | X | X | X | X | R |
| **DASHBOARDS** |||||||||||
| Dashboards operacionais | R | R | X | X | X | X | X | X | X | X |
| Dashboards estratégicos | R | R | R | R | X | R | R | R | R | X |
| Exportação relatórios | E | E | E | E | X | X | X | X | X | X |
| **INTEGRAÇÕES** |||||||||||
| Catálogo integrações | R | X | X | X | X | X | X | X | X | CRUD |
| Ações coordenadas SIAUD | CRUD | R | X | X | X | X | X | R | R | X |
| Saúde integrações | R | X | X | X | X | X | X | X | X | R |

---

## 4. REGRAS DE AUTORIZAÇÃO (ABAC)

### 4.1 Atributos de Usuário
| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `unidade_id` | UUID | Unidade organizacional |
| `perfis` | Array | IDs de perfil atribuídos |
| `ativo` | Boolean | Status do usuário |

### 4.2 Atributos de Recurso
| Atributo | Tipo | Descrição |
|----------|------|-----------|
| `classificacao` | Enum | PUBLICO, INTERNO, RESTRITO, SIGILOSO |
| `unidade_id` | UUID | Unidade proprietária |
| `criado_por` | UUID | Criador do recurso |

### 4.3 Políticas ABAC

**Política ABAC-001:** Escopo de Unidade para Gestor
- **Condição:** `usuario.unidade_id == recurso.unidade_id` para P05 e P06
- **Efeito:** Permitir leitura apenas de recursos da própria unidade

**Política ABAC-002:** Controle de Sigilo
- **Condição:** `recurso.classificacao == SIGILOSO AND usuario.perfis NOT contains P01`
- **Efeito:** Bloquear acesso a documentos sigilosos para todos exceto Auditor-Chefe

**Política ABAC-003:** Acesso Temporário Externo
- **Condição:** `usuario.perfis contains P07 AND now() > usuario.data_fim`
- **Efeito:** Bloquear acesso se prazo expirado

---

## 5. SEGREGAÇÃO DE FUNÇÕES (SoD)

| ID | Conflito | Perfis Conflitantes | Risco | Mitigação |
|----|----------|---------------------|-------|-----------|
| SOD-01 | Criador não aprova | P02 × P01 (mesmo objeto) | Alto | Validação em runtime: usuário atual ≠ criador do objeto |
| SOD-02 | Auditor não gere unidade | P02 × P05 (mesma unidade) | Alto | Checagem na atribuição de perfil |
| SOD-03 | Admin sem acesso a dados | P10 × P01/P02/P05 | Crítico | Incompatibilidade total — P10 não acumula perfis de negócio |

### Regras de Incompatibilidade
- **RIN-01:** P01 não acumula nenhum outro perfil
- **RIN-02:** P02 não acumula P05 na mesma unidade
- **RIN-03:** P10 não acumula P01, P02, P05 (nenhum perfil com acesso a dados de auditoria)

---

## 6. AUDITORIA E RASTREABILIDADE

| Evento | Descrição | Dados | Retenção |
|--------|-----------|-------|----------|
| LOGIN | Autenticação | user_id, ip, timestamp, sucesso/falha | 12 meses |
| LOGOUT | Encerramento sessão | user_id, timestamp | 12 meses |
| PERM_CHANGE | Alteração de permissões | admin_id, target_user_id, antes/depois | 10 anos |
| ACCESS_DENIED | Acesso negado | user_id, recurso, ação, ip | 12 meses |
| SOD_VIOLATION | Violação segregação | user_id, perfis conflitantes | 10 anos |

---

## 7. REQUISITOS DE SEGURANÇA

- [x] Autenticação: JWT (access + refresh token)
- [x] MFA via TOTP para P01, P02, P10
- [x] Bloqueio após 5 tentativas de login com falha
- [x] Inatividade de sessão: timeout 30 minutos
- [x] Senha: 8+ caracteres, complexidade, expiração 90 dias, histórico 5
- [x] TLS 1.3 para todas as conexões
- [x] Dados sensíveis: AES-256 em repouso

---

## 8. CONTROLE DE VERSÃO

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 16/06/2026 | IA (Step 1) | Versão inicial — 10 perfis, matriz completa, 3 políticas ABAC, 3 regras SoD |
