# Plano de Correção — GAPS do PRP-003

> **Data:** 2026-07-02 | **Status:** ⏳ Pendente
> **Referências:** `PRP-003-universo-auditavel-matriz-priorizacao.md`, `TASKS.md`, `EXECUTION_WAVES.md`

---

## Gap 1: CRUD UI do Universo Auditável (🔴 Crítico)

**Problema:** Só existe a tela de Matriz de Priorização. Não há UI para listar, criar, editar ou remover itens do universo.

**O que existe:**
- Backend CRUD completo (`universo.controller.ts` — POST, GET, GET/:id, PATCH, DELETE)
- `CreateUniversoDto`/`UpdateUniversoDto` com validação 1-5 (class-validator)
- `matriz-priorizacao.component.ts` como referência de padrão
- `app-data-table`, `page-header` como componentes shared existentes

### Tarefas

| Tarefa | Arquivo | Descrição |
|--------|---------|-----------|
| C-1.1 | `web/src/app/features/universo/universo-list.component.ts` | (novo) Tabela com busca, filtro por tipo, colunas: nome, tipo, unidade, notas (mat/rev/crit/risco), índice, ações (editar/remover). Baseado em `recomendacao-list.component.ts` + `app-data-table`. |
| C-1.2 | `web/src/app/features/universo/universo-form.component.ts` | (novo) Formulário com campos: nome, descrição, tipo (select AREA/PROCESSO/TEMA/PROJETO), unidade responsável, 4 inputs numéricos (1-5) para notas + índice calculado exibido. Baseado em `usuario-form.component.ts` (grid, icon prefix). |
| C-1.3 | `web/src/app/app.routes.ts` | Adicionar rotas `/universo`, `/universo/novo`, `/universo/:id` com `rolesGuard(['P01', 'P02'])`. |
| C-1.4 | `web/src/app/core/layout/main-layout.component.ts` | Adicionar item "Universo Auditável" no menu lateral (acima de "Matriz Priorização"). |

### Testes

- Navegação: `/universo` carrega lista, `/universo/novo` carrega form vazio, `/universo/:id` carrega form preenchido
- Criação: preencher notas e verificar índice recalculado
- Edição: alterar nota e verificar índice recalculado
- Filtro por tipo na lista

### Esforço estimado: ~5h

---

## Gap 2: Mock Formula Diverge da Real (🟡 Médio)

**Problema:** O mock interceptor usa `(M×R×C/Risco)/10` enquanto o backend usa `(M×R×C×Risco)^(1/4)`. O default de horas por item também diverge (mock = 40h, service = 100h).

### Tarefas

| Tarefa | Arquivo | Mudança |
|--------|---------|---------|
| C-2.1 | `web/src/app/core/interceptors/mock-backend.interceptor.ts:209` | Substituir fórmula por `Math.round(Math.pow(m * r * c * riscoVal, 1/4) * 100) / 100` (geometric mean) |
| C-2.2 | `web/src/app/core/interceptors/mock-backend.interceptor.ts:218` | Mudar default horas de 40 para 100 |
| C-2.3 | `mocks/data/universo_auditavel.json` | Corrigir `indice_priorizacao` do item `univ-001` de `4.21` para `4.16` |

### Esforço estimado: ~0.5h

---

## Gap 3: Seed de Universo no Banco (🟡 Médio)

**Problema:** `seed.ts` não cria nenhum `UniversoAuditavel`. Os dados só existem em mock.

### Tarefas

| Tarefa | Arquivo | Descrição |
|--------|---------|-----------|
| C-3.1 | `api/prisma/seed.ts` | Adicionar bloco `prisma.universoAuditavel.createMany()` com 5-8 itens representativos (Secretaria de Finanças, Diretoria Administrativa, etc.), notas variadas 1-5, `indicePriorizacao` pré-calculado. |

### Dados sugeridos para seed

| Nome | Tipo | Unidade | Mat | Rev | Crit | Risco | Índice |
|------|------|---------|-----|-----|------|-------|--------|
| Secretaria de Finanças | PROCESSO | SEFIN | 5 | 5 | 4 | 3 | 4.16 |
| Diretoria Administrativa | AREA | DIRAD | 5 | 4 | 5 | 4 | 4.47 |
| Divisão de Licitações | PROCESSO | DILIC | 4 | 5 | 4 | 4 | 4.23 |
| Gabinete da Presidência | AREA | GABPRES | 5 | 4 | 4 | 3 | 3.94 |
| Núcleo de Informática | AREA | NUTEC | 3 | 5 | 4 | 3 | 3.66 |
| Setor de Protocolo | PROCESSO | SETPRO | 5 | 3 | 4 | 5 | 4.16 |
| Divisão de Recursos Humanos | AREA | DIRHU | 4 | 4 | 3 | 2 | 3.13 |
| Coordenadoria de Controle Interno | AREA | COCIN | 3 | 3 | 5 | 4 | 3.66 |

### Esforço estimado: ~1h

---

## Gap 4: Controller Spec + Teste de Ordenação (🟡 Médio)

**Problema:** Não existe `universo.controller.spec.ts`. O teste de matriz só verifica length, não a ordem descendente.

### Tarefas

| Tarefa | Arquivo | Descrição |
|--------|---------|-----------|
| C-4.1 | `api/src/universo/universo.controller.spec.ts` | (novo) Testar: create (201), findAll, findOne, update, remove (204), matrizPriorizacao — 6 casos |
| C-4.2 | `api/src/universo/universo.service.spec.ts:94` | Trocar `toHaveLength(2)` por verificação de que `result.itens[0].indicePriorizacao >= result.itens[1].indicePriorizacao` |

### Casos de teste para controller spec

1. `POST /universo-auditavel` — criar item retorna 201 com índice
2. `GET /universo-auditavel` — listar retorna array
3. `GET /universo-auditavel/:id` — buscar por ID retorna item
4. `PATCH /universo-auditavel/:id` — atualizar nota recalcula índice
5. `DELETE /universo-auditavel/:id` — soft delete (ativo=false)
6. `GET /universo-auditavel/matriz-priorizacao` — retorna itens + destaques

### Esforço estimado: ~2h

---

## Gap 5: Teste de Acesso P05 (🟡 Médio)

**Problema:** Spec test #5 ("P05 não tem acesso ao universo auditável") não implementado.

### Tarefas

| Tarefa | Arquivo | Descrição |
|--------|---------|-----------|
| C-5.1 | `api/src/common/guards/roles.guard.spec.ts` | Adicionar caso: requisição com role `P05` para endpoint que requer `P01` deve retornar 403. |

### Esforço estimado: ~0.5h

---

## Resumo

| # | Gap | Prioridade | Tarefas | Esforço | Depende |
|---|-----|-----------|---------|---------|---------|
| 1 | CRUD UI universo | 🔴 Crítico | C-1.1 a C-1.4 | 5h | — |
| 2 | Mock formula | 🟡 Médio | C-2.1 a C-2.3 | 0.5h | — |
| 3 | Seed banco | 🟡 Médio | C-3.1 | 1h | — |
| 4 | Controller spec | 🟡 Médio | C-4.1, C-4.2 | 2h | — |
| 5 | Teste acesso P05 | 🟡 Médio | C-5.1 | 0.5h | — |
| | **Total** | | **10 tarefas** | **~9h** | |

## Ordem de Execução Sugerida

1. **C-2** (mock formula) — mais rápido, desbloqueia testes manuais corretos
2. **C-3** (seed) — desbloqueia testes com dados reais
3. **C-1** (CRUD UI) — maior valor entregue
4. **C-4 + C-5** (testes) — validação final
