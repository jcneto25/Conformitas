# GAP Analysis — Clean Code (pós-Waves 1-3)

## ✅ Corrigidos

| Item | Status |
|------|--------|
| `NotFoundException('')` vazios | 0 ocorrências |
| `BadRequestException('')` vazios | 0 ocorrências |
| Stubs não implementados (setupMfa, changePassword) | 0 — implementados |
| Magic numbers `30m`/`8h` em auth | 0 — movidos para app.config.ts |
| Schedule usando service direto | 0 — todos usam use cases |
| `console.log` | 0 ocorrências |
| `async forEach` | 0 ocorrências |

## ❌ Pendências

| # | DoD Original | Descrição | Severidade | Esforço |
|---|-------------|-----------|-----------|---------|
| 1 | **DoD-4** | **ReadModel types para 24 módulos** — só 7/31 interfaces têm ReadModel | 🟡 Alto | Grande |
| 2 | **DoD-8a** | **snake_case em DTOs de auth** — `senha_atual`, `session_token`, `totp_code` | 🟢 Médio | Pequeno |
| 3 | **DoD-8b** | **Constantes em service em vez de domain** — `PRAZO_MANIFESTACAO_DIAS_UTEIS` | 🟢 Médio | Mínimo |
| 4 | — | **2 `as any` no global-exception.filter** — uso legítimo (erro HTTP genérico) | 🟢 Aceito | 0 |

## Detalhamento

### 1. ReadModels (DoD-4)
**24 interfaces de repositório sem ReadModel** — retornam `any`. Apenas 7 têm:
- `capacitacao`, `competencia`, `risco`, `universo`, `notificacao` (Onda 6)
- `auditoria`, `achado` (Onda 5)

**Módulos sem tipagem**: auth, usuarios, perfis, consultorias, integracoes, etica, governanca, qualidade, planos, relatorios, recomendacoes, dashboards, auth, logs, biblioteca, config, mandatos, acoes-coordenadas, mais entidades secundárias.

### 2. snake_case DTOs (DoD-8a)
`api/src/auth/dto/change-password.dto.ts`: `senha_atual`, `nova_senha`  
`api/src/auth/dto/mfa-verify.dto.ts`: `session_token`, `totp_code`

### 3. Constantes no service (DoD-8b)
`src/achados/achados.service.ts:15`: `export const PRAZO_MANIFESTACAO_DIAS_UTEIS = 5;`

Deveria estar em `src/achados/domain/constants.ts`.
