import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAchadoRepository, ACHADO_REPOSITORY } from '../repositories/achado.repository';
import { Achado } from '../domain/achado.entity';
import { AchadoStatus } from '../domain/achado-status';
import { RESSALVA_SEM_MANIFESTACAO } from '../achados.service';

@Injectable()
export class ConsolidarAchadoUseCase {
  constructor(@Inject(ACHADO_REPOSITORY) private readonly repo: IAchadoRepository) {}

  async execute(id: string, ressalva?: string) {
    const data = await this.repo.findUnique(id);
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

    entity.consolidar(ressalva);

    return this.repo.update(id, {
      status: entity.status,
      ressalva: entity.ressalva,
    });
  }

  async consolidarExpirados() {
    const expirados = await this.repo.findMany({
      where: {
        status: 'EM_MANIFESTACAO',
        dataLimiteManifestacao: { lte: new Date() },
      },
    });
    for (const a of expirados) {
      const entity = new Achado(
        a.id,
        a.auditoriaId,
        a.codigo,
        a.status as AchadoStatus,
        a.tipo,
        a.situacaoEncontrada,
        a.criterio,
        a.causa,
        a.efeito,
        a.evidenciaIds ?? [],
        a.autorId,
        a.dataLimiteManifestacao,
        a.ressalva,
      );
      entity.consolidar(RESSALVA_SEM_MANIFESTACAO);
      await this.repo.update(a.id, { status: entity.status, ressalva: entity.ressalva });
    }
    return { consolidados: expirados.length };
  }
}
