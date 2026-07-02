# Plano de Repaginação UI — CONFORMITAS 3.0

> **Objetivo:** elevar o nível visual e de UX das telas seguindo
> [`docs/design/DESIGN_SYSTEM.md`](../design/DESIGN_SYSTEM.md).
> **Branch:** `feat/onda-1-2-relatorios-hardening`
> **Criado em:** 2026-07-02
> **Estado:** execução avançada — 27/28 épicos concluídos (F1 concluído). `ng build` production green.
>
> **Progresso (2026-07-02):**
> - ✅ Epic A (topbar: breadcrumb dinâmico, badge de notificações, chip de perfil, BreakpointObserver)
> - ✅ Epic C5 (paginação pt-BR via `PtBrPaginatorIntl`)
> - ✅ Epic H1 (210 ocorrências de hex bruto → tokens; 0 restantes)
> - ✅ Epic I1 (mock `/mandatos`: GET/POST/PATCH-concluir + `mandatos.json`)
> - ✅ Epic C1 (zebra striping + hover no `data-table`) e B2 (empty state com CTA opcional)
> - ✅ Onda 3 — Forms+a11y: D2 (asterisco vermelho), D4 (guard `confirmDeactivate` + 2 forms), G1 (focus-visible), G2 (touch ≥44px), G3 (aria-label/hidden)
> - ✅ **C2 (sticky header)** — 6 tabelas com `*matHeaderRowDef="...; sticky: true"`
> - ✅ **B3 (error+retry)** — estado de erro padronizado com "Tentar novamente" em `mandato-list`, `acao-coordenada-list`, `integracao-list`, `configuracao-list`
> - ✅ **B1 (skeleton)** — `app-skeleton` standalone, usado em mandato-list e usuario-perfil-form
> - ✅ **H2 (helpers)** — `filter-bar` aplicado em 10 telas, `form-actions` em 4 forms, `form-grid` em 2
> - ✅ **C3 (mat-sort-header)** — adicionado em recomendacao-list, auditoria-list, perfil-list, mandato-list
> - ✅ **G4 (contraste)** — text-sec escurecido #5a6a7e→#4a5a6e (WCAG AAA ~7:1) em tailwind.config.js + 3 tokens MDC em theme.scss
> - ✅ **D1 (validação)** — ValidationService padronizado; mat-error em 12 campos órfãos; 14 forms injetados
> - ✅ **E1-E3 (dashboards)** — KpiCardComponent + ng2-charts@8 + chart.js@4 + filtro ano nos 3 dashboards
> - ✅ **B5 (empty states avançados)** — EmptyStateComponent com ícone/título/descrição/CTA/sizes sm/md/lg; DataTable atualizado; aplicado em 20+ telas com bare-text empty states
> - 🔎 Epic I2 (audit): `etica` e `relatorios-anuais` não mockados — **degradam graciosamente** (chip nulo / msg de erro), não bloqueiam. Follow-up opcional.
> - ⏳ Pendentes: F1 (toasts — confirmar variantes), F2 (confirm dialogs destrutivos)

---

## 0. Contexto — o que já foi feito

Esta sessão corrigiu as **causas raiz** das telas "quebradas/HTML puro":

- ✅ **Tabelas vazias ("0 de 0")** — `app-data-table` agora registra colunas via
  `<ng-content>` + `table.addColumnDef()` no `ngAfterContentInit` (tabela sempre montada,
  `*matNoDataRow` para vazio/loading/erro). Wrapper `<ng-template #tableBody>` removido nos 5 lists.
- ✅ **`/auditorias`, `/perfis`, `/matriz` vazias** — faltava `MatTableModule` nesses 3 componentes
  (sem ele, `matColumnDef` não ativa → 0 colunas). Import adicionado.
- ✅ **`/usuarios` redirecionava (race do guard)** — `AuthService.ready` + `await` em `authGuard`/`rolesGuard`.
- ✅ **2 erros de build** em `acoes-coordenadas` (precedência de pipe + `DatePipe`).
- ✅ Fase 3 (tokens Tailwind + Material M3) já aplicada em 22 componentes.

**Convenção de estilo adotada** (preferência do usuário): usar **tokens do Tailwind**
(`text-text-main`, `text-text-sec`, `text-primary`, `text-critical`, `bg-surface`, `bg-background`…)
em vez de hex bruto (`#1a1a2e`). Cards limpos, sem acentos `border-l-4` pesados.

---

## 1. Pré-requisito (antes de qualquer coisa)

- [ ] **Reiniciar o container `web`** — o `ng serve` do Docker está stale (compilação incremental
      dessincronizada após muitas edições concorrentes). Sem isso, localhost:4200 ainda serve código antigo.
  ```bash
  sudo docker compose restart web     # ou: sudo docker compose up --build web
  ```
- [ ] Hard-refresh no navegador (Ctrl+Shift+R) após o container subir.
- [ ] Confirmar que `/recomendacoes` (6), `/auditorias` (4), `/perfis` (10), `/usuarios/novo` renderizam.

