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
  private readonly DURATION_MS = 8000;

  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: Toast['type'] = 'error') {
    const id = this.nextId++;
    this.toasts.update(t => [...t, { id, message, type, timestamp: Date.now() }]);

    setTimeout(() => this.dismiss(id), this.DURATION_MS);
  }

  dismiss(id: number) {
    this.toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
