import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarItem {
  label: string;
  value: number;
  color?: string;
}

/**
 * Bar chart vertical em CSS puro, sem dependências (DESIGN_SYSTEM §5.6 — Epic E2).
 * Barras escaladas ao maior valor; valores sobre as barras; rótulos embaixo.
 */
@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full">
      <div class="flex items-end justify-around gap-3" [style.height.px]="height">
        @for (b of bars; track b.label) {
          <div class="flex-1 flex flex-col items-center justify-end h-full min-w-0">
            <span class="text-sm font-semibold text-text-main mb-1">{{ b.value }}</span>
            <div
              class="w-full max-w-[56px] rounded-t-md transition-all"
              [style.height.%]="pct(b.value)"
              [style.background]="b.color || '#1a3a5c'"
              [attr.title]="b.label + ': ' + b.value"
              role="img">
            </div>
          </div>
        }
      </div>
      <div class="flex items-start justify-around gap-3 mt-2">
        @for (b of bars; track b.label) {
          <div class="flex-1 text-center text-xs text-text-sec truncate min-w-0" [title]="b.label">{{ b.label }}</div>
        }
      </div>
    </div>
  `,
})
export class BarChartComponent {
  @Input() data: BarItem[] = [];
  @Input() height = 180;

  get bars(): BarItem[] {
    return this.data;
  }

  get max(): number {
    return Math.max(1, ...this.data.map((d) => d.value || 0));
  }

  pct(value: number): number {
    return Math.round(((value || 0) / this.max) * 100);
  }
}