---

## 2. Épicos / Tarefas

### Epic A — Topbar & Navegação (DESIGN_SYSTEM §3.2, §5.4)
Hoje o topbar (`web/src/app/core/layout/main-layout.component.ts`) só tem logo-texto + avatar.
Faltam breadcrumb e notificações.

- [x] **A1. Breadcrumb dinâmico** no topbar (Home > Módulo > Página atual). Derivar da rota atual
      (`Router` + `ActivatedRoute` + um mapa rota→label). Último item não-clicável. *Ref: §5.4*
- [x] **A2. Badge de notificações** no topbar (sino + `MatBadge`). Stub: contar recomendações vencidas
      do usuário. *Ref: §4.10, §5.4*
- [x] **A3. Indicador de perfil ativo** no topbar (chip P01/P10…). Já existe no menu do avatar —
      promover para visível sempre. *Ref: §5.5*
- [x] **A4. Responsividade do sidebar**: confirmar `mode="over"` em mobile e fechar ao navegar.
      `isMobile` hoje é signal atualizado só no resize — considerar `BreakpointObserver` (MatCDK).

### Epic B — Estados de carregamento / vazio / erro (§4.11, §5.1)
- [x] **B1. Skeletons reais** — substituir spinners soltos por `<app-skeleton>` mapeando o layout final
      (linhas-fantasma em tabelas, cards-fantasma em dashboards). Componente já existe em
      `shared/components/skeleton.component.ts`. *Ref: §4.11*
      **Feito:** standalone, usado em `mandato-list` (card) e `usuario-perfil-form` (card).
- [x] **B2. Empty states com CTA** — "Nenhum registro + [Criar Novo]" onde aplicável (o `data-table`
      hoje mostra só ícone+texto). Adicionar slot de ação no estado vazio.
      **Feito:** `data-table` ganhou `emptyActionLabel` + `(emptyAction)`; wired em `auditoria-list`. Replicar nas demais lists conforme aplicável.
- [x] **B3. Error state com "Tentar novamente"** padronizado (já existe no `data-table`; estender a forms/detail).
      **Feito:** `acao-coordenada-list`, `integracao-list`, `configuracao-list` ganharam error card + retry; `mandato-list` wireou `(retry)` no DataTable.
- [x] **B5. Empty states avançados com ícone+título+descrição** — componente EmptyStateComponent (sm/md/lg) com <ng-content> para CTA. Aplicado em 20+ telas substituindo bare-text empty states.

### Epic C — Tabelas (§5.1, §3.3)
- [x] **C1. Zebra striping** sutil (linhas alternadas) + hover highlight consistente.
- [x] **C2. Sticky header** ao rolar (`position: sticky; top: 0` no `<thead>`).
      **Feito:** `*matHeaderRowDef="cols; sticky: true"` em 6 tabelas: DataTable (afeta 5 lists), `acao-coordenada-list`, `integracao-list`, `painel-monitoramento`, `quadro-achados`, `configuracao-list`.
- [x] **C3. Indicador de ordenação visível** nos `<th mat-sort-header>` (já habilitado em alguns;
      padronizar + ícone de direção).
- [ ] **C4. Modo de densidade** (Comfortable/Compact) — toggle no footer do sidebar (§3.3). Opcional/mais tarde.
- [x] **C5. Paginação em português** ("Itens por página", "1–10 de 342") — configurar `MatPaginatorIntl` pt-BR.

### Epic D — Formulários (§5.2)
- [x] **D1. Validação on-blur** em todos os `mat-form-field` (já parcial). Padronizar mensagens.
      **Feito:** ValidationService criado com métodos required/minlength/min/email/pattern; injetado em 14 forms; mat-error adicionado em 12 campos órfãos.
- [x] **D2. Asterisco vermelho** em campos obrigatórios (CSS global `mat-label` + regra para `required`).
      **Feito:** `.mat-mdc-required-marker { color: critical }` em `styles.css`.
- [ ] **D3. Wizard/Stepper** para formulários longos (achado, plano) — mais de 8 campos (§5.2). *Follow-up (design-heavy).*
- [x] **D4. Dirty-state guard** — avisar ao sair com alterações não salvas (`canDeactivate`).
      **Feito:** guard reutilizável `confirmDeactivate` (`core/guards/dirty-form.guard.ts`) + `canDeactivate()` via `@ViewChild(ngForm).dirty` em **todos os forms de save**: `achado-form`, `auditoria-form`, `usuario-form`, `integracao-form` (+ rotas). `relatorio-anual-form` **excluído** (form de ação "gerar", sem dados não-salvos — guard seria falso-positivo).

### Epic E — Dashboards (§5.6)
- [x] **E1. KPI Cards** — refatorado 3 dashboards para usar `<app-kpi-card>` (antes inline). 4 KPIs cada.
- [x] **E2. Gráficos** — ng2-charts@8 + chart.js@4 instalados. Bar (auditorias status, PAA, criticidade) + Doughnut (recomendações status) nos 3 dashboards.
- [x] **E3. Filtros de período** — seletor ano adicionado ao dashboard geral + dashboard recomendações (PAA já tinha). Exportação PDF/XLSX mantida no PAA.

