import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';
import { Auditoria } from '../domain/auditoria.entity';
import { AuditoriaStatus } from '../domain/auditoria-status';

@Injectable()
export class ConcluirAuditoriaUseCase {
  constructor(@Inject(AUDITORIA_REPOSITORY) private readonly repo: IAuditoriaRepository) {}

  async execute(id: string) {
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

    entity.concluir();

    return this.repo.update(id, {
      status: entity.status,
      dataFimReal: entity.dataFimReal,
    });
  }
}
