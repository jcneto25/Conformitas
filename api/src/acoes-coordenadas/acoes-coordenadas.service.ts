import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAcaoCoordenadaDto, UpdateAcaoCoordenadaDto, ReportarResultadoDto, StatusAcaoCoordenada } from './dto/acao-coordenada.dto';

@Injectable()
export class AcoesCoordenadasService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.acaoCoordenada.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const acao = await this.prisma.acaoCoordenada.findUnique({ where: { id } });
    if (!acao) throw new NotFoundException('Ação Coordenada não encontrada');
    return acao;
  }

  async create(dto: CreateAcaoCoordenadaDto) {
    const existente = await this.prisma.acaoCoordenada.findFirst({
      where: { codigoSiaud: dto.codigoSiaud },
    });
    if (existente) throw new BadRequestException('Já existe uma Ação Coordenada com este código SIAUD');

    // Se veio via webhook, força status RECEBIDA
    return this.prisma.acaoCoordenada.create({
      data: {
        codigoSiaud: dto.codigoSiaud,
        titulo: dto.titulo,
        descricao: dto.descricao,
        metodologia: dto.metodologia,
        dataAprovacaoCpa: dto.dataAprovacaoCpa ? new Date(dto.dataAprovacaoCpa) : null,
        prazoExecucao: dto.prazoExecucao ? new Date(dto.prazoExecucao) : null,
        status: dto.status,
        resultadoReportado: false,
      },
    });
  }

  async update(id: string, dto: UpdateAcaoCoordenadaDto) {
    await this.findOne(id);
    return this.prisma.acaoCoordenada.update({
      where: { id },
      data: {
        ...dto,
        dataAprovacaoCpa: dto.dataAprovacaoCpa ? new Date(dto.dataAprovacaoCpa) : undefined,
        prazoExecucao: dto.prazoExecucao ? new Date(dto.prazoExecucao) : undefined,
      },
    });
  }

  async reportarResultado(id: string, dto: ReportarResultadoDto) {
    const acao = await this.findOne(id);

    if (acao.resultadoReportado) {
      throw new BadRequestException('Resultado já foi reportado à CPA');
    }

    // Verifica se a auditoria existe
    const auditoria = await this.prisma.auditoria.findUnique({
      where: { id: dto.auditoriaId },
    });
    if (!auditoria || auditoria.deletedAt) {
      throw new NotFoundException('Auditoria não encontrada');
    }
    if (auditoria.status !== 'CONCLUIDA') {
      throw new BadRequestException('A auditoria deve estar CONCLUIDA para reportar');
    }

    return this.prisma.acaoCoordenada.update({
      where: { id },
      data: {
        status: 'REPORTADA',
        auditoriaId: dto.auditoriaId,
        resultadoReportado: true,
      },
    });
  }

  // Webhook: receber ação coordenada do SIAUD-Jud
  async webhookReceber(dto: CreateAcaoCoordenadaDto) {
    // Força status RECEBIDA para entradas via webhook
    return this.create({ ...dto, status: StatusAcaoCoordenada.RECEBIDA });
  }
}