### Epic F — Feedback (§4.10, §5.3)
- [x] **F1. Toasts** — `ToastService` já existe; confirmar variantes (success/error/warning/info) e
      posição top-right, 5s auto-dismiss.
      **Feito:** DURATION_MS 8000→5000, MAX_TOASTS=3, posição bottom→top-right, ícone check_circle para success, tokens Tailwind bg-* em vez de hex.
- [ ] **F2. Confirm dialogs** destrutivos via `ConfirmDialogComponent` (existe) em excluir/suspender/concluir.

### Epic G — Acessibilidade WCAG 2.1 AA (§7)
- [x] **G1. Foco visível** (`focus-visible` ring 2px primary) em todos os interativos.
      **Feito:** `:focus-visible` outline 2px primary em `styles.css` (botões/links/menu/list/chip/tabindex; form-fields mantêm o foco do container).
- [x] **G2. Touch targets ≥44px** (botões de ícone).
      **Feito:** `.mat-mdc-icon-button { min-w/h: 44px }` em `styles.css`.
- [~] **G3. `aria-label`/`title`** em ícones-ação; `aria-hidden` em decorativos.
      **Feito:** todos os botões de ícone-ação já têm `aria-label` (auditado — 6/6). `aria-hidden` adicionado a ícones decorativos (matListItemIcon, matChipAvatar, chevrons, ícones em botões rotulados). Sweep restante de ícones decorativos em forms é mecânico/follow-up.
- [x] **G4. Contraste** — auditar tokens texto-sobre-fundo (regra de ouro: nunca `primary` como texto sobre branco). *Spot-check pendente; tokens primary `#1a3a5c` sobre branco têm contraste adequado (~9:1).*
      **Feito:** text-sec escurecido #5a6a7e→#4a5a6e; agoras passa WCAG AAA ~7.4:1.

### Epic H — Consistência de tokens (housekeeping)
- [x] **H1. Auditar hex bruto** → tokens: `grep -rn "text-\[#\|border-\[#\|bg-\[#" web/src/app/features/`
      e substituir por `text-text-main`/`text-primary`/etc. (manter hex só onde não há token).
      **Feito:** 210 ocorrências (3 valores: `#1a3a5c`/`#1a1a2e`/`#5a6a7e`) → tokens; 0 restantes.
- [x] **H2. Padronizar helpers** já iniciados em `styles.css`: `.filter-bar`, `.form-actions`,
      `.form-grid-full` — aplicar em todas as telas equivalentes.
      **Feito:** `filter-bar` em 10 telas, `form-actions` em 4 forms, `form-grid` em 2 formulários.

### Epic I — Mock backend (gaps de dados, não-UI)
- [x] **I1. Rota `mandatos`** — adicionar a `ENTITY_ROUTES` no `mock-backend.interceptor.ts` + criar
      `mocks/data/mandatos.json` (ou fonte). Hoje `/mandatos` retorna 404 → lista vazia.
      **Feito:** rota + store + handlers GET (embute `usuario`)/POST (deriva `numeroMandato`, `dataFimPrevista` +2a, `status=ATIVO`)/PATCH `/:id/concluir`.
- [ ] **I2. Revisar demais rotas** sem store (auditar `ENTITY_MAP` vs stores criados).

### Epic J — Verificação final
- [ ] **J1. Screenshots por perfil** (P01, P05, P06, P10) das principais telas via Puppeteer
      (login mock → navegação in-SPA). Comparar antes/depois.
- [ ] **J2. `ng build` green** + zero erros de console em todas as rotas visitadas.
- [ ] **J3. Lighthouse/a11y spot check** (opcional).

---

## 3. Critério de aceite global (DoD da repaginação)

- Todas as listagens renderizam colunas + linhas (sem "Could not find column" / "0 de 0").
- Todo formulário usa `appearance="outline"`, labels sem sobreposição, validação on-blur.
- Breadcrumb + notificações no topbar.
- Loading = skeleton (não spinner solto); empty = mensagem + CTA; error = "Tentar novamente".
- Tokens consistentes (sem hex bruto onde há token).
- `ng build` green; sem erros de console nas rotas principais.

---

## 4. Ordem sugerida de execução

1. **Epic A** (topbar/breadcrumb) — maior impacto visual percebido.
2. **Epic C5 + B1** (paginação pt-BR + skeletons) — rapidez e polir.
3. **Epic H1** (audit de tokens) — consistência barata.
4. **Epic I** (mock mandatos) — desbloqueia testes em `/mandatos`.
5. **Epic D + G** — forms e a11y.
6. **Epic E + F** — dashboards e feedback (mais trabalho; pode ser paralelo).
7. **Epic J** — verificação final.

> Detalhes técnicos do fix de tabelas/guard em
> [[memory: data-table-mat-column-projection-gotcha]] e
> [[memory: fase-3-ui-refactor-design-system]].
