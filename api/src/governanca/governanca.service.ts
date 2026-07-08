import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { IDeterminacaoRepository, DETERMINACAO_REPOSITORY } from './repositories/determinacao.repository';
import { IRegistroFraudeRepository, REGISTRO_FRAUDE_REPOSITORY } from './repositories/registro-fraude.repository';
@Injectable()
export class GovernancaService {
  private readonly logger = new Logger(GovernancaService.name);
  constructor(
    @Inject(DETERMINACAO_REPOSITORY) private readonly detRepo: IDeterminacaoRepository,
    @Inject(REGISTRO_FRAUDE_REPOSITORY) private readonly fraudeRepo: IRegistroFraudeRepository,
  ) {}
  async createDeterminacao(dto: any) {
    return this.detRepo.create(dto);
  }
  async listarDeterminacoes(filters?: any) {
    const where: any = {};
    if (filters?.orgao) where.orgao = filters.orgao;
    if (filters?.status) where.status = filters.status;
    return this.detRepo.findMany({ where, orderBy: { dataRecebimento: 'desc' } });
  }
  async buscarDeterminacao(id: string) {
    const d = await this.detRepo.findUnique(id);
    if (!d) throw new NotFoundException('Determinação não encontrada');
    return d;
  }
  async atualizarDeterminacao(id: string, dto: any) {
    await this.buscarDeterminacao(id);
    return this.detRepo.update(id, dto);
  }
  async concluirDeterminacao(id: string) {
    await this.buscarDeterminacao(id);
    return this.detRepo.update(id, { status: 'CONCLUIDA', dataCumprimento: new Date() });
  }
  async createRegistroFraude(dto: any) {
    return this.fraudeRepo.create(dto);
  }
  async listarRegistrosFraude(filters?: any) {
    const where: any = {};
    if (filters?.classificacao) where.classificacao = filters.classificacao;
    if (filters?.auditoriaId) where.auditoriaId = filters.auditoriaId;
    return this.fraudeRepo.findMany({ where, orderBy: { dataIdentificacao: 'desc' } });
  }
  async buscarRegistroFraude(id: string) {
    const f = await this.fraudeRepo.findUnique(id);
    if (!f) throw new NotFoundException('Registro de fraude não encontrado');
    return f;
  }
  async comunicar(id: string, dto: any) {
    await this.buscarRegistroFraude(id);
    return this.fraudeRepo.update(id, {
      comunicadoAs: new Date(),
      tipoComunicacao: dto.tipoComunicacao,
      orgaoComunicado: dto.orgaoComunicado,
    });
  }
  async verificarFraudes60Dias() {
    const hoje = new Date();
    const limite = new Date(hoje.getTime() - 60 * 24 * 60 * 60 * 1000);
    const pendentes = await this.fraudeRepo.findMany({ where: { comunicadoAs: null, createdAt: { lte: limite } } });
    return { pendentes: pendentes.length, registros: pendentes };
  }
}
