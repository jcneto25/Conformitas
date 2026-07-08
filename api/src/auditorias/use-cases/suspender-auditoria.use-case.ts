import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';
import { Auditoria } from '../domain/auditoria.entity';
import { AuditoriaStatus } from '../domain/auditoria-status';
import { AuditoriaSuspensaEvent } from '../../shared/events/auditoria-events';

@Injectable()
export class SuspenderAuditoriaUseCase {
  constructor(
    @Inject(AUDITORIA_REPOSITORY) private readonly repo: IAuditoriaRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, motivo: string) {
    const auditoriaRaw = await this.repo.findUnique(id);
    if (!auditoriaRaw) throw new NotFoundException('Auditoria não encontrada');

    const entity = new Auditoria(
      auditoriaRaw.id,
      auditoriaRaw.numero,
      auditoriaRaw.status as AuditoriaStatus,
      auditoriaRaw.unidadeAuditada,
      auditoriaRaw.objetivo,
      auditoriaRaw.itemPlanoId,
      auditoriaRaw.tipo,
      auditoriaRaw.forma,
      auditoriaRaw.sigilosa,
      auditoriaRaw.escopo,
      auditoriaRaw.dataFimPrevista,
      auditoriaRaw.dataInicio,
      auditoriaRaw.dataFimReal,
      auditoriaRaw.motivoSuspensao,
    );

    entity.suspender(motivo);

    const result = await this.repo.update(id, {
      status: entity.status,
      motivoSuspensao: entity.motivoSuspensao,
    });

    this.eventEmitter.emit('auditoria.suspensa', new AuditoriaSuspensaEvent(entity.id, entity.numero, motivo));

    return result;
  }
}
