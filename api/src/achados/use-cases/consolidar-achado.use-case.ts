import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAchadoRepository, ACHADO_REPOSITORY } from '../repositories/achado.repository';
import { Achado } from '../domain/achado.entity';
import { AchadoStatus } from '../domain/achado-status';
import { RESSALVA_SEM_MANIFESTACAO } from '../domain/constants';

@Injectable()
export class ConsolidarAchadoUseCase {
  constructor(@Inject(ACHADO_REPOSITORY) private readonly repo: IAchadoRepository) {}

  async execute(id: string, ressalva?: string) {
    const achadoRaw = await this.repo.findUnique(id);
    if (!achadoRaw) throw new NotFoundException('Achado não encontrado');

    const entity = new Achado(
      achadoRaw.id,
      achadoRaw.auditoriaId,
      achadoRaw.codigo,
      achadoRaw.status as AchadoStatus,
      achadoRaw.tipo,
      achadoRaw.situacaoEncontrada,
      achadoRaw.criterio,
      achadoRaw.causa,
      achadoRaw.efeito,
      achadoRaw.evidenciaIds ?? [],
      achadoRaw.autorId,
      achadoRaw.dataLimiteManifestacao,
      achadoRaw.ressalva,
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
