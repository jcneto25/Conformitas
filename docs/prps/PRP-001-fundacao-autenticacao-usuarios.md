# PRP-001 — Fundação: Banco, Autenticação e Gestão de Usuários

> **ID:** PRP-001 | **Onda:** 1 | **Estimativa:** 8 dias | **Status:** ⏳ Pending
> **Prioridade:** Crítico | **Complexidade:** Alta | **Módulo:** MOD-ADM-001
> **Criado em:** 2026-06-16 | **Versão:** 1.0

---

## 1. Contexto e Objetivo

A AUDIN/TJCE precisa de uma plataforma segura onde apenas usuários autorizados acessem dados sensíveis de auditoria. Este PRP entrega a fundação de autenticação e gestão de usuários: banco de dados inicial, cadastro de usuários com dados funcionais (matrícula, cargo, unidade), login com senha e MFA via TOTP, e proteção de acesso a todos os endpoints.

- [ ] Projeto inicializado com stack definido, banco de dados configurado
- [ ] Login com senha e MFA (TOTP) para perfis críticos
- [ ] Cadastro, edição, inativação e bloqueio de usuários
- [ ] Sessões JWT com refresh token e timeout de 30 min
- [ ] Bloqueio após 5 tentativas de login com falha

❌ NÃO inclui: perfis e permissões RBAC → PRP-002, logs de auditoria → PRP-002, gestão de mandatos → PRP-002.

---

## 2. Requisitos Funcionais

| ID | Requisito | Critérios de Aceitação (Gherkin) | Prioridade |
|----|-----------|----------------------------------|------------|
| RF-001.1 | Login com senha | **Dado** que um usuário está cadastrado e ativo, **Quando** informa email e senha corretos, **Então** recebe access token JWT e refresh token | Must |
| RF-001.2 | Login com MFA | **Dado** que o usuário tem MFA habilitado e perfil P01/P02/P10, **Quando** autentica com senha correta, **Então** é redirecionado para tela de verificação TOTP | Must |
| RF-001.3 | Bloqueio por tentativas | **Dado** que um usuário erra a senha 5 vezes consecutivas, **Quando** tenta o 6º login, **Então** a conta é bloqueada e exibe "Conta bloqueada. Contate o administrador." | Must |
| RF-001.4 | Timeout de sessão | **Dado** que o usuário está autenticado, **Quando** fica inativo por 30 minutos, **Então** a sessão expira e é redirecionado ao login | Must |
| RF-001.5 | CRUD de usuários | **Dado** que um Administrador (P10) está autenticado, **Quando** cadastra/edita/inativa um usuário com dados funcionais, **Então** os dados são persistidos e o usuário recebe acesso (se ativo) | Must |
| RF-001.6 | Refresh token | **Dado** que o access token expirou, **Quando** o cliente envia o refresh token, **Então** recebe novo access token sem precisar de login | Should |
| RF-001.7 | Política de senhas | **Dado** que um usuário define/alterar senha, **Quando** a senha não atende 8+ caracteres com maiúscula, minúscula, número e símbolo, **Então** exibe erro de complexidade | Must |

---

## 3. Requisitos Não Funcionais

| ID | Requisito | Métrica | Como verificar |
|----|-----------|---------|----------------|
| RNF-001.1 | Performance — Login | p95 < 500ms | k6 load test |
| RNF-001.2 | Segurança — Senhas | bcrypt com cost ≥ 12 | Code review |
| RNF-001.3 | Segurança — Criptografia | TLS 1.3, AES-256 em repouso | Security scan |

---

## 4. Dependências

### Bloqueado por: Nenhum (é o PRP fundacional)

### Desbloqueia: PRP-002, PRP-003, PRP-004, PRP-005, PRP-006, PRP-007, PRP-008, PRP-009, PRP-010, PRP-011, PRP-012, PRP-013, PRP-014

---

## 5. API Contracts

### POST /api/v1/auth/login
**Autenticação:** Pública
```json
// Request
{ "email": "string", "senha": "string" }
// Response 200
{ "access_token": "jwt", "refresh_token": "jwt", "expires_in": 1800, "mfa_required": false }
// Response 200 (MFA required)
{ "mfa_required": true, "session_token": "string" }
```

### POST /api/v1/auth/mfa/verify
**Autenticação:** Session token
```json
// Request
{ "session_token": "string", "totp_code": "string" }
// Response 200
{ "access_token": "jwt", "refresh_token": "jwt", "expires_in": 1800 }
```

### POST /api/v1/auth/refresh
**Autenticação:** Refresh token
```json
// Request
{ "refresh_token": "jwt" }
// Response 200
{ "access_token": "jwt", "expires_in": 1800 }
```

### GET/POST/PUT /api/v1/usuarios
**Autenticação:** JWT | **Role:** P10
**Rate Limit:** 30 req/min

---

## 6. Database Changes

| Operação | Tabela | Campos | Índice | Sensível |
|----------|--------|--------|--------|----------|
| CREATE | `usuarios` | id (UUID PK), nome, email, matrícula, cargo, unidade, senha_hash, mfa_enabled, mfa_secret, ativo, data_desativacao, tentativas_login, bloqueado_ate, created_at, updated_at | idx_email (unique), idx_ativo | Sim — senha_hash, mfa_secret |
| CREATE | `refresh_tokens` | id, usuario_id (FK), token_hash, expires_at, revoked | idx_usuario, idx_token | Sim |

---

## 7. Test Strategy

| # | Descrição | Tipo | Arquivo |
|---|-----------|------|---------|
| 1 | Login com credenciais válidas retorna token | Integração | auth.e2e-spec.ts |
| 2 | Login com credenciais inválidas retorna 401 | Integração | auth.e2e-spec.ts |
| 3 | Bloqueio após 5 tentativas | Integração | auth.e2e-spec.ts |
| 4 | MFA com código inválido retorna 401 | Integração | auth.e2e-spec.ts |
| 5 | CRUD usuários — P10 cria/edita/inativa | Integração | usuarios.e2e-spec.ts |
| 6 | CRUD usuários — P02 não autorizado | Unitário | usuarios.guard.spec.ts |
| 7 | Refresh token expirado retorna 401 | Integração | auth.e2e-spec.ts |
| 8 | Fluxo completo login + acesso + expiração | E2E | auth-flow.spec.ts |

Cobertura alvo: ≥ 80% unitários, ≥ 70% integração.

---

## 8. Riscos e Mitigações

| Risco | Prob. | Impacto | Mitigação |
|-------|-------|---------|-----------|
| Vazamento de senha_hash | Baixa | Crítico | bcrypt cost 12+, nunca logar hash |
| Ataque de força bruta | Média | Alto | Rate limit no login + bloqueio após 5 tentativas |
| Token JWT vazado | Baixa | Alto | Expiração curta (30 min), refresh token rotativo |

---

## 9. Definition of Done

- [ ] Todos os RFs implementados e testados
- [ ] Cobertura de testes ≥ 80% unitários, ≥ 70% integração
- [ ] bcrypt cost 12+ verificado
- [ ] Migration up/down testada
- [ ] Endpoints documentados em OpenAPI
- [ ] Security scan limpo (sem vulnerabilidades críticas)
- [ ] PR revisado e aprovado
