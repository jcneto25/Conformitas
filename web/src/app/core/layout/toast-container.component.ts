import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="toast.type" role="alert">
          <mat-icon class="toast-icon">{{ iconFor(toast.type) }}</mat-icon>
          <span class="toast-message">{{ toast.message }}</span>
          <button mat-icon-button class="toast-close" (click)="toastService.dismiss(toast.id)">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 420px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      color: #fff;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      animation: slideIn 0.25s ease-out;
    }

    .toast.error { background: #c62828; }
    .toast.warning { background: #e65100; }
    .toast.info { background: #1565c0; }

    .toast-icon { flex-shrink: 0; }
    .toast-message { flex: 1; }
    .toast-close {
      flex-shrink: 0;
      color: #fff !important;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class ToastContainerComponent {
  iconFor(type: string): string {
    const map: Record<string, string> = { error: 'error', warning: 'warning', info: 'info' };
    return map[type] || 'info';
  }

  constructor(readonly toastService: ToastService) {}
}
