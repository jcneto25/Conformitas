import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRequisicaoRepository, REQUISICAO_REPOSITORY } from './repositories/auditoria.repository';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';

@Injectable()
export class RequisicoesService {
  constructor(@Inject(REQUISICAO_REPOSITORY) private readonly repo: IRequisicaoRepository) {}

  async criar(auditoriaId: string, dto: CriarRequisicaoDto) {
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + dto.prazoDias);
    return this.repo.create({ auditoriaId, descricao: dto.descricao, prazo });
  }

  async listar(auditoriaId: string) {
    return this.repo.findMany({ where: { auditoriaId }, orderBy: { createdAt: 'desc' } });
  }
}
