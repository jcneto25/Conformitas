import { Injectable, Inject } from '@nestjs/common';
import { IRecomendacaoRepository, RECOMENDACAO_REPOSITORY } from '../repositories/recomendacao.repository';

@Injectable()
export class EscalarVencidasUseCase {
  constructor(@Inject(RECOMENDACAO_REPOSITORY) private readonly repo: IRecomendacaoRepository) {}

  async execute() {
    const vencidas = await this.repo.findMany({ where: { status: 'VENCIDA', prioridade: 'ALTA' } });
    return { escaladas: vencidas.length };
  }
}
