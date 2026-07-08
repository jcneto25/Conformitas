import { AchadoStatus } from '../achado-status';

export class TransicaoStatusInvalidaError extends Error {
  constructor(atual: AchadoStatus, destino: AchadoStatus) {
    super(`Transição inválida: ${atual} → ${destino}`);
    this.name = 'TransicaoStatusInvalidaError';
  }
}
