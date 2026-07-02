import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutSegment extends DonutSlice {
  /** comprimento do arco (fração × circunferência) */
  len: number;
  /** soma dos arcos anteriores (início do segmento) */
  offset: number;
  pct: number;
}

/**
 * Donut chart em SVG puro, sem dependências (DESIGN_SYSTEM §5.6 — Epic E2).
 * Cada fatia é um <circle> com stroke-dasharray (comprimento do arco) e
 * stroke-dashoffset negativo (início acumulado). SVG rotacionado -90° para
 * começar no topo (12h) e preencher no sentido horário.
 */
@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-5 flex-wrap">
      <div class="relative flex-shrink-0" [style.width.px]="size" [style.height.px]="size">
        <svg
          [attr.viewBox]="'0 0 ' + size + ' ' + size"
          [style.transform]="'rotate(-90deg)'"
          style="transform-origin: center;"
          [attr.width]="size" [attr.height]="size">
          <circle
            [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
            fill="none" stroke="#eaecf0" [attr.stroke-width]="thickness" />
          @for (s of segments; track s.label) {
            <circle
              [attr.cx]="size / 2" [attr.cy]="size / 2" [attr.r]="radius"
              fill="none" [attr.stroke]="s.color" [attr.stroke-width]="thickness"
              [attr.stroke-dasharray]="s.len + ' ' + circumference"
              [attr.stroke-dashoffset]="-s.offset" />
          }
        </svg>
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-text-main leading-none">{{ total }}</span>
          <span class="text-text-sec text-xs mt-1">{{ centerLabel }}</span>
        </div>
      </div>

      @if (showLegend) {
        <ul class="flex flex-col gap-1.5 text-sm m-0 p-0 list-none">
          @for (s of segments; track s.label) {
            <li class="flex items-center gap-2">
              <span class="inline-block w-3 h-3 rounded-sm flex-shrink-0" [style.background]="s.color" aria-hidden="true"></span>
              <span class="text-text-sec">{{ s.label }}</span>
              <span class="font-semibold text-text-main ml-auto pl-2">{{ s.value }}</span>
              <span class="text-text-sec text-xs w-10 text-right">{{ s.pct }}%</span>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class DonutChartComponent {
  @Input() data: DonutSlice[] = [];
  @Input() size = 180;
  @Input() thickness = 24;
  @Input() centerLabel = 'Total';
  @Input() showLegend = true;

  get total(): number {
    return this.data.reduce((sum, d) => sum + (d.value || 0), 0);
  }

  get radius(): number {
    return (this.size - this.thickness) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get segments(): DonutSegment[] {
    const total = this.total || 1;
    const circ = this.circumference;
    let acc = 0;
    return this.data
      .filter((d) => (d.value || 0) > 0)
      .map((d) => {
        const len = ((d.value || 0) / total) * circ;
        const seg: DonutSegment = {
          label: d.label,
          value: d.value || 0,
          color: d.color,
          len,
          offset: acc,
          pct: Math.round(((d.value || 0) / total) * 100),
        };
        acc += len;
        return seg;
      });
  }
}
