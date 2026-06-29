import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
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
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <mat-sidenav mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <h2>CONFORMITAS</h2>
          <span class="version">3.0 SGI</span>
        </div>
        <mat-divider />
        <mat-nav-list>
          @for (item of visibleNavItems(); track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          <span>CONFORMITAS 3.0 — AUDIN/TJCE</span>
          <span class="toolbar-spacer"></span>
          <span class="user-name">{{ auth.user()?.nome }}</span>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item disabled>
              <mat-icon>badge</mat-icon>
              {{ auth.user()?.cargo }}
            </button>
            <button mat-menu-item disabled>
              <mat-icon>group</mat-icon>
              {{ auth.userRoles() }}
            </button>
            <mat-divider />
            <button mat-menu-item (click)="auth.logout()">
              <mat-icon>logout</mat-icon>
              Sair
            </button>
          </mat-menu>
        </mat-toolbar>
        <main class="main-content">
          <router-outlet />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .layout-container {
        height: 100vh;
      }

      .sidebar {
        width: 250px;
        background: #1a1a2e;
        color: #e0e0e0;
      }

      .sidebar-header {
        padding: 1.5rem 1rem 1rem;
        text-align: center;
      }

      .sidebar-header h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 1px;
      }

      .version {
        font-size: 0.75rem;
        color: #888;
      }

      .active-link {
        background: rgba(255, 255, 255, 0.1) !important;
      }

      .topbar {
        background: #16213e;
        color: #e0e0e0;
        position: sticky;
        top: 0;
        z-index: 10;
      }

      .toolbar-spacer {
        flex: 1 1 auto;
      }

      .user-name {
        font-size: 0.85rem;
        margin-right: 0.5rem;
        opacity: 0.85;
      }

      .main-content {
        padding: 2rem;
        background: #f5f5f5;
        min-height: calc(100vh - 64px);
      }
    `,
  ],
})
export class MainLayoutComponent {
  protected readonly auth: AuthService;

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
  }

  visibleNavItems() {
    return this.allNavItems.filter(
      (item) => !item.roles || this.auth.hasAnyRole(item.roles),
    );
  }
}
