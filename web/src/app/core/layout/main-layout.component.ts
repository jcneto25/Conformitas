import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { filter, map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { AuthService } from '../services/auth.service';
import { DensityService } from '../services/density.service';
import { environment } from '../../../environments/environment';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

interface Crumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  host: { '[class]': 'density.className()' },
  imports: [
    RouterModule, MatToolbarModule, MatSidenavModule,
    MatListModule, MatIconModule, MatButtonModule,
    MatDividerModule, MatMenuModule, MatChipsModule,
    MatBadgeModule, MatTooltipModule, MatSlideToggleModule,
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
                <mat-icon aria-hidden="true" matListItemIcon class="text-gray-400">{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
              </a>
            }
          </mat-nav-list>

          <!-- Density toggle (Design_System_Master §3.3) -->
          <mat-divider class="border-gray-600" />
          <div class="px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-gray-400">Modo compacto</span>
            <mat-slide-toggle
              [checked]="density.isCompact()"
              (toggleChange)="density.toggle()"
              color="primary"
              class="!m-0"
              aria-label="Alternar densidade">
            </mat-slide-toggle>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="bg-primary-dark text-white h-14 px-4 sticky top-0 z-10 gap-2">
          @if (isMobile()) {
            <button mat-icon-button (click)="sidenav.toggle()" class="text-white" aria-label="Abrir menu">
              <mat-icon aria-hidden="true">menu</mat-icon>
            </button>
          }

          <!-- Breadcrumb dinâmico (DESIGN_SYSTEM §5.4) -->
          <nav
            class="flex items-center gap-1 text-sm overflow-hidden flex-1 min-w-0"
            aria-label="Trilha de navegação">
            @for (crumb of breadcrumbs(); track crumb.label + '-' + $index; let last = $last) {
              @if (!last && crumb.route) {
                <a
                  [routerLink]="crumb.route"
                  class="text-white/70 hover:text-white transition-colors truncate">
                  {{ crumb.label }}
                </a>
              } @else {
                <span class="text-white font-medium truncate">{{ crumb.label }}</span>
              }
              @if (!last) {
                <mat-icon aria-hidden="true" class="text-base text-white/40 flex-shrink-0">chevron_right</mat-icon>
              }
            }
          </nav>

          <!-- Badge de notificações: recomendações vencidas (§4.10) -->
          <button
            mat-icon-button
            class="text-white"
            aria-label="Recomendações vencidas"
            [matTooltip]="notifTooltip()"
            (click)="goToNotifications()">
            <mat-icon aria-hidden="true"
              [matBadge]="notifCount()"
              [matBadgeHidden]="!notifCount()"
              matBadgeColor="warn"
              matBadgeSize="small"
              matBadgeOverlap>
              notifications
            </mat-icon>
          </button>

          <!-- Indicador de perfil ativo sempre visível (§5.5) -->
          @if (primaryRole(); as role) {
            <mat-chip class="!h-6 text-xs bg-white/15 text-white border-0 !shadow-none">
              <mat-icon aria-hidden="true" matChipAvatar class="text-sm">shield</mat-icon>
              {{ role }}
            </mat-chip>
          }

          @if (auth.user(); as user) {
            <span class="text-xs text-white/70 hidden md:inline ml-1 truncate max-w-[160px]">{{ user.nome }}</span>
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-white" aria-label="Menu do usuário">
              <mat-icon aria-hidden="true">account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <div class="px-4 py-2 text-xs text-text-sec" disabled>
                <div class="font-medium text-text-main">{{ user.nome }}</div>
                <div>{{ user.cargo }}</div>
                <div class="mt-1 flex flex-wrap gap-1">
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
  protected readonly auth = inject(AuthService);
  protected readonly density = inject(DensityService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  /** Responsividade via BreakpointObserver (MatCDK) — mais robusto que listener de resize. */
  readonly isMobile = toSignal(
    inject(BreakpointObserver).observe('(max-width: 1023px)').pipe(map((r) => r.matches)),
    { initialValue: typeof window !== 'undefined' ? window.innerWidth < 1024 : false },
  );

  readonly allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Dashboard PAA', icon: 'bar_chart', route: '/dashboard/paa', roles: ['P01', 'P02', 'P03'] },
    { label: 'Dashboard Recomendações', icon: 'assignment_late', route: '/dashboard/recomendacoes', roles: ['P01', 'P02', 'P06'] },
    { label: 'Planos / Aprovação', icon: 'check_circle', route: '/planos-aprovacao', roles: ['P01', 'P03'] },
    { label: 'Monitoramento', icon: 'monitor_heart', route: '/painel-monitoramento', roles: ['P01', 'P06'] },
    { label: 'Recomendações', icon: 'recommend', route: '/recomendacoes' },
    { label: 'Auditorias', icon: 'search', route: '/auditorias' },
    { label: 'Matriz Priorização', icon: 'priority_high', route: '/matriz-priorizacao' },
    { label: 'Perfis', icon: 'admin_panel_settings', route: '/perfis', roles: ['P10'] },
    { label: 'Mandatos', icon: 'gavel', route: '/mandatos', roles: ['P01', 'P03', 'P04'] },
    { label: 'Integrações', icon: 'link', route: '/integracoes', roles: ['P01', 'P10'] },
    { label: 'Ações Coordenadas', icon: 'handshake', route: '/acoes-coordenadas', roles: ['P01', 'P08'] },
    { label: 'Configurações', icon: 'settings', route: '/configuracoes', roles: ['P10'] },
    { label: 'Achados', icon: 'warning', route: '/achados' },
    { label: 'Relatórios', icon: 'picture_as_pdf', route: '/relatorios' },
    { label: 'Relatório Anual', icon: 'insights', route: '/relatorios-anuais' },
    { label: 'Usuários', icon: 'people', route: '/usuarios', roles: ['P10'] },
  ];

  /** Mapa rota → label, para derivar o breadcrumb da URL atual. */
  private readonly routeLabels: Record<string, string> = Object.fromEntries(
    this.allNavItems.map((i) => [i.route, i.label]),
  );

  /** URL atual (pós-redirects), como signal. */
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: '/' },
  );

  /** Breadcrumb derivado da rota: módulos mapeados + "Detalhe"/"Novo" para segmentos dinâmicos. */
  readonly breadcrumbs = computed<Crumb[]>(() => {
    const url = this.currentUrl().split('?')[0];
    const segs = url.split('/').filter(Boolean);
    const crumbs: Crumb[] = [];
    let acc = '';
    for (const seg of segs) {
      acc += '/' + seg;
      const label = this.routeLabels[acc];
      if (label) {
        crumbs.push({ label, route: acc });
      } else {
        // Segmento dinâmico (id, "novo", ...) sob um pai mapeado.
        crumbs.push({ label: seg === 'novo' ? 'Novo' : 'Detalhe' });
      }
    }
    if (crumbs.length === 0) crumbs.push({ label: 'Dashboard', route: '/dashboard' });
    // Último item não é clicável.
    crumbs[crumbs.length - 1].route = undefined;
    return crumbs;
  });

  /** Primeiro perfil do usuário, para o chip sempre-visível no topbar. */
  readonly primaryRole = computed(() => this.auth.userRoles()[0] ?? null);

  readonly notifCount = signal(0);
  readonly notifTooltip = computed(() =>
    this.notifCount() > 0
      ? `${this.notifCount()} recomendação(ões) vencida(s)`
      : 'Sem recomendações vencidas',
  );

  constructor() {
    void this.loadNotifications();
  }

  private async loadNotifications(): Promise<void> {
    try {
      const recs = await firstValueFrom(this.http.get<any[]>(`${environment.apiUrl}/recomendacoes`));
      const today = new Date();
      const overdue = recs.filter(
        (r) => r.prazo && new Date(r.prazo) < today && r.status !== 'CUMPRIDA',
      );
      this.notifCount.set(overdue.length);
    } catch {
      // Stub silencioso — a API pode estar indisponível em alguns perfis.
    }
  }

  goToNotifications(): void {
    this.router.navigate(['/recomendacoes']);
  }

  visibleNavItems = computed(() =>
    this.allNavItems.filter((item) => !item.roles || this.auth.hasAnyRole(item.roles)),
  );
}
