import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  template: `
    <mat-sidenav-container class="layout-container">
      <!-- Sidebar -->
      <mat-sidenav mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <h2>CONFORMITAS</h2>
          <span class="version">3.0 SGI</span>
        </div>
        <mat-divider />
        <mat-nav-list>
          @for (item of navItems; track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active-link">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>

      <!-- Content -->
      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          <span>CONFORMITAS 3.0 — AUDIN/TJCE</span>
          <span class="toolbar-spacer"></span>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
          <button mat-icon-button (click)="logout()">
            <mat-icon>logout</mat-icon>
          </button>
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

      .main-content {
        padding: 2rem;
        background: #f5f5f5;
        min-height: calc(100vh - 64px);
      }
    `,
  ],
})
export class MainLayoutComponent {
  navItems: NavItem[] = [];

  logout() {
    // Placeholder — será implementado no PRP-001
    console.log('Logout pendente — PRP-001');
  }
}
