import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAchadoRepository, ACHADO_REPOSITORY } from '../repositories/achado.repository';
import { Achado } from '../domain/achado.entity';
import { CreateAchadoDto } from '../dto/create-achado.dto';
import * as crypto from 'crypto';

@Injectable()
export class CriarAchadoUseCase {
  constructor(@Inject(ACHADO_REPOSITORY) private readonly repo: IAchadoRepository) {}

  async execute(auditoriaId: string, dto: CreateAchadoDto, autorId: string) {
    const auditoria = await this.repo.findUnique(auditoriaId);
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO') {
      throw new BadRequestException('Achados só podem ser criados em auditorias EM_EXECUCAO');
    }

    const count = await this.repo.count({ where: { auditoriaId } });

    const codigo = `ACH-${count + 1}`;
    const entity = Achado.criar({
      id: crypto.randomUUID(),
      auditoriaId,
      codigo,
      tipo: dto.tipo,
      situacaoEncontrada: dto.situacaoEncontrada,
      criterio: dto.criterio,
      causa: dto.causa,
      efeito: dto.efeito,
      evidenciaIds: dto.evidenciaIds ?? [],
      autorId,
    });

    return this.repo.create({
      id: entity.id,
      auditoriaId: entity.auditoriaId,
      codigo: entity.codigo,
      tipo: entity.tipo,
      situacaoEncontrada: entity.situacaoEncontrada,
      criterio: entity.criterio,
      causa: entity.causa,
      efeito: entity.efeito,
      status: entity.status,
      evidenciaIds: entity.evidenciaIds,
      autorId: entity.autorId,
    });
  }
}
