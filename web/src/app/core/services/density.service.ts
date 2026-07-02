import { Injectable, signal, computed, effect } from '@angular/core';

const STORAGE_KEY = 'conformitas_density';

@Injectable({ providedIn: 'root' })
export class DensityService {
  readonly isCompact = signal<boolean>(
    typeof window !== 'undefined'
      ? localStorage.getItem(STORAGE_KEY) === 'compact'
      : false,
  );

  readonly className = computed(() => (this.isCompact() ? 'app-compact' : ''));

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this.isCompact() ? 'compact' : 'comfortable');
    });
  }

  toggle(): void {
    this.isCompact.update((v) => !v);
  }
}
