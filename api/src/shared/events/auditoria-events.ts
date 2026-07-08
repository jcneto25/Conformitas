import { ConformitasEvent } from './conformitas-event';

export class AuditoriaAbertaEvent extends ConformitasEvent {
  constructor(
    auditoriaId: string,
    public readonly numero: string,
    public readonly unidadeAuditada: string,
  ) {
    super(auditoriaId, 'auditoria');
  }
}

export class AuditoriaSuspensaEvent extends ConformitasEvent {
  constructor(
    auditoriaId: string,
    public readonly numero: string,
    public readonly motivo: string,
  ) {
    super(auditoriaId, 'auditoria');
  }
}

export class AchadoManifestacaoEvent extends ConformitasEvent {
  constructor(
    achadoId: string,
    public readonly codigo: string,
    public readonly unidadeAuditada: string,
    public readonly auditoriaId: string,
    public readonly prazoDias: number,
  ) {
    super(achadoId, 'achado');
  }
}

export class ManifestacaoRegistradaEvent extends ConformitasEvent {
  constructor(
    achadoId: string,
    public readonly codigo: string,
    public readonly auditoriaId: string,
  ) {
    super(achadoId, 'achado');
  }
}
