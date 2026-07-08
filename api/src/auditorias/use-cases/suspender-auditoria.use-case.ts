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
    const data = await this.repo.findUnique(id);
    if (!data) throw new NotFoundException('Auditoria não encontrada');

    const entity = new Auditoria(
      data.id,
      data.numero,
      data.status as AuditoriaStatus,
      data.unidadeAuditada,
      data.objetivo,
      data.itemPlanoId,
      data.tipo,
      data.forma,
      data.sigilosa,
      data.escopo,
      data.dataFimPrevista,
      data.dataInicio,
      data.dataFimReal,
      data.motivoSuspensao,
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
