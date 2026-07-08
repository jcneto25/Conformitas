import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAchadoRepository, ACHADO_REPOSITORY } from '../repositories/achado.repository';
import { Achado } from '../domain/achado.entity';
import { AchadoStatus } from '../domain/achado-status';
import { AchadoManifestacaoEvent } from '../../shared/events/auditoria-events';
import { PRAZO_MANIFESTACAO_DIAS_UTEIS } from '../achados.service';

@Injectable()
export class EnviarManifestacaoUseCase {
  constructor(
    @Inject(ACHADO_REPOSITORY) private readonly repo: IAchadoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(id: string, prazoDiasUteis?: number) {
    const data = await this.repo.findUnique(id, { include: { auditoria: true } });
    if (!data) throw new NotFoundException('Achado não encontrado');

    const entity = new Achado(
      data.id,
      data.auditoriaId,
      data.codigo,
      data.status as AchadoStatus,
      data.tipo,
      data.situacaoEncontrada,
      data.criterio,
      data.causa,
      data.efeito,
      data.evidenciaIds ?? [],
      data.autorId,
      data.dataLimiteManifestacao,
      data.ressalva,
    );

    const prazo = prazoDiasUteis ?? PRAZO_MANIFESTACAO_DIAS_UTEIS;
    entity.enviarManifestacao(prazo);

    const result = await this.repo.update(id, {
      status: entity.status,
      dataLimiteManifestacao: entity.dataLimiteManifestacao,
    });

    this.eventEmitter.emit(
      'achado.manifestacao',
      new AchadoManifestacaoEvent(
        entity.id,
        entity.codigo,
        data.auditoria?.unidadeAuditada ?? '',
        data.auditoriaId,
        prazo,
      ),
    );

    return result;
  }
}
