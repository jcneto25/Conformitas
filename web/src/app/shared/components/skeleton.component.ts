import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-3" [class]="type === 'card' ? 'p-4 bg-surface rounded-lg shadow-sm' : ''">
      @if (type === 'table-row') {
        @for (row of rowsArr; track $index) {
          <div class="flex gap-4">
            @for (col of colsArr; track $index) {
              <div class="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
            }
          </div>
        }
      } @else if (type === 'card') {
        <div class="h-5 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      } @else {
        <div class="h-4 bg-gray-200 rounded animate-pulse w-full mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-5/6 mb-2"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
      }
    </div>
  `,
})
export class SkeletonComponent {
  @Input() type: 'text' | 'card' | 'table-row' = 'text';
  @Input() rows = 5;
  @Input() cols = 4;

  get rowsArr() { return Array(this.rows); }
  get colsArr() { return Array(this.cols); }
}
