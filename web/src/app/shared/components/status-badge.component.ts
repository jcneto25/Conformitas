import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  APROVADO: { bg: 'bg-success-bg', text: 'text-success' },
  PUBLICADO: { bg: 'bg-success-bg', text: 'text-success' },
  CUMPRIDA: { bg: 'bg-success-bg', text: 'text-success' },
  CONSOLIDADO: { bg: 'bg-success-bg', text: 'text-success' },
  ATIVO: { bg: 'bg-success-bg', text: 'text-success' },
  CORRIGIDA: { bg: 'bg-success-bg', text: 'text-success' },
  ABERTA: { bg: 'bg-info-bg', text: 'text-info' },
  RASCUNHO: { bg: 'bg-info-bg', text: 'text-info' },
  EM_EXECUCAO: { bg: 'bg-info-bg', text: 'text-info' },
  EM_MANIFESTACAO: { bg: 'bg-info-bg', text: 'text-info' },
  EM_CORRECAO: { bg: 'bg-info-bg', text: 'text-info' },
  EM_ANDAMENTO: { bg: 'bg-info-bg', text: 'text-info' },
  SUBMETIDO: { bg: 'bg-warning-bg', text: 'text-warning' },
  PENDENTE: { bg: 'bg-warning-bg', text: 'text-warning' },
  PRELIMINAR: { bg: 'bg-warning-bg', text: 'text-warning' },
  VENCIDA: { bg: 'bg-critical-bg', text: 'text-critical' },
  SUSPENSA: { bg: 'bg-critical-bg', text: 'text-critical' },
  INATIVO: { bg: 'bg-background', text: 'text-text-sec' },
};

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
          [class]="style.bg + ' ' + style.text">
      {{ label || status }}
    </span>
  `,
})
export class StatusBadgeComponent {
  @Input() status = '';
  @Input() label = '';

  get style() {
    return STATUS_STYLES[this.status?.toUpperCase()] || STATUS_STYLES['INATIVO'];
  }
}
