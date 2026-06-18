# CONFORMITAS 3.0 — Design System
**Versão:** 1.0.0 | **Status:** Fundação | **Stack:** Angular 19 + Angular Material + TailwindCSS 4

---

## 1. Filosofia e Princípios

- **Clareza sobre Decoração:** A interface deve expor dados de auditoria com precisão. Nada de elementos visuais que compitam com a informação.
- **Acessibilidade Inegociável:** WCAG 2.1 AA. Contraste, foco visível, navegação por teclado, leitores de tela.
- **Seriedade Institucional:** Tombora profissional e sóbrio, adequado ao Poder Judiciário. Sem animações excessivas.
- **Eficiência do Auditor:** Cada tela deve reduzir cliques. Fluxos críticos (registro de achado, emissão de relatório) devem ser lineares e previsíveis.
- **Permission-Aware por Design:** A UI adapta-se automaticamente ao perfil do usuário (P01-P10). Ocultar, desabilitar ou mostrar read-only.

---

## 2. Fundamentos (Design Tokens)

### 2.1. Paleta de Cores

| Categoria | Token | Hex | Uso |
|-----------|-------|-----|-----|
| **Brand** | `primary` | `#1a3a5c` | CTAs principais, sidebar, cabeçalhos |
| **Brand** | `primary-light` | `#2d5a8e` | Hover de elementos primários |
| **Brand** | `primary-dark` | `#0f2440` | Rodapé, elementos de destaque |
| **Brand** | `accent` | `#c9a84c` | Destaques secundários, badges de prioridade alta |
| **Neutral** | `surface` | `#ffffff` | Fundo de cards, modais e inputs |
| **Neutral** | `background` | `#f4f5f7` | Fundo geral da aplicação |
| **Neutral** | `text-main` | `#1a1a2e` | Textos principais, títulos |
| **Neutral** | `text-sec` | `#5a6a7e` | Textos secundários, labels, metadados |
| **Neutral** | `border` | `#d0d5dd` | Bordas de inputs, cards, tabelas |
| **Neutral** | `divider` | `#eaecf0` | Divisores sutis entre seções |
| **Semantic** | `success` / `success-bg` | `#16a34a` / `#dcfce7` | Status cumprida, aprovação |
| **Semantic** | `critical` / `critical-bg` | `#dc2626` / `#fee2e2` | Erros, vencida, alertas críticos |
| **Semantic** | `warning` / `warning-bg` | `#d97706` / `#fef3c7` | Pendente, prazos próximos |
| **Semantic** | `info` / `info-bg` | `#2563eb` / `#dbeafe` | Informações, em andamento |

*Regra:* Nunca usar `primary` como cor de texto sobre fundo branco. Use `text-main`.

### 2.2. Tipografia

**Família:** Inter (Google Fonts) — limpa, profissional, boa legibilidade em tabelas densas.

| Token | Tamanho | Peso | Line-Height | Uso |
|-------|---------|------|-------------|-----|
| `display-lg` | 2rem / 32px | 700 | 1.2 | Título da página |
| `heading-md` | 1.25rem / 20px | 600 | 1.25 | Títulos de seção e cards |
| `body-md` | 0.875rem / 14px | 400 | 1.5 | Corpo de texto, tabelas |
| `label-sm` | 0.8125rem / 13px | 500 | 1.2 | Labels, badges |
| `caption` | 0.75rem / 12px | 400 | 1.5 | Metadados, timestamps |

### 2.3. Espaçamento

Base: 4px

| Token | Valor | Uso |
|-------|-------|-----|
| `space-xs` | 4px | Gap entre ícone e texto |
| `space-sm` | 8px | Gap entre label e input |
| `space-md` | 16px | Padding de cards, gap entre campos |
| `space-lg` | 24px | Padding interno de modais |
| `space-xl` | 32px | Margens entre seções |

### 2.4. Elevação e Bordas

| Nível | Token | Valor | Uso |
|-------|-------|-------|-----|
| Level 0 | `radius-sm` | 4px | Inputs, badges |
| Level 0 | `radius-md` | 8px | Cards, modais, botões |
| Level 1 | `shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | Cards em repouso |
| Level 2 | `shadow-md` | `0 4px 12px rgba(0,0,0,0.12)` | Dropdowns, tooltips |
| Level 3 | `shadow-lg` | `0 8px 24px rgba(0,0,0,0.16)` | Modais |

### 2.5. Tema Escuro (Dark Mode)

| Categoria | Token | Hex (Dark) |
|-----------|-------|------------|
| Neutral | `surface` | `#1e1e2e` |
| Neutral | `background` | `#14141e` |
| Neutral | `text-main` | `#e0e0e8` |
| Neutral | `text-sec` | `#8888a0` |
| Neutral | `border` | `#2e2e3e` |
| Neutral | `divider` | `#252535` |

Cores semânticas mantêm matiz, reduzem saturação em 10%.

---

## 3. Layout e Responsividade

### 3.1 Breakpoints

