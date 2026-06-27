import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export type TipoRelatorio = 'PRELIMINAR' | 'FINAL';

interface GerarRelatorioDto {
  tipo: TipoRelatorio;
  autorId: string;
}

interface FindRelatoriosParams {
  auditoriaId?: string;
  tipo?: string;
  status?: string;
}

@Injectable()
export class RelatoriosService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Geração (RF-007.1 / RF-007.2 / RF-007.3) ────

  async gerar(auditoriaId: string, dto: GerarRelatorioDto) {
    if (dto.tipo !== 'PRELIMINAR' && dto.tipo !== 'FINAL') {
      throw new BadRequestException('Tipo de relatório inválido (PRELIMINAR | FINAL)');
    }

    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id: auditoriaId },
    });
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');

    const achados = await this.prisma.achadoAuditoria.findMany({
      where: { auditoriaId },
      include: { manifestacoes: true },
    });

    if (dto.tipo === 'PRELIMINAR') {
      return this.gerarPreliminar(auditoriaId, dto.autorId, achados);
    }
    return this.gerarFinal(auditoriaId, dto.autorId, achados);
  }

  private async gerarPreliminar(auditoriaId: string, autorId: string, achados: any[]) {
    const preliminares = achados.filter((a) => a.status === 'PRELIMINAR');
    if (preliminares.length === 0) {
      throw new BadRequestException('Relatório Preliminar exige ao menos um achado PRELIMINAR');
    }

    const corpo = preliminares
      .map((a) => `- ${a.codigo} [${a.tipo}]: ${a.situacaoEncontrada} | Causa: ${a.causa} | Efeito: ${a.efeito}`)
      .join('\n');
    const conteudo = `RELATÓRIO PRELIMINAR\n\n${corpo}`;

    return this.prisma.relatorioAuditoria.create({
      data: {
        auditoriaId,
        tipo: 'PRELIMINAR',
        status: 'PRELIMINAR',
        conteudo,
        dataEmissao: new Date(),
        assinadoPor: autorId,
      },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
      },
    });
  }

  private async gerarFinal(auditoriaId: string, autorId: string, achados: any[]) {
    // RF-007.2: todos os achados devem estar CONSOLIDADO
    const naoConsolidados = achados.filter((a) => a.status !== 'CONSOLIDADO');
    if (naoConsolidados.length > 0) {
      throw new BadRequestException('Relatório Final exige todos os achados CONSOLIDADO');
    }

    // RF-007.3: achados sem manifestação entram com ressalva
    const corpo = achados
      .map((a) => {
        const semManifestacao = !a.manifestacoes || a.manifestacoes.length === 0;
        const ressalva = semManifestacao ? ' (sem manifestação — ressalva)' : '';
        return `- ${a.codigo} [${a.tipo}]${ressalva}: ${a.situacaoEncontrada}`;
      })
      .join('\n');
    const conteudo = `RELATÓRIO FINAL\n\n${corpo}`;

    return this.prisma.relatorioAuditoria.create({
      data: {
        auditoriaId,
        tipo: 'FINAL',
        // RASCUNHO aguarda assinatura do P01 (RF-007.5)
        status: 'RASCUNHO',
        conteudo,
        assinadoPor: autorId,
      },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        recomendacoes: true,
      },
    });
  }

  // ── Assinatura (RF-007.5) ──────────────────────

  async assinar(id: string, userId: string) {
    const relatorio = await this.prisma.relatorioAuditoria.findUnique({
      where: { id },
    });
    if (!relatorio) throw new NotFoundException('Relatório não encontrado');
    if (relatorio.status !== 'RASCUNHO') {
      throw new BadRequestException('Apenas relatórios RASCUNHO podem ser assinados');
    }

    return this.prisma.relatorioAuditoria.update({
      where: { id },
      data: {
        status: 'ASSINADO',
        assinadoPor: userId,
        dataEmissao: new Date(),
      },
    });
  }

  // ── Consultas ──────────────────────────────────

  async findOne(id: string) {
    const relatorio = await this.prisma.relatorioAuditoria.findUnique({
      where: { id },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
        recomendacoes: true,
      },
    });
    if (!relatorio) throw new NotFoundException('Relatório não encontrado');
    return relatorio;
  }

  async findAll(params?: FindRelatoriosParams) {
    const where: any = {};
    if (params?.auditoriaId) where.auditoriaId = params.auditoriaId;
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.status) where.status = params.status;

    return this.prisma.relatorioAuditoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        auditoria: { select: { id: true, numero: true, unidadeAuditada: true } },
      },
    });
  }

  // ── Relatório Anual (RF-007.4) ─────────────────

  async gerarAnual(ano: number, autorId: string) {
    const existente = await this.prisma.relatorioAnual.findUnique({
      where: { ano },
    });
    if (existente) {
      throw new ConflictException(`Já existe relatório anual para ${ano}`);
    }

    const inicioAno = new Date(ano, 0, 1);
    const fimAno = new Date(ano, 11, 31, 23, 59, 59);

    const [auditorias, achados, relatorios] = await Promise.all([
      this.prisma.auditoria.count({
        where: { dataFimReal: { gte: inicioAno, lte: fimAno } },
      }),
      this.prisma.achadoAuditoria.count({
        where: { createdAt: { gte: inicioAno, lte: fimAno } },
      }),
      this.prisma.relatorioAuditoria.count({
        where: { dataEmissao: { gte: inicioAno, lte: fimAno } },
      }),
    ]);

    // Scaffold: desempenho PAA, declaração de independência e principais riscos
    // serão enriquecidos quando PRP-004 (PAA), PRP-009 (ética) e PRP-012 (riscos)
    // estiverem implementados.
    const conteudo =
      `RELATÓRIO ANUAL DE ATIVIDADES — ${ano}\n\n` +
      `desempenho PAA: [a consolidar via PRP-004]\n` +
      `declaração de independência: [a consolidar via PRP-009]\n` +
      `principais riscos: [a consolidar via PRP-012]\n\n` +
      `indicadores do exercício:\n` +
      `- auditorias finalizadas: ${auditorias}\n` +
      `- achados registrados: ${achados}\n` +
      `- relatórios emitidos: ${relatorios}\n`;

    return this.prisma.relatorioAnual.create({
      data: {
        ano,
        status: 'RASCUNHO',
        conteudo,
        geradoPor: autorId,
      },
    });
  }
}
