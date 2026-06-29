import { Routes } from '@angular/router';
import { authGuard, rolesGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout.component').then((m) => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'achados',
        loadComponent: () =>
          import('./features/achados/quadro-achados.component').then((m) => m.QuadroAchadosComponent),
      },
      {
        path: 'achados/novo',
        loadComponent: () =>
          import('./features/achados/achado-form.component').then((m) => m.AchadoFormComponent),
      },
      {
        path: 'achados/:id',
        loadComponent: () =>
          import('./features/achados/achado-form.component').then((m) => m.AchadoFormComponent),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./features/usuarios/usuario-form.component').then((m) => m.UsuarioFormComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'usuarios/novo',
        loadComponent: () =>
          import('./features/usuarios/usuario-form.component').then((m) => m.UsuarioFormComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'usuarios/:id',
        loadComponent: () =>
          import('./features/usuarios/usuario-form.component').then((m) => m.UsuarioFormComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'perfis',
        loadComponent: () =>
          import('./features/perfis/perfil-list.component').then((m) => m.PerfilListComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'usuarios/:id/perfis',
        loadComponent: () =>
          import('./features/perfis/usuario-perfil-form.component').then((m) => m.UsuarioPerfilFormComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'mandatos',
        loadComponent: () =>
          import('./features/mandatos/mandato-list.component').then((m) => m.MandatoListComponent),
        canActivate: [rolesGuard(['P01', 'P03', 'P04'])],
      },
      {
        path: 'configuracoes',
        loadComponent: () =>
          import('./features/config/configuracao-list.component').then((m) => m.ConfiguracaoListComponent),
        canActivate: [rolesGuard(['P10'])],
      },
      {
        path: 'matriz-priorizacao',
        loadComponent: () =>
          import('./features/universo/matriz-priorizacao.component').then((m) => m.MatrizPriorizacaoComponent),
      },
      {
        path: 'auditorias',
        loadComponent: () =>
          import('./features/auditorias/auditoria-list.component').then((m) => m.AuditoriaListComponent),
      },
      {
        path: 'auditorias/novo',
        loadComponent: () =>
          import('./features/auditorias/auditoria-form.component').then((m) => m.AuditoriaFormComponent),
      },
      {
        path: 'auditorias/:id',
        loadComponent: () =>
          import('./features/auditorias/auditoria-form.component').then((m) => m.AuditoriaFormComponent),
      },
      {
        path: 'planos-aprovacao',
        loadComponent: () =>
          import('./features/planos/plano-aprovacao.component').then((m) => m.PlanoAprovacaoComponent),
        canActivate: [rolesGuard(['P01', 'P03'])],
      },
      {
        path: 'relatorios',
        loadComponent: () =>
          import('./features/relatorios/relatorio-preview.component').then((m) => m.RelatorioPreviewComponent),
      },
      {
        path: 'relatorios-anuais',
        loadComponent: () =>
          import('./features/relatorios/relatorio-anual-form.component').then((m) => m.RelatorioAnualFormComponent),
      },
      {
        path: 'painel-monitoramento',
        loadComponent: () =>
          import('./features/recomendacoes/painel-monitoramento.component').then((m) => m.PainelMonitoramentoComponent),
        canActivate: [rolesGuard(['P01', 'P06'])],
      },
      {
        path: 'recomendacoes',
        loadComponent: () =>
          import('./features/recomendacoes/recomendacao-list.component').then((m) => m.RecomendacaoListComponent),
      },
      {
        path: 'recomendacoes/:id',
        loadComponent: () =>
          import('./features/recomendacoes/recomendacao-detail.component').then((m) => m.RecomendacaoDetailComponent),
      },
    ],
  },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: 'mfa', loadComponent: () => import('./features/auth/mfa.component').then((m) => m.MfaComponent) },
  { path: '**', redirectTo: '/login' },
];