| Nome | Largura | Dispositivo |
|------|---------|-------------|
| `xs` | < 640px | Mobile |
| `sm` | ≥ 640px | Tablet portrait |
| `md` | ≥ 1024px | Tablet landscape / Desktop pequeno |
| `lg` | ≥ 1280px | Desktop padrão |
| `xl` | ≥ 1536px | Desktop largo |

### 3.2 Estrutura de Página (Shell)

```
┌──────────────────────────────────────────┐
│ TOPBAR: logo, breadcrumb, perfil, notif  │
├────────┬─────────────────────────────────┤
│        │                                 │
│ SIDEBAR│         CONTEÚDO                │
│  (P01  │                                 │
│  menu  │   ┌──────────────────────┐      │
│  full) │   │ Card / Tabela / Form │      │
│        │   └──────────────────────┘      │
│        │                                 │
└────────┴─────────────────────────────────┘
```

- **Sidebar:** 240px largura. Itens de menu diferentes por perfil (P01 vê todos, P05 vê apenas sua unidade).
- **Topbar:** 56px altura. Breadcrumb dinâmico + badge de notificações + avatar.
- **Conteúdo:** Padding 24px. Máximo 1200px de largura para legibilidade.

---

## 4. Biblioteca de Componentes

### 4.1. Button

| Propriedade | Tipo | Obrigatório | Padrão | Descrição |
|-------------|------|-------------|--------|-----------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | Sim | `'primary'` | Variante visual |
| `size` | `'sm' \| 'md' \| 'lg'` | Não | `'md'` | Tamanho |
| `disabled` | `boolean` | Não | `false` | Desabilitado |
| `loading` | `boolean` | Não | `false` | Spinner + desabilitado |
| `icon` | `string` | Não | — | Ícone Material à esquerda |

**Regra:** Apenas 1 `primary` button por viewport. Ação principal da tela.

### 4.2. Input (com Angular Material + Tailwind)

| Propriedade | Tipo | Descrição |
|-------------|------|-----------|
| `label` | `string` | Label do campo |
| `type` | `'text' \| 'number' \| 'email' \| 'password' \| 'textarea' \| 'date'` | Tipo |
| `required` | `boolean` | Campo obrigatório (asterisco vermelho) |
| `disabled` | `boolean` | Desabilitado |
| `error` | `string` | Mensagem de erro (borda vermelha) |
| `helper` | `string` | Texto de ajuda abaixo do campo |

**Estados:** Default, Focus (outline primary), Disabled, Error (borda critical + mensagem), Read-only (fundo background).

### 4.3. Select / Dropdown

Igual Input, propriedade adicional: `options: {value: string, label: string}[]`.

### 4.4. Card

**Variantes:** `default` (borda), `elevated` (sombra), `interactive` (hover eleva).

**Estados:** Default, Hover (sombra aumenta se interactive), Loading (skeleton).

### 4.5. Badge / Status Tag

**Variantes por semântica:** `success`, `warning`, `critical`, `info`, `neutral`.

| Status | Cor | Uso |
|--------|-----|-----|
| `success` | Verde | Cumprida, Aprovado, Publicado, Positivo |
| `warning` | Âmbar | Pendente, Em andamento, Submetido |
| `critical` | Vermelho | Vencida, Erro, Suspensa, Negativo |
| `info` | Azul | Em manifestação, Rascunho |
| `neutral` | Cinza | Arquivado, Inativo |

### 4.6. Modal / Dialog

**Tamanhos:** `sm` (400px), `md` (560px), `lg` (800px).

**Estados:** Aberto (overlay + foco preso), Fechando (animação fade).

### 4.7. Table / Data Grid

**Features:** Cabeçalho fixo (sticky), ordenação por coluna (click), paginação, seleção de linhas, empty state.

**Estados:**
- `loading`: Skeleton rows (5-10 linhas fantasma)
- `empty`: Ícone + "Nenhum registro encontrado" + CTA (se aplicável)
- `error`: Mensagem de erro + botão "Tentar novamente"
- `data`: Linhas com hover highlight

### 4.8. Tabs

**Variantes:** `underline` (padrão), `pills`.

### 4.9. Tooltip

Aparece no hover/focus. Máximo 200px largura. Delay 300ms.

### 4.10. Toast / Snackbar

**Posições:** `top-right`, `bottom-center`.

**Variantes:** `success`, `error`, `warning`, `info`.

Duração: 5s (auto-dismiss) ou persistente (com botão fechar).

### 4.11. Skeleton Loader

Usado em cards, tabelas e formulários durante carregamento. Animação de pulso sutil.

### 4.12. Stepper / Wizard

Para formulários longos (planejamento individual de auditoria, cadastro de achado). Passos numerados com validação por etapa.

---

## 5. Padrões de Interface

### 5.1. Tabelas de Dados

- Cabeçalho fixo com scroll vertical
- Ordenação: clique no cabeçalho alterna ASC/DESC/NONE
- Paginação: 10/25/50 itens por página
- Filtros: acima da tabela, em linha ou sidebar
- Exportação: botão no topo direito (PDF, XLSX)
- Seleção múltipla com checkbox (para ações em lote)

