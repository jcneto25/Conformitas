import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly DURATION_MS = 5000;
  private readonly MAX_TOASTS = 3;

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'error') {
    const id = this.nextId++;
    this.toasts.update(t => {
      const next = [...t, { id, message, type, timestamp: Date.now() }];
      return next.length > this.MAX_TOASTS ? next.slice(-this.MAX_TOASTS) : next;
    });

    setTimeout(() => this.dismiss(id), this.DURATION_MS);
  }

  dismiss(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
