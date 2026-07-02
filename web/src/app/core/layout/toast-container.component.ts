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
        <div class="toast flex items-center gap-2 p-3 rounded-lg text-white text-sm shadow-lg animate-[slideIn_0.25s_ease-out]"
             [class.bg-critical]="toast.type === 'error'"
             [class.bg-warning]="toast.type === 'warning'"
             [class.bg-info]="toast.type === 'info'"
             [class.bg-success]="toast.type === 'success'"
             role="alert">
          <mat-icon class="flex-shrink-0">{{ iconFor(toast.type) }}</mat-icon>
          <span class="flex-1">{{ toast.message }}</span>
          <button mat-icon-button class="text-white! flex-shrink-0"
                  (click)="toastService.dismiss(toast.id)" aria-label="Fechar notificação">
            <mat-icon>close</mat-icon>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 420px;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `],
})
export class ToastContainerComponent {
  iconFor(type: string): string {
    const map: Record<string, string> = { error: 'error', warning: 'warning', info: 'info', success: 'check_circle' };
    return map[type] || 'info';
  }

  constructor(readonly toastService: ToastService) {}
}
