import { AuditoriaStatus } from '../auditoria-status';

export class TransicaoStatusInvalidaError extends Error {
  constructor(statusAtual: AuditoriaStatus, destino: AuditoriaStatus) {
    super(`Transição inválida: ${statusAtual} → ${destino}`);
    this.name = 'TransicaoStatusInvalidaError';
  }
}
