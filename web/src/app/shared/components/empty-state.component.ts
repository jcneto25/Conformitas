import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type EmptyStateSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="flex flex-col items-center justify-center text-text-sec gap-2" [class]="containerClass">
      @if (icon) {
        <mat-icon class="flex-shrink-0" [class]="iconClass" aria-hidden="true">{{ icon }}</mat-icon>
      }
      @if (title) {
        <h3 class="font-semibold text-text-main m-0 text-center" [class]="titleClass">{{ title }}</h3>
      }
      @if (description) {
        <p class="m-0 text-center max-w-md" [class]="descriptionClass">{{ description }}</p>
      }
      @if (actionLabel) {
        <button mat-flat-button color="primary" (click)="action.emit()" class="mt-3">
          @if (actionIcon) {
            <mat-icon>{{ actionIcon }}</mat-icon>
          }
          {{ actionLabel }}
        </button>
      }
      <ng-content />
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = 'search_off';
  @Input() title = '';
  @Input() description = '';
  @Input() actionLabel = '';
  @Input() actionIcon = 'add';
  @Input() size: EmptyStateSize = 'md';

  @Output() action = new EventEmitter<void>();

  private readonly sizeMap: Record<EmptyStateSize, { container: string; icon: string; title: string; description: string }> = {
    sm: { container: 'py-6', icon: 'text-3xl', title: 'text-sm', description: 'text-xs' },
    md: { container: 'py-10', icon: 'text-5xl', title: 'text-lg', description: 'text-sm' },
    lg: { container: 'py-16', icon: 'text-7xl', title: 'text-xl', description: 'text-base' },
  };

  get containerClass(): string { return this.sizeMap[this.size]?.container ?? 'py-10'; }
  get iconClass(): string { return this.sizeMap[this.size]?.icon ?? 'text-5xl'; }
  get titleClass(): string { return this.sizeMap[this.size]?.title ?? 'text-lg'; }
  get descriptionClass(): string { return this.sizeMap[this.size]?.description ?? 'text-sm'; }
}
