import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY } from '../repositories/auditoria.repository';
import { Auditoria } from '../domain/auditoria.entity';
import { AuditoriaStatus } from '../domain/auditoria-status';

@Injectable()
export class IniciarExecucaoUseCase {
  constructor(@Inject(AUDITORIA_REPOSITORY) private readonly repo: IAuditoriaRepository) {}

  async execute(id: string) {
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

    entity.iniciarExecucao();

    return this.repo.update(id, {
      status: entity.status,
      dataInicio: entity.dataInicio,
    });
  }
}
