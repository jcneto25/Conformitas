import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Breadcrumb {
  label: string;
  route?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <div class="mb-6">
      @if (breadcrumbs && breadcrumbs.length > 0) {
        <nav class="flex items-center gap-1 text-sm text-text-sec mb-1">
          @for (crumb of breadcrumbs; track $index; let last = $last) {
            @if (!last && crumb.route) {
              <a [routerLink]="crumb.route" class="hover:text-primary transition-colors">{{ crumb.label }}</a>
            } @else {
              <span>{{ crumb.label }}</span>
            }
            @if (!last) {
              <mat-icon class="text-base text-text-sec">chevron_right</mat-icon>
            }
          }
        </nav>
      }
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-text-main m-0">{{ title }}</h1>
        <div class="flex items-center gap-2">
          <ng-content select="[actions]" />
        </div>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() breadcrumbs: Breadcrumb[] = [];
}
