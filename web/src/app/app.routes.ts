import { Routes } from '@angular/router';
import { authGuard, rolesGuard } from './core/guards/auth.guard';
import { confirmDeactivate } from './core/guards/dirty-form.guard';

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
        path: 'dashboard/paa',
        loadComponent: () =>
          import('./features/dashboard/dashboard-paa.component').then((m) => m.DashboardPaaComponent),
      },
      {
        path: 'dashboard/recomendacoes',
        loadComponent: () =>
          import('./features/dashboard/dashboard-recomendacoes.component').then((m) => m.DashboardRecomendacoesComponent),
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
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'achados/:id',
        loadComponent: () =>
          import('./features/achados/achado-form.component').then((m) => m.AchadoFormComponent),
        canDeactivate: [confirmDeactivate],
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
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'usuarios/:id',
        loadComponent: () =>
          import('./features/usuarios/usuario-form.component').then((m) => m.UsuarioFormComponent),
        canActivate: [rolesGuard(['P10'])],
        canDeactivate: [confirmDeactivate],
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
        path: 'universo',
        loadComponent: () =>
          import('./features/universo/universo-list.component').then((m) => m.UniversoListComponent),
        canActivate: [rolesGuard(['P01', 'P02'])],
      },
      {
        path: 'universo/novo',
        loadComponent: () =>
          import('./features/universo/universo-form.component').then((m) => m.UniversoFormComponent),
        canActivate: [rolesGuard(['P01', 'P02'])],
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'universo/:id',
        loadComponent: () =>
          import('./features/universo/universo-form.component').then((m) => m.UniversoFormComponent),
        canActivate: [rolesGuard(['P01', 'P02'])],
        canDeactivate: [confirmDeactivate],
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
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'auditorias/:id',
        loadComponent: () =>
          import('./features/auditorias/auditoria-form.component').then((m) => m.AuditoriaFormComponent),
        canDeactivate: [confirmDeactivate],
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
      {
        path: 'integracoes',
        loadComponent: () =>
          import('./features/integracoes/integracao-list.component').then((m) => m.IntegracaoListComponent),
        canActivate: [rolesGuard(['P01', 'P10'])],
      },
      {
        path: 'integracoes/novo',
        loadComponent: () =>
          import('./features/integracoes/integracao-form.component').then((m) => m.IntegracaoFormComponent),
        canActivate: [rolesGuard(['P10'])],
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'integracoes/:id',
        loadComponent: () =>
          import('./features/integracoes/integracao-form.component').then((m) => m.IntegracaoFormComponent),
        canActivate: [rolesGuard(['P10'])],
        canDeactivate: [confirmDeactivate],
      },
      {
        path: 'acoes-coordenadas',
        loadComponent: () =>
          import('./features/acoes-coordenadas/acao-coordenada-list.component').then((m) => m.AcaoCoordenadaListComponent),
        canActivate: [rolesGuard(['P01', 'P08'])],
      },
      {
        path: 'acoes-coordenadas/:id',
        loadComponent: () =>
          import('./features/acoes-coordenadas/acao-coordenada-detail.component').then((m) => m.AcaoCoordenadaDetailComponent),
        canActivate: [rolesGuard(['P01', 'P08'])],
      },
    ],
  },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: 'mfa', loadComponent: () => import('./features/auth/mfa.component').then((m) => m.MfaComponent) },
  { path: '**', redirectTo: '/login' },
];
