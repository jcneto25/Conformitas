import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout.component').then((m) => m.MainLayoutComponent),
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
    ],
  },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: '**', redirectTo: '/login' },
];
