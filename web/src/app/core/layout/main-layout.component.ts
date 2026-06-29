import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule, MatToolbarModule, MatSidenavModule,
    MatListModule, MatIconModule, MatButtonModule,
    MatDividerModule, MatMenuModule, MatChipsModule,
  ],
  template: `
    <mat-sidenav-container class="h-screen bg-background">
      <mat-sidenav
        #sidenav
        [mode]="isMobile() ? 'over' : 'side'"
        [opened]="!isMobile()"
        class="sidebar w-60 bg-primary text-white border-0">
        <div class="flex flex-col h-full">
          <div class="px-4 py-5 text-center">
            <h2 class="text-white text-lg font-bold m-0 tracking-wide">CONFORMITAS</h2>
            <span class="text-gray-400 text-xs">3.0 SGI</span>
          </div>
          <mat-divider class="border-gray-600" />
          <mat-nav-list class="flex-1 overflow-y-auto">
            @for (item of visibleNavItems(); track item.route) {
              <a
                mat-list-item
                [routerLink]="item.route"
                routerLinkActive="active-link"
                (click)="isMobile() && sidenav.close()"
                class="text-gray-300 hover:text-white hover:bg-surface/10 transition-colors">
                <mat-icon matListItemIcon class="text-gray-400">{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
              </a>
            }
          </mat-nav-list>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="bg-primary-dark text-white h-14 px-4 sticky top-0 z-10">
          @if (isMobile()) {
            <button mat-icon-button (click)="sidenav.toggle()" class="text-white mr-2" aria-label="Abrir menu">
              <mat-icon>menu</mat-icon>
            </button>
          }
          <span class="text-sm font-medium tracking-wide">CONFORMITAS 3.0 — AUDIN/TJCE</span>
          <span class="flex-1"></span>
          @if (auth.user(); as user) {
            <span class="text-xs text-gray-300 mr-2 hidden sm:inline">{{ user.nome }}</span>
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-white" aria-label="Menu do usuário">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <div class="px-4 py-2 text-xs text-text-sec" disabled>
                <div class="font-medium text-text-main">{{ user.nome }}</div>
                <div>{{ user.cargo }}</div>
                <div class="mt-1">
                  @for (role of auth.userRoles(); track role) {
                    <mat-chip class="text-xs !h-5">{{ role }}</mat-chip>
                  }
                </div>
              </div>
              <mat-divider />
              <button mat-menu-item (click)="auth.logout()">
                <mat-icon>logout</mat-icon>
                Sair
              </button>
            </mat-menu>
          }
        </mat-toolbar>

        <main class="p-6 max-w-[1200px] mx-auto">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .active-link { background: rgba(255,255,255,0.12) !important; }
  `],
})
export class MainLayoutComponent {
  protected readonly auth: AuthService;
  readonly isMobile = signal(typeof window !== 'undefined' ? window.innerWidth < 1024 : false);

  readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Planos / Aprovação', icon: 'check_circle', route: '/planos-aprovacao', roles: ['P01', 'P03'] },
    { label: 'Monitoramento', icon: 'monitor_heart', route: '/painel-monitoramento', roles: ['P01', 'P06'] },
    { label: 'Recomendações', icon: 'recommend', route: '/recomendacoes' },
    { label: 'Auditorias', icon: 'search', route: '/auditorias' },
    { label: 'Matriz Priorização', icon: 'priority_high', route: '/matriz-priorizacao' },
    { label: 'Perfis', icon: 'admin_panel_settings', route: '/perfis', roles: ['P10'] },
    { label: 'Mandatos', icon: 'gavel', route: '/mandatos', roles: ['P01', 'P03', 'P04'] },
    { label: 'Configurações', icon: 'settings', route: '/configuracoes', roles: ['P10'] },
    { label: 'Achados', icon: 'warning', route: '/achados' },
    { label: 'Relatórios', icon: 'picture_as_pdf', route: '/relatorios' },
    { label: 'Relatório Anual', icon: 'insights', route: '/relatorios-anuais' },
    { label: 'Usuários', icon: 'people', route: '/usuarios', roles: ['P10'] },
  ];

  constructor(auth: AuthService) {
    this.auth = auth;
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isMobile.set(window.innerWidth < 1024);
      });
    }
  }

  visibleNavItems() {
    return this.allNavItems.filter(
      (item) => !item.roles || this.auth.hasAnyRole(item.roles),
    );
  }
}
