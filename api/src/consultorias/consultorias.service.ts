import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CriarSolicitacaoDto {
  unidadeSolicitante: string;
  tema: string;
  duvida: string;
  fundamentacao?: string;
  solicitanteId: string;
}

interface RegistrarConsultoriaDto {
  tipo: string;
  escopo?: string;
  horasUtilizadas?: number;
  planoId?: string;
  solicitacaoId?: string;
  equipeIds?: string[];
  resultado?: string;
}

const TIPOS_VALIDOS = ['ASSESSORAMENTO', 'CONSULTORIA', 'COGESTAO'];

@Injectable()
export class ConsultoriasService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Solicitações de Consultoria (P05) ─────────

  async criarSolicitacao(dto: CriarSolicitacaoDto) {
    return this.prisma.solicitacaoConsultoria.create({
      data: {
        unidadeSolicitante: dto.unidadeSolicitante,
        tema: dto.tema,
        duvida: dto.duvida,
        fundamentacao: dto.fundamentacao ?? null,
        status: 'PENDENTE',
        solicitanteId: dto.solicitanteId,
      },
    });
  }

  async listarSolicitacoes(status?: string) {
    const where: any = {};
    if (status) where.status = status;
    return this.prisma.solicitacaoConsultoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async aceitarSolicitacao(id: string) {
    const solicitacao = await this.prisma.solicitacaoConsultoria.findUnique({
      where: { id },
    });
    if (!solicitacao) throw new NotFoundException('Solicitação não encontrada');
    if (solicitacao.status !== 'PENDENTE') {
      throw new BadRequestException('Apenas solicitações PENDENTE podem ser aceitas');
    }
    return this.prisma.solicitacaoConsultoria.update({
      where: { id },
      data: { status: 'ACEITA' },
    });
  }

  // ── Consultorias ──────────────────────────────

  async registrarConsultoria(dto: RegistrarConsultoriaDto) {
    if (!TIPOS_VALIDOS.includes(dto.tipo)) {
      throw new BadRequestException(
        `Tipo inválido. Válidos: ${TIPOS_VALIDOS.join(', ')}`,
      );
    }

    // Validar horas PAA se vinculado a um plano
    if (dto.horasUtilizadas && dto.horasUtilizadas > 0 && dto.planoId) {
      const plano = await this.prisma.planoAuditoria.findUnique({
        where: { id: dto.planoId },
      });
      if (!plano) throw new NotFoundException('Plano não encontrado');
      if (plano.tipo !== 'PAA') {
        throw new BadRequestException('Horas são validadas apenas para PAA');
      }

      // Horas disponíveis
      const forcaTrabalho = await this.prisma.forcaTrabalho.findMany({
        where: { planoId: dto.planoId },
      });
      const horasDisponiveis = forcaTrabalho.reduce(
        (s, f) => s + f.horasDisponiveisAno,
        0,
      );

      // Horas já alocadas em consultorias existentes
      const consultoriasExistentes = await this.prisma.consultoria.findMany({
        where: { planoId: dto.planoId },
      });
      const horasAlocadas = consultoriasExistentes.reduce(
        (s, c) => s + (c.horasUtilizadas || 0),
        0,
      );

      if (horasAlocadas + dto.horasUtilizadas > horasDisponiveis) {
        throw new BadRequestException(
          `Horas insuficientes: ${horasAlocadas}h já alocadas + ${dto.horasUtilizadas}h solicitadas > ${horasDisponiveis}h disponíveis`,
        );
      }
    }

    return this.prisma.consultoria.create({
      data: {
        tipo: dto.tipo,
        escopo: dto.escopo ?? null,
        horasUtilizadas: dto.horasUtilizadas ?? null,
        resultado: dto.resultado ?? null,
        planoId: dto.planoId ?? null,
        solicitacaoId: dto.solicitacaoId ?? null,
        equipeIds: dto.equipeIds ?? undefined,
      },
    });
  }

  async listarConsultorias(tipo?: string) {
    const where: any = {};
    if (tipo) where.tipo = tipo;
    return this.prisma.consultoria.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const consultoria = await this.prisma.consultoria.findUnique({
      where: { id },
    });
    if (!consultoria) throw new NotFoundException('Consultoria não encontrada');
    return consultoria;
  }

  // Compatibilidade com controller legado
  async findAll() {
    return this.prisma.consultoria.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
