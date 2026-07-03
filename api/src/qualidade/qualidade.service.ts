import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAvaliacaoDto, TipoAvaliacao } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { CreateNaoConformidadeDto, Severidade, StatusNaoConformidade } from './dto/create-nao-conformidade.dto';
import { UpdateNaoConformidadeDto } from './dto/update-nao-conformidade.dto';
import { CreateIndicadorDto } from './dto/create-indicador.dto';
import { UpdateIndicadorDto } from './dto/update-indicador.dto';

@Injectable()
export class QualidadeService {
  private readonly logger = new Logger(QualidadeService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── Avaliações de Qualidade ───────────────────

  async createAvaliacao(dto: CreateAvaliacaoDto, autorId: string) {
    const tiposValidos = Object.values(TipoAvaliacao);
    if (!tiposValidos.includes(dto.tipo)) {
      throw new BadRequestException(`Tipo inválido: ${dto.tipo}. Valores: ${tiposValidos.join(', ')}`);
    }

    return this.prisma.avaliacaoQualidade.create({
      data: {
        tipo: dto.tipo,
        periodoInicio: new Date(dto.periodoInicio),
        periodoFim: new Date(dto.periodoFim),
        resultado: dto.resultado ?? null,
        nota: dto.nota ?? null,
        status: 'RASCUNHO',
        homologadaPor: null,
      },
    });
  }

  async listarAvaliacoes(filters?: { tipo?: string; status?: string }) {
    const where: any = {};
    if (filters?.tipo) where.tipo = filters.tipo;
    if (filters?.status) where.status = filters.status;
    return this.prisma.avaliacaoQualidade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { naoConformidades: true },
    });
  }

  async buscarAvaliacao(id: string) {
    const avaliacao = await this.prisma.avaliacaoQualidade.findUnique({
      where: { id },
      include: { naoConformidades: true },
    });
    if (!avaliacao) throw new NotFoundException('Avaliação de qualidade não encontrada');
    return avaliacao;
  }

  async atualizarAvaliacao(id: string, dto: UpdateAvaliacaoDto) {
    const avaliacao = await this.buscarAvaliacao(id);
    if (avaliacao.status !== 'RASCUNHO') {
      throw new BadRequestException('Apenas avaliações em RASCUNHO podem ser editadas');
    }

    const data: any = {};
    if (dto.tipo !== undefined) data.tipo = dto.tipo;
    if (dto.periodoInicio !== undefined) data.periodoInicio = new Date(dto.periodoInicio);
    if (dto.periodoFim !== undefined) data.periodoFim = new Date(dto.periodoFim);
    if (dto.resultado !== undefined) data.resultado = dto.resultado;
    if (dto.nota !== undefined) data.nota = dto.nota;

    return this.prisma.avaliacaoQualidade.update({
      where: { id },
      data,
      include: { naoConformidades: true },
    });
  }

  async concluirAvaliacao(id: string) {
    const avaliacao = await this.buscarAvaliacao(id);
    if (avaliacao.status !== 'RASCUNHO') {
      throw new BadRequestException('Apenas avaliações em RASCUNHO podem ser concluídas');
    }

    return this.prisma.avaliacaoQualidade.update({
      where: { id },
      data: { status: 'CONCLUIDA' },
      include: { naoConformidades: true },
    });
  }

  async homologarAvaliacao(id: string, homologadoPor: string) {
    const avaliacao = await this.buscarAvaliacao(id);
    if (avaliacao.status !== 'CONCLUIDA') {
      throw new BadRequestException('Apenas avaliações CONCLUIDAS podem ser homologadas');
    }

    return this.prisma.avaliacaoQualidade.update({
      where: { id },
      data: { status: 'HOMOLOGADA', homologadaPor: homologadoPor },
      include: { naoConformidades: true },
    });
  }

  // ── Não Conformidades ─────────────────────────

  async criarNaoConformidade(avaliacaoId: string, dto: CreateNaoConformidadeDto) {
    const avaliacao = await this.buscarAvaliacao(avaliacaoId);

    return this.prisma.naoConformidade.create({
      data: {
        avaliacaoId,
        descricao: dto.descricao,
        normaReferencia: dto.normaReferencia ?? null,
        severidade: dto.severidade,
        prazo: dto.prazo ? new Date(dto.prazo) : null,
        status: 'ABERTA',
      },
    });
  }

  async listarNaoConformidades(avaliacaoId?: string) {
    const where: any = {};
    if (avaliacaoId) where.avaliacaoId = avaliacaoId;
    return this.prisma.naoConformidade.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async buscarNaoConformidade(id: string) {
    const nc = await this.prisma.naoConformidade.findUnique({ where: { id } });
    if (!nc) throw new NotFoundException('Não conformidade não encontrada');
    return nc;
  }

  async registrarAcaoCorretiva(id: string, dto: UpdateNaoConformidadeDto) {
    const nc = await this.buscarNaoConformidade(id);
    if (nc.status !== 'ABERTA') {
      throw new BadRequestException('Apenas não conformidades ABERTAS podem receber ação corretiva');
    }

    return this.prisma.naoConformidade.update({
      where: { id },
      data: {
        acaoCorretiva: dto.acaoCorretiva ?? null,
        status: 'EM_CORRECAO',
      },
    });
  }

  async concluirNaoConformidade(id: string) {
    const nc = await this.buscarNaoConformidade(id);
    if (nc.status !== 'EM_CORRECAO') {
      throw new BadRequestException('Apenas não conformidades EM_CORRECAO podem ser concluídas');
    }

    return this.prisma.naoConformidade.update({
      where: { id },
      data: { status: 'CORRIGIDA' },
    });
  }

  // ── Indicadores de Qualidade ──────────────────

  async criarIndicador(dto: CreateIndicadorDto) {
    return this.prisma.indicadorQualidade.create({
      data: {
        nome: dto.nome,
        descricao: dto.descricao ?? null,
        periodicidade: dto.periodicidade,
        meta: dto.meta ?? null,
        valorAtual: null,
      },
    });
  }

  async listarIndicadores() {
    return this.prisma.indicadorQualidade.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async atualizarIndicador(id: string, dto: UpdateIndicadorDto) {
    const indicador = await this.prisma.indicadorQualidade.findUnique({ where: { id } });
    if (!indicador) throw new NotFoundException('Indicador não encontrado');

    const data: any = {};
    if (dto.nome !== undefined) data.nome = dto.nome;
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.periodicidade !== undefined) data.periodicidade = dto.periodicidade;
    if (dto.meta !== undefined) data.meta = dto.meta;
    if (dto.valorAtual !== undefined) data.valorAtual = dto.valorAtual;

    return this.prisma.indicadorQualidade.update({
      where: { id },
      data,
    });
  }
}
