import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { IAvaliacaoRepository, AVALIACAO_REPOSITORY } from './repositories/avaliacao.repository';
import { INaoConformidadeRepository, NAO_CONFORMIDADE_REPOSITORY } from './repositories/nao-conformidade.repository';
import { IIndicadorRepository, INDICADOR_REPOSITORY } from './repositories/indicador.repository';
@Injectable()
export class QualidadeService {
  private readonly logger = new Logger(QualidadeService.name);
  constructor(
    @Inject(AVALIACAO_REPOSITORY) private readonly avaliacaoRepo: IAvaliacaoRepository,
    @Inject(NAO_CONFORMIDADE_REPOSITORY) private readonly ncRepo: INaoConformidadeRepository,
    @Inject(INDICADOR_REPOSITORY) private readonly indicadorRepo: IIndicadorRepository,
  ) {}

  async createAvaliacao(dto: any, autorId: string) {
    return this.avaliacaoRepo.create({ ...dto, autorId, status: 'EM_ANDAMENTO' });
  }
  async listarAvaliacoes(filters?: any) {
    const where: any = {};
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.status) where.status = filters.status;
    return this.avaliacaoRepo.findMany({ where, orderBy: { createdAt: 'desc' }, include: { naoConformidades: true } });
  }
  async buscarAvaliacao(id: string) {
    const a = await this.avaliacaoRepo.findUnique(id);
    if (!a) throw new NotFoundException('Avaliação não encontrada');
    return a;
  }
  async atualizarAvaliacao(id: string, dto: any) {
    await this.buscarAvaliacao(id);
    return this.avaliacaoRepo.update(id, dto);
  }
  async concluirAvaliacao(id: string) {
    await this.buscarAvaliacao(id);
    return this.avaliacaoRepo.update(id, { status: 'CONCLUIDA', dataConclusao: new Date() });
  }
  async homologarAvaliacao(id: string, homologadoPor: string) {
    await this.buscarAvaliacao(id);
    return this.avaliacaoRepo.update(id, { status: 'HOMOLOGADA', homologadoPor });
  }
  async criarNaoConformidade(avaliacaoId: string, dto: any) {
    await this.buscarAvaliacao(avaliacaoId);
    return this.ncRepo.create({ ...dto, avaliacaoId });
  }
  async listarNaoConformidades(avaliacaoId?: string) {
    const where: any = {};
    if (avaliacaoId) where.avaliacaoId = avaliacaoId;
    return this.ncRepo.findMany({ where, orderBy: { createdAt: 'desc' } });
  }
  async buscarNaoConformidade(id: string) {
    const nc = await this.ncRepo.findUnique(id);
    if (!nc) throw new NotFoundException('Não conformidade não encontrada');
    return nc;
  }
  async registrarAcaoCorretiva(id: string, dto: any) {
    await this.buscarNaoConformidade(id);
    return this.ncRepo.update(id, { ...dto, status: 'EM_ANDAMENTO' });
  }
  async concluirNaoConformidade(id: string) {
    await this.buscarNaoConformidade(id);
    return this.ncRepo.update(id, { status: 'CONCLUIDA', dataConclusao: new Date() });
  }
  async criarIndicador(dto: any) {
    return this.indicadorRepo.create(dto);
  }
  async listarIndicadores() {
    return this.indicadorRepo.findMany({ orderBy: { nome: 'asc' } });
  }
  async atualizarIndicador(id: string, dto: any) {
    return this.indicadorRepo.update(id, dto);
  }
}
