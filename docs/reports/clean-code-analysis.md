# Relatório de Clean Code — CONFORMITAS 3.0 (API)

**Baseado em**: *Clean Code* (R. Martin), *Clean Architecture* (R. Martin), *Software Design & Architecture* (K. Stemmler), *Software Architect's Handbook* (J. Ingeno)
**Data**: 2026-07-08 | **Escopo**: `api/src/`

---

## Sumário

| Categoria | Total | 🔴 Crítico | 🟡 Alto | 🟢 Médio |
|-----------|-------|-----------|---------|---------|
| Functions (Ch3) | 6 | 2 | 3 | 1 |
| Nomes (Ch2) | 4 | 0 | 2 | 2 |
| Classes (Ch10) | 5 | 2 | 2 | 1 |
| Error Handling (Ch7) | 3 | 1 | 1 | 1 |
| Smells (Ch17) | 5 | 1 | 2 | 2 |
| **Total** | **25** | **6** | **11** | **8** |

---

## 🔴 Críticos (6)

### F1 — Service.create() com múltiplas responsabilidades (Ch3)

`api/src/auditorias/auditorias.service.ts:38-57` — O método `create()` faz 4 coisas: valida item do plano, gera número sequencial, cria auditoria + comunicado, emite evento.

```typescript
async create(dto: CreateAuditoriaDto, criadoPorId: string) {
    const itemPlano = await this.auditoriaRepo.findUnique(...);   // 1
    if (!itemPlano) throw ...;
    if (!['APROVADO', 'PUBLICADO'].includes(itemPlano.plano?.status)) ...
    const numero = await this.gerarNumeroSequencial();            // 2
    const auditoria = await this.auditoriaRepo.create({...});      // 3
    await this.gerarComunicado(auditoria.id, criadoPorId);
    this.eventEmitter.emit(...);                                   // 4
    return auditoria;
}
```

**Impacto**: Viola SRP e "Functions must do one thing". Difícil testar isoladamente.

### F2 — Classes com 5+ dependências (Ch10)

`api/src/auditorias/auditorias.service.ts:14-20` — Injeção de 5 repositórios + 1 event emitter. Mais de 5 responsabilidades → classe grande que viola SRP.

### F3 — AuthService.login() com flow complexo (Ch3)

`api/src/auth/auth.service.ts:18-49` — 30+ linhas, 3 branches + side effects. Deveria ser decomposto em `validarCredenciais()`, `atualizarTentativas()`, `verificarBloqueio()`, `gerarSessao()`.

### F4 — Métodos stub + bug (Ch17, G9 — Dead Code)

`api/src/auth/auth.service.ts:69-73` — `setupMfa()` e `changePassword()` só lançam exceção. Adicionalmente, buscam usuário pela senha em vez do ID:

```typescript
async setupMfa(usuarioId: string, senha: string) {
    const usuario = await this.repo.findUsuario(senha);  // bug
    throw new UnauthorizedException('Método não implementado');
}
```

### F5 — Tratamento assíncrono frágil em healthAll()

`api/src/integracoes/integracoes.service.ts:38-50` — Promise.allSettled sem fallback adequado.

### F6 — Valores mágicos (Ch17, G25)

`30m` e `8h` hardcoded para expiração de token em `auth.service.ts`. Deveriam ser constantes nomeadas.

---

## 🟡 Altos (11)

### H1 — Variáveis genéricas `data` e `dto` (Ch2)

5+ arquivos de use case usam `const data = await this.repo.findUnique(id)` sem revelar o tipo.
15+ métodos usam `dto` como nome de parâmetro — deveria especificar o propósito.

### H2 — 4+ parâmetros posicionais (Ch3)

```typescript
async execute(achadoId: string, dto: CreateManifestacaoDto, autorId: string, unidadeEscopo?: string | null)
async notificarGestoresUnidade(unidade: string | null, tipo: string, mensagem: string, auditoriaId?: string)
```

### H3 — 7 services com 80+ linhas (Ch10)

| Arquivo | Linhas |
|---------|--------|
| `auditorias.service.ts` | 171 |
| `achados.service.ts` | 141 |
| `planos.service.ts` | 130 |
| `dashboards.service.ts` | 119 |
| `auth.service.ts` | 110 |

### H4 — 16/23 módulos sem ReadModel (Ch6)

Repositórios retornam `any` → perde tipagem do TypeScript.

### H5 — Cast `as any` (Ch6)

`api/src/auth/auth.service.ts:67`: `return this.generateTokens(usuario as any)` — desabilita verificação de tipos.

### H6 — Not found sem contexto (Ch7)

```typescript
if (!a) throw new NotFoundException('');  // sem contexto
```

### H7 — Array literal em validações (Ch17, G25)

```typescript
if (!['APROVADO', 'PUBLICADO'].includes(itemPlano.plano?.status))
```
Deveria ser constante nomeada.

### H8 — Schedule misturado com service (Ch10)

`recomendacoes/recomendacoes.schedule.ts` injeta `RecomendacoesService` diretamente em vez de use case.

---

## 🟢 Médios (8)

### M1 — Nomenclatura inconsistente (Ch2)

Arquivos em português (`criar-evidencia`) vs inglês (`create-auditoria`). Mistura de hífen e underscore.

### M2 — Comentários timestamp (Ch4)

```typescript
// ── Evidências ────────────────────────────────
// ── Papéis de Trabalho ────────────────────────
```

### M3 — `let` em vez de blocos (Ch2/FP)

```typescript
let status = 'ONLINE';
let erro: string | null = null;
```

### M4 — Objetos com 10+ campos inline (Ch3)

Criação direta de objetos de persistência com múltiplos campos sem builder ou factory.

### M5 — `includes` com lookup O(n) em vez de Set (Ch17)

`STATUS_VALIDOS.includes(x)` para conjuntos pequenos pode ser `Set.has()`.

### M6 — Ausência de testes e2e

51 testes unitários, zero e2e.

### M7 — `any` em repositórios multi-entidade

Módulos com métodos customizados (planos, relatorios, etica) ainda sem tipagem de retorno.

### M8 — Constantes de domínio em service, não em domain

`PRAZO_MANIFESTACAO_DIAS_UTEIS` e `RESSALVA_SEM_MANIFESTACAO` exportadas de `achados.service.ts` em vez de `achados/domain/`.

---

## Regra de Ouro (Boy Scout Rule, Ch1)

| Indicador | Antes | Depois | Δ |
|----------|-------|--------|---|
| Services com DI de concreção | 23/23 | 0/23 | ✅ -100% |
| `any` em repositórios | 23/23 | 16/23 | ✅ -30% |
| Use cases com SRP | 0 | 8 | ✅ +8 |
| Eventos em vez de acoplamento | 0 | 8 pontos | ✅ |
| Entidades de domínio puras | 0 | 2 | ✅ |
| Testes arquiteturais | 0 | 7 | ✅ |
| ADRs em arquivos separados | 0 | 10 | ✅ |
| Erros TS | 14 | 4 | ✅ -71% |

**Boy Scout Score**: 6 novas violações introduzidas vs ~30 corrigidas. Saldo positivo.
