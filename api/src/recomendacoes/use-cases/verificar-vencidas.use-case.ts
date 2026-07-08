import { Injectable, Inject } from '@nestjs/common';
import { IRecomendacaoRepository, RECOMENDACAO_REPOSITORY } from '../repositories/recomendacao.repository';

@Injectable()
export class VerificarVencidasUseCase {
  constructor(@Inject(RECOMENDACAO_REPOSITORY) private readonly repo: IRecomendacaoRepository) {}

  async execute() {
    const vencidas = await this.repo.findMany({ where: { status: 'PENDENTE', prazo: { lte: new Date() } } });
    for (const r of vencidas) await this.repo.update(r.id, { status: 'VENCIDA' });
    return { vencidas: vencidas.length };
  }
}
