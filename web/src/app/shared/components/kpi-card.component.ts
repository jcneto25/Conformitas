import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export type KpiAccent = 'primary' | 'success' | 'warning' | 'critical' | 'info';

/**
 * KPI card reutilizável (DESIGN_SYSTEM §5.6 / §8.3 — Epic E1).
 * Mostra valor + rótulo + ícone opcional + variação % (tendência) opcional.
 * Substitui o markup de KPI duplicado inline nos 3 dashboards.
 */
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <mat-card class="shadow-sm rounded-xl border-t-4 overflow-hidden" [class]="cardClass">
      <mat-card-content class="p-5">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-3xl font-bold text-text-main leading-tight">
              @if (loading) {
                <span class="inline-block h-7 w-20 bg-gray-200 rounded animate-pulse align-middle"></span>
              } @else {
                {{ value }}
              }
            </div>
            <div class="text-text-sec text-sm mt-1 truncate">{{ label }}</div>
            @if (sub) {
              <div class="text-text-sec text-xs mt-0.5">{{ sub }}</div>
            }
            @if (delta !== null && delta !== undefined) {
              <div class="mt-2 inline-flex items-center gap-1 text-xs font-semibold" [class]="deltaClass">
                <mat-icon class="text-sm" aria-hidden="true">{{ delta! >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
                {{ delta! > 0 ? '+' : '' }}{{ delta }}%
                @if (deltaLabel) {
                  <span class="text-text-sec font-normal ml-1">{{ deltaLabel }}</span>
                }
              </div>
            }
          </div>
          @if (icon) {
            <mat-icon class="text-3xl flex-shrink-0" [class]="iconClass" aria-hidden="true">{{ icon }}</mat-icon>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class KpiCardComponent {
  @Input() label = '';
  @Input() value: string | number = '';
  @Input() icon = '';
  @Input() accent: KpiAccent = 'primary';
  /** Variação percentual (ex: 12 = +12%). Omitir para não exibir tendência. */
  @Input() delta: number | null = null;
  @Input() deltaLabel = '';
  @Input() sub = '';
  @Input() loading = false;

  private readonly accentMap: Record<KpiAccent, string> = {
    primary: 'border-primary',
    success: 'border-success',
    warning: 'border-warning',
    critical: 'border-critical',
    info: 'border-info',
  };
  private readonly iconColorMap: Record<KpiAccent, string> = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
    info: 'text-info',
  };

  get cardClass(): string {
    return this.accentMap[this.accent] ?? 'border-primary';
  }
  get iconClass(): string {
    return this.iconColorMap[this.accent] ?? 'text-primary';
  }
  get deltaClass(): string {
    return (this.delta ?? 0) >= 0 ? 'text-success' : 'text-critical';
  }
}
