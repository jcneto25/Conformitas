import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeterminacaoDto } from './dto/create-determinacao.dto';
import { UpdateDeterminacaoDto } from './dto/update-determinacao.dto';
import { CreateRegistroFraudeDto } from './dto/create-registro-fraude.dto';
import { ComunicarFraudeDto, TipoComunicacao } from './dto/comunicar-fraude.dto';

@Injectable()
export class GovernancaService {
  private readonly logger = new Logger(GovernancaService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ── Determinações Externas (RF-013.1) ─────────

  async createDeterminacao(dto: CreateDeterminacaoDto) {
    return this.prisma.determinacaoExterna.create({
      data: {
        orgao: dto.orgao,
        numero: dto.numero,
        descricao: dto.descricao,
        prazoResposta: dto.prazoResposta ? new Date(dto.prazoResposta) : null,
        status: 'PENDENTE',
      },
    });
  }

  async listarDeterminacoes(filters?: { orgao?: string; status?: string }) {
    const where: any = {};
    if (filters?.orgao) where.orgao = filters.orgao;
    if (filters?.status) where.status = filters.status;
    return this.prisma.determinacaoExterna.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async buscarDeterminacao(id: string) {
    const det = await this.prisma.determinacaoExterna.findUnique({ where: { id } });
    if (!det) throw new NotFoundException('Determinação externa não encontrada');
    return det;
  }

  async atualizarDeterminacao(id: string, dto: UpdateDeterminacaoDto) {
    await this.buscarDeterminacao(id);
    const data: any = {};
    if (dto.orgao !== undefined) data.orgao = dto.orgao;
    if (dto.numero !== undefined) data.numero = dto.numero;
    if (dto.descricao !== undefined) data.descricao = dto.descricao;
    if (dto.prazoResposta !== undefined) data.prazoResposta = new Date(dto.prazoResposta);
    return this.prisma.determinacaoExterna.update({ where: { id }, data });
  }

  async concluirDeterminacao(id: string) {
    const det = await this.buscarDeterminacao(id);
    if (det.status !== 'PENDENTE') {
      throw new BadRequestException('Apenas determinações PENDENTE podem ser concluídas');
    }
    return this.prisma.determinacaoExterna.update({
      where: { id },
      data: { status: 'CONCLUIDA' },
    });
  }

  // ── Registros de Fraude (RF-013.2) ────────────

  async createRegistroFraude(dto: CreateRegistroFraudeDto) {
    return this.prisma.registroFraude.create({
      data: {
        auditoriaId: dto.auditoriaId ?? null,
        descricao: dto.descricao,
        classificacao: dto.classificacao,
      },
    });
  }

  async listarRegistrosFraude(filters?: { classificacao?: string; auditoriaId?: string }) {
    const where: any = {};
    if (filters?.classificacao) where.classificacao = filters.classificacao;
    if (filters?.auditoriaId) where.auditoriaId = filters.auditoriaId;
    return this.prisma.registroFraude.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async buscarRegistroFraude(id: string) {
    const reg = await this.prisma.registroFraude.findUnique({ where: { id } });
    if (!reg) throw new NotFoundException('Registro de fraude não encontrado');
    return reg;
  }

  async comunicar(id: string, dto: ComunicarFraudeDto) {
    const reg = await this.buscarRegistroFraude(id);

    if (dto.tipo === TipoComunicacao.SUPERIOR) {
      if (reg.dataComunicacaoSuperior) {
        throw new BadRequestException('Fraude já comunicada ao superior hierárquico');
      }
      return this.prisma.registroFraude.update({
        where: { id },
        data: { dataComunicacaoSuperior: new Date() },
      });
    }

    if (dto.tipo === TipoComunicacao.TCE) {
      if (reg.dataComunicacaoTce) {
        throw new BadRequestException('Fraude já comunicada ao TCE');
      }
      if (!reg.dataComunicacaoSuperior) {
        throw new BadRequestException(
          'Comunique primeiro ao superior hierárquico antes de comunicar ao TCE',
        );
      }
      return this.prisma.registroFraude.update({
        where: { id },
        data: { dataComunicacaoTce: new Date() },
      });
    }

    throw new BadRequestException('Tipo de comunicação inválido');
  }

  // ── Alerta 60 dias (RF-013.3) ─────────────────

  async verificarFraudes60Dias(): Promise<{ pendentes: number; registros: any[] }> {
    const sessentaDiasAtras = new Date();
    sessentaDiasAtras.setDate(sessentaDiasAtras.getDate() - 60);

    const registros = await this.prisma.registroFraude.findMany({
      where: {
        dataComunicacaoSuperior: { lte: sessentaDiasAtras },
        dataComunicacaoTce: null,
      },
      orderBy: { dataComunicacaoSuperior: 'asc' },
    });

    return { pendentes: registros.length, registros };
  }
}
