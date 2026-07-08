import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAchadoRepository,
  ACHADO_REPOSITORY,
  IManifestacaoRepository,
  MANIFESTACAO_REPOSITORY,
} from '../repositories/achado.repository';
import { ManifestacaoRegistradaEvent } from '../../shared/events/auditoria-events';
import { CreateManifestacaoDto } from '../dto/create-manifestacao.dto';

@Injectable()
export class RegistrarManifestacaoUseCase {
  constructor(
    @Inject(ACHADO_REPOSITORY) private readonly achadoRepo: IAchadoRepository,
    @Inject(MANIFESTACAO_REPOSITORY) private readonly manifestacaoRepo: IManifestacaoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(achadoId: string, manifestacaoDto: CreateManifestacaoDto, autorId: string, unidadeEscopo?: string | null) {
    const achado = await this.achadoRepo.findUnique(achadoId, { include: { auditoria: true } });
    if (!achado) throw new NotFoundException('Achado não encontrado');
    if (achado.status !== 'EM_MANIFESTACAO') {
      throw new BadRequestException('Apenas achados EM_MANIFESTACAO podem receber manifestação');
    }
    if (unidadeEscopo && achado.auditoria?.unidadeAuditada !== unidadeEscopo) {
      throw new ForbiddenException('Você não pode manifestar sobre achados de outra unidade');
    }

    const result = await this.manifestacaoRepo.create({
      achadoId,
      autorId,
      conteudo: manifestacaoDto.conteudo,
    });

    this.eventEmitter.emit(
      'achado.manifestacao.registrada',
      new ManifestacaoRegistradaEvent(achadoId, achado.codigo, achado.auditoriaId),
    );

    return result;
  }
}