### 5.2. Formulários

- Validação em tempo real (on blur), não apenas no submit
- Campos obrigatórios marcados com asterisco vermelho
- Botão submit desabilitado até formulário válido
- Confirmação ao sair com alterações não salvas (dirty state)
- Wizard para formulários com mais de 8 campos

### 5.3. Feedback e Confirmação

- **Ações destrutivas** (excluir, suspender): Modal de confirmação com texto explícito
- **Ações comuns** (salvar, enviar): Toast de sucesso/erro
- **Operações longas** (gerar relatório): Botão com spinner + toast ao concluir

### 5.4. Navegação

- Breadcrumb dinâmico no topo
- Sidebar com ícones + texto, colapsável
- Abas para subseções dentro de uma página
- Atalhos de teclado: Alt+S (salvar), Alt+N (novo), Esc (fechar modal)

### 5.5. Permission-Aware UI

| Perfil | Estratégia |
|--------|------------|
| P01 (Auditor-Chefe) | Acesso total. Todos os menus e ações visíveis |
| P02 (Auditor) | Menus operacionais. Sem ações de aprovação/administração |
| P03 (Presidente) | Sidebar reduzida: apenas aprovações pendentes e relatórios |
| P05 (Gestor Unidade) | Apenas menus de manifestação e recomendações da sua unidade |
| P06 (Gestor 2ª Linha) | Visão consolidada. Leitura apenas |
| P07 (Avaliador Externo) | Acesso temporário. Menu apenas PQAUD |
| P10 (Admin Sistema) | Sem menus de auditoria. Apenas Administração |

**Regras:** Ocultar botões de ação (não apenas desabilitar) para perfis sem permissão. Exibir badge indicando perfil ativo no topo.

### 5.6. Dashboards

- KPI Cards: 4 por linha (lg), 2 (md), 1 (sm). Número grande + label + variação %
- Gráficos: barras (PAA planejado × executado), pizza (status recomendações), linha (tendência)
- Filtros de período no topo
- Exportação PDF/XLSX

---

## 6. Micro-Interações e Animações

| Animação | Gatilho | Duração | Easing |
|----------|---------|---------|--------|
| Fade in | Rota carrega | 200ms | ease-out |
| Slide down | Modal abre | 250ms | ease-out |
| Pulse | Skeleton loader | 1.5s (loop) | ease-in-out |
| Scale | Hover em card interactive | 150ms | ease-out |
| Shake | Erro de validação | 400ms | ease-in-out |
| Toast enter/exit | Notificação | 300ms | ease-out |

---

## 7. Acessibilidade (WCAG 2.1 AA)

- Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
- Todos os elementos interativos têm foco visível (outline 2px primary)
- Touch targets mínimos 44×44px
- Labels associadas a inputs (`for`/`id` ou `aria-labelledby`)
- Tabelas com `<thead>`, `<th scope>`, `role="table"`
- Modais com `role="dialog"`, `aria-modal="true"`, foco preso
- Notificações com `role="alert"` ou `aria-live="polite"`
- Texto alternativo em ícones decorativos (`aria-hidden="true"`) e informativos (`aria-label`)

---

## 8. Implementação com Angular 19 + Angular Material + TailwindCSS 4

### 8.1 Configuração Tailwind

```js
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: { DEFAULT: '#1a3a5c', light: '#2d5a8e', dark: '#0f2440' },
      accent: '#c9a84c',
      surface: '#ffffff',
      background: '#f4f5f7',
      'text-main': '#1a1a2e',
      'text-sec': '#5a6a7e',
      border: '#d0d5dd',
      success: '#16a34a',
      critical: '#dc2626',
      warning: '#d97706',
      info: '#2563eb',
    },
    fontFamily: { sans: ['Inter', 'sans-serif'] },
  }
}
```

### 8.2 Componentes Angular Material utilizados

- `MatButton` → estendido com variantes via Tailwind
- `MatInput`, `MatFormField` → inputs e textareas
- `MatSelect` → dropdowns
- `MatTable` → tabelas de dados
- `MatDialog` → modais
- `MatSnackBar` → toasts
- `MatTabs` → abas
- `MatTooltip` → tooltips
- `MatStepper` → wizards
- `MatSidenav` → sidebar
- `MatToolbar` → topbar
- `MatBadge` → contadores de notificação
- `MatChips` → tags de status

### 8.3 Componentes Customizados

- `AppShellComponent` — Layout principal (sidebar + topbar + conteúdo)
- `StatusBadgeComponent` — Tag de status (usa MatChips + tokens semânticos)
- `DataTableComponent` — Tabela com sorting, paginação, empty/loading/error states
- `ConfirmDialogComponent` — Diálogo de confirmação padronizado
- `PageHeaderComponent` — Título + breadcrumb + botões de ação
- `KpiCardComponent` — Card de indicador para dashboards
- `SkeletonComponent` — Loader placeholder

---

**Versão:** 1.0.0 | **Stack:** Angular 19 + Angular Material + TailwindCSS 4
