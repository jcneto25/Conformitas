import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeclaracaoDto } from './dto/create-declaracao.dto';
import { CreateImpedimentoDto } from './dto/create-impedimento.dto';
import { ClassificarDocumentoDto } from './dto/classificar-documento.dto';

@Injectable()
export class EticaService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Declarações de Independência ──────────────

  async criarDeclaracao(usuarioId: string, dto: CreateDeclaracaoDto) {
    return this.prisma.declaracaoIndependencia.create({
      data: {
        usuarioId,
        ano: dto.ano,
        declaracao: dto.declaracao || 'Declaro minha independência para atuar em auditorias no exercício.',
        dataAssinatura: new Date(),
      },
    });
  }

  async listarDeclaracoes(usuarioId?: string) {
    const where: any = {};
    if (usuarioId) where.usuarioId = usuarioId;
    return this.prisma.declaracaoIndependencia.findMany({
      where,
      orderBy: { dataAssinatura: 'desc' },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }

  // ── Impedimentos ──────────────────────────────

  async criarImpedimento(usuarioId: string, dto: CreateImpedimentoDto) {
    return this.prisma.impedimento.create({
      data: {
        usuarioId,
        auditoriaId: dto.auditoriaId,
        motivo: dto.motivo,
        status: 'PENDENTE',
      },
    });
  }

  async listarImpedimentos(auditoriaId?: string) {
    const where: any = {};
    if (auditoriaId) where.auditoriaId = auditoriaId;
    return this.prisma.impedimento.findMany({ where, orderBy: { createdAt: 'desc' } });
  }

  async aceitarImpedimento(id: string) {
    const impedimento = await this.prisma.impedimento.findUnique({ where: { id } });
    if (!impedimento) throw new NotFoundException('Impedimento não encontrado');
    return this.prisma.impedimento.update({ where: { id }, data: { status: 'ACEITO' } });
  }

  async verificarConflitos(usuarioId: string, unidadeAuditada: string) {
    const dozeMesesAtras = new Date();
    dozeMesesAtras.setMonth(dozeMesesAtras.getMonth() - 12);

    const impedimentos = await this.prisma.impedimento.findMany({
      where: {
        usuarioId,
        status: 'ACEITO',
        createdAt: { gte: dozeMesesAtras },
      },
    });

    const declaracoes = await this.prisma.declaracaoIndependencia.findMany({
      where: {
        usuarioId,
        dataAssinatura: { gte: dozeMesesAtras },
      },
    });

    return {
      temConflito: impedimentos.length > 0 || declaracoes.length === 0,
      impedimentos,
      declaracaoPendente: declaracoes.length === 0,
      mensagem:
        declaracoes.length === 0
          ? 'Conflito: Usuário não possui declaração de independência no período'
          : impedimentos.length > 0
            ? `Conflito: Usuário possui ${impedimentos.length} impedimento(s) registrado(s)`
            : 'Nenhum conflito identificado',
    };
  }

  // ── Classificação de Documentos ───────────────

  async classificarDocumento(
    entidadeTipo: string,
    entidadeId: string,
    classificadoPor: string,
    dto: ClassificarDocumentoDto,
  ) {
    const existing = await this.prisma.classificacaoDocumento.findFirst({
      where: { entidadeTipo, entidadeId },
    });

    if (existing) {
      return this.prisma.classificacaoDocumento.update({
        where: { id: existing.id },
        data: { nivelSigilo: dto.nivelSigilo, justificativa: dto.justificativa, classificadoPor },
      });
    }

    return this.prisma.classificacaoDocumento.create({
      data: {
        entidadeTipo,
        entidadeId,
        nivelSigilo: dto.nivelSigilo,
        justificativa: dto.justificativa,
        classificadoPor,
      },
    });
  }

  async obterClassificacao(entidadeTipo: string, entidadeId: string) {
    return this.prisma.classificacaoDocumento.findFirst({
      where: { entidadeTipo, entidadeId },
    });
  }

  async verificarAcessoSigiloso(usuarioId: string, entidadeTipo: string, entidadeId: string) {
    const classificacao = await this.obterClassificacao(entidadeTipo, entidadeId);
    if (!classificacao || classificacao.nivelSigilo === 'PUBLICO') return true;

    // Registrar acesso
    await this.prisma.logAcessoSigiloso.create({
      data: { usuarioId, entidadeTipo, entidadeId, acao: 'CONSULTA' },
    });

    if (classificacao.nivelSigilo === 'SIGILOSO' || classificacao.nivelSigilo === 'RESTRITO') {
      // Buscar perfil do usuário
      const perfis = await this.prisma.usuarioPerfil.findMany({
        where: { usuarioId, ativo: true },
        include: { perfil: true },
      });
      const codigos = perfis.map((up) => up.perfil.codigo);
      if (codigos.includes('P01') || codigos.includes('P10') || codigos.includes('P03')) return true;
      return false;
    }

    return true;
  }

  // ── Trilha de Acesso Sigiloso ─────────────────

  async listarTrilhaAcesso(entidadeTipo?: string, entidadeId?: string) {
    const where: any = {};
    if (entidadeTipo) where.entidadeTipo = entidadeTipo;
    if (entidadeId) where.entidadeId = entidadeId;
    return this.prisma.logAcessoSigiloso.findMany({
      where,
      orderBy: { dataAcesso: 'desc' },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }
}
