# PRP-002 — Perfis, RBAC, Mandatos e Configurações

> **ID:** PRP-002 | **Onda:** 1 | **Estimativa:** 5 dias | **Status:** ⏳ Pending
> **Prioridade:** Crítico | **Complexidade:** Média | **Módulo:** MOD-ADM-001
> **Criado em:** 2026-06-16 | **Versão:** 1.0 | **Depende de:** PRP-001

---

## 1. Contexto e Objetivo

A plataforma precisa diferenciar o que cada perfil pode ver e fazer. Este PRP implementa o controle de acesso RBAC completo com 10 perfis, segregação de funções, gestão de mandatos do Auditor-Chefe, configurações parametrizáveis do sistema e logs de auditoria de segurança.

- [ ] 10 perfis (P01-P10) com permissões granulares por recurso × ação
- [ ] Atribuição de perfis a usuários com escopo de unidade
- [ ] Segregação: P01 não acumula + P10 não tem acesso a dados + P02 ≠ P05 mesma unidade
- [ ] Gestão de mandatos do Auditor-Chefe (2 anos, máx. 6)
- [ ] Configurações do sistema (7 parâmetros padrão)
- [ ] Logs de auditoria do sistema (eventos de segurança)

❌ NÃO inclui: notificações por email → PRP futuro.

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-002.1 | 10 perfis com permissões | **Dado** que existem 10 perfis predefinidos, **Quando** o sistema carrega o middleware de autorização, **Então** cada endpoint verifica permissão do perfil do usuário | Must |
| RF-002.2 | Atribuir perfil com escopo | **Dado** que P10 acessa gestão de perfis, **Quando** atribui P05 a um usuário com escopo "Secretaria X", **Então** o usuário acessa apenas dados da Secretaria X | Must |
| RF-002.3 | Segregação P01 | **Dado** que um usuário já tem perfil P01, **Quando** P10 tenta atribuir qualquer outro perfil, **Então** sistema bloqueia com erro de segregação | Must |
| RF-002.4 | Segregação P10 | **Dado** que um usuário tem perfil P10, **Quando** tenta acessar qualquer endpoint de dados de auditoria, **Então** recebe 403 Forbidden | Must |
| RF-002.5 | Mandato Auditor-Chefe | **Dado** que existe um Auditor-Chefe com 2 mandatos (4 anos), **Quando** P10 tenta criar 3º mandato consecutivo, **Então** sistema bloqueia (máx. 6 anos) | Must |
| RF-002.6 | Configurações do sistema | **Dado** que P10 acessa configurações, **Quando** altera "prazo_manifestacao_dias_uteis" de 5 para 7, **Então** o novo prazo é aplicado a novos achados | Should |
| RF-002.7 | Logs de segurança | **Dado** que qualquer usuário faz login/logout ou tem acesso negado, **Quando** o evento ocorre, **Então** é registrado em log imutável com user_id, IP, timestamp | Must |

---

## 3. API Contracts

### POST /api/v1/usuarios/{id}/perfis
**Role:** P10 | **Rate Limit:** 30 req/min
```json
// Request
{ "perfil_id": "uuid", "unidade_escopo": "string|null", "data_fim": "date|null" }
// Response 201
{ "id": "uuid", "usuario_id": "uuid", "perfil_id": "uuid", "unidade_escopo": "string", "ativo": true }
// Response 409 (segregação)
{ "error": "SOD_VIOLATION", "message": "Usuário P01 não pode acumular outros perfis" }
```

### GET /api/v1/mandatos
**Role:** P01, P03, P04, P10

### POST /api/v1/configuracoes/{chave}
**Role:** P10

### GET /api/v1/logs-sistema
**Role:** P01, P10 | Params: `?usuario_id=&acao=&data_inicio=&data_fim=`

---

## 4. Database Changes

| Operação | Tabela | Campos | Índice | Sensível |
|----------|--------|--------|--------|----------|
| CREATE | `perfis` | id, codigo (P01-P10), nome, descricao, permissoes (JSONB), nivel_acesso | idx_codigo (unique) | Não |
| CREATE | `usuarios_perfis` | id, usuario_id (FK), perfil_id (FK), unidade_escopo, data_inicio, data_fim, ativo | idx_usuario, idx_perfil | Não | **Fallback `data_fim = null`:** Perfil vitalício / sem data de expiração (ex: P02, P10). Preenchido apenas para mandatos temporários (ex: P01, P07). |
| CREATE | `mandatos_auditor_chefe` | id, usuario_id (FK), numero_mandato, data_inicio, data_fim_prevista, data_fim_real, ato_designacao, status | — | Não |
| CREATE | `logs_sistema` | id, usuario_id (FK nullable), acao, entidade_tipo, entidade_id, detalhes (JSONB), ip, user_agent, created_at | idx_usuario, idx_acao, idx_created | Não |
| CREATE | `configuracoes_sistema` | chave (PK), valor, descricao, editavel | — | Não |

Seed inicial: 10 perfis + 7 configurações padrão (prazo_manifestacao=5, meta_horas_capacitacao=40, periodo_palp=4, etc.)

---

## 5. Test Strategy

| # | Descrição | Tipo |
|---|-----------|------|
| 1 | P01 não consegue acessar endpoint exclusivo P10 | Unitário (guard) |
| 2 | P05 com escopo "Unidade A" não vê dados da "Unidade B" | Integração |
| 3 | Atribuir perfil conflitante lança SOD_VIOLATION | Integração |
| 4 | Criar 3º mandato consecutivo é bloqueado | Integração |
| 5 | Alterar configuração e verificar efeito em novo achado | Integração |
| 6 | Login/logout geram entradas em logs_sistema | Integração |

---

## 6. Definition of Done

- [ ] 10 perfis com matriz de permissões completa
- [ ] Middleware RBAC funcional em todos os endpoints
- [ ] Segregação de funções validada em runtime
- [ ] Gestão de mandatos com regras da CNJ 308 art. 6º
- [ ] Logs de segurança registrando e consultáveis
- [ ] Configurações parametrizáveis sem alteração de código
- [ ] Cobertura ≥ 80% unitários, ≥ 70% integração
- [ ] PR revisado e aprovado
