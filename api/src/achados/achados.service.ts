import { Injectable, Inject, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAchadoRepository,
  ACHADO_REPOSITORY,
  IManifestacaoRepository,
  MANIFESTACAO_REPOSITORY,
} from './repositories/achado.repository';
import { adicionarDiasUteis } from '../common/utils/dias-uteis';
import { CreateAchadoDto } from './dto/create-achado.dto';
import { CreateManifestacaoDto } from './dto/create-manifestacao.dto';
import { AchadoManifestacaoEvent, ManifestacaoRegistradaEvent } from '../shared/events/auditoria-events';
import { AchadoStatus } from './domain/achado-status';
import { PRAZO_MANIFESTACAO_DIAS_UTEIS, RESSALVA_SEM_MANIFESTACAO } from './domain/constants';
import * as crypto from 'crypto';

@Injectable()
export class AchadosService {
  private readonly logger = new Logger(AchadosService.name);
  private readonly achadoInclude = {
    auditoria: { select: { id: true, numero: true, unidadeAuditada: true, status: true } },
    manifestacoes: { orderBy: { createdAt: 'desc' as const } },
    _count: { select: { manifestacoes: true, recomendacoes: true } },
  };

  constructor(
    @Inject(ACHADO_REPOSITORY) private readonly achadoRepo: IAchadoRepository,
    @Inject(MANIFESTACAO_REPOSITORY) private readonly manifestacaoRepo: IManifestacaoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(auditoriaId: string, createAchadoDto: CreateAchadoDto, autorId: string) {
    const auditoria = await this.achadoRepo.findUnique(auditoriaId);
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO')
      throw new BadRequestException('Achados só podem ser criados em auditorias EM_EXECUCAO');
    }

    // ── R-ACH-001: integridade referencial do vínculo com evidências.
    // Evidências passadas em dto.evidenciaIds devem existir e pertencer à
    // mesma auditoria. Caso contrário, rejeita com 400 — evita "achado órfão"
    // respaldado em evidências de outra auditoria (ou inexistentes).
    if (dto.evidenciaIds && dto.evidenciaIds.length > 0) {
      const encontradas = await this.prisma.evidencia.findMany({
        where: { id: { in: dto.evidenciaIds }, auditoriaId },
        select: { id: true },
      });
      const idsValidos = new Set(encontradas.map((e) => e.id));
      const invalidos = dto.evidenciaIds.filter((id) => !idsValidos.has(id));
      if (invalidos.length > 0) {
        throw new BadRequestException(
          `Evidências não pertencem a esta auditoria: ${invalidos.join(', ')}`,
        );
      }
    }

    // Código sequencial por auditoria (ACH-1, ACH-2, ...)
    const count = await this.prisma.achadoAuditoria.count({
      where: { auditoriaId },
    });

    return this.prisma.achadoAuditoria.create({
      data: {
        auditoriaId,
        codigo: `ACH-${count + 1}`,
        tipo: dto.tipo,
        situacaoEncontrada: dto.situacaoEncontrada,
        criterio: dto.criterio,
        causa: dto.causa,
        efeito: dto.efeito,
        status: 'PRELIMINAR',
        evidenciaIds: dto.evidenciaIds ?? [],
        autorId,
      },
      include: this.achadoInclude,
    });
  }

  async findAll(
    params?: { status?: string; tipo?: string; auditoriaId?: string; search?: string },
    unidadeEscopo?: string | null,
  ) {
    const where: any = {};
    if (params?.status) where.status = params.status;
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.auditoriaId) where.auditoriaId = params.auditoriaId;
    if (unidadeEscopo) where.auditoria = { unidadeAuditada: unidadeEscopo };
    if (params?.search) {
      where.OR = [
        { codigo: { contains: params.search } },
        { situacaoEncontrada: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.achadoRepo.findMany({ where, include: this.achadoInclude, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string, unidadeEscopo?: string | null) {
    const a = await this.achadoRepo.findUnique(id, { include: this.achadoInclude });
    if (!a) throw new NotFoundException('Achado não encontrado');
    return a;
  }
  async update(id: string, updateAchadoDto: Partial<CreateAchadoDto>) {
    await this.findOne(id);
    return this.achadoRepo.update(id, updateAchadoDto);
  }

  async enviarManifestacao(id: string, prazoDiasUteis?: number) {
    const achado = await this.achadoRepo.findUnique(id, { include: { auditoria: true } });
    if (!achado) throw new NotFoundException('Achado não encontrado');
    if (achado.status !== 'PRELIMINAR')
      throw new BadRequestException('Apenas achados PRELIMINAR podem ser enviados para manifestação');
    const prazo = prazoDiasUteis ?? PRAZO_MANIFESTACAO_DIAS_UTEIS;
    const dataLimite = adicionarDiasUteis(new Date(), prazo);
    const result = await this.achadoRepo.update(id, { status: 'EM_MANIFESTACAO', dataLimiteManifestacao: dataLimite });
    this.eventEmitter.emit(
      'achado.manifestacao',
      new AchadoManifestacaoEvent(
        achado.id,
        achado.codigo,
        achado.auditoria?.unidadeAuditada ?? '',
        achado.auditoriaId,
        prazo,
      ),
    );
    return result;
  }

  async consolidar(id: string) {
    const achado = await this.achadoRepo.findUnique(id);
    if (!achado) throw new NotFoundException('Achado não encontrado');
    if (achado.status !== 'EM_MANIFESTACAO') throw new BadRequestException('Apenas achados EM_MANIFESTACAO podem ser consolidados');
    return this.achadoRepo.update(id, { status: 'CONSOLIDADO' });
  }

  async consolidarExpirados() {
    const expirados = await this.achadoRepo.findMany({
      where: { status: 'EM_MANIFESTACAO', dataLimiteManifestacao: { lte: new Date() } },
    });
    for (const a of expirados) {
      await this.achadoRepo.update(a.id, { status: 'CONSOLIDADO', ressalva: RESSALVA_SEM_MANIFESTACAO });
    }
    return { consolidados: expirados.length };
  }

  async criarManifestacao(
    achadoId: string,
    manifestacaoDto: CreateManifestacaoDto,
    autorId: string,
    unidadeEscopo?: string | null,
  ) {
    const achado = await this.achadoRepo.findUnique(achadoId, { include: { auditoria: true } });
    if (!achado) throw new NotFoundException('Achado não encontrado');
    if (achado.status !== 'EM_MANIFESTACAO') throw new BadRequestException('Apenas achados EM_MANIFESTACAO podem receber manifestação');
    if (unidadeEscopo && achado.auditoria.unidadeAuditada !== unidadeEscopo) throw new ForbiddenException('');
    const result = await this.manifestacaoRepo.create({ achadoId, autorId, conteudo: manifestacaoDto.conteudo });
    this.eventEmitter.emit(
      'achado.manifestacao.registrada',
      new ManifestacaoRegistradaEvent(achadoId, achado.codigo, achado.auditoriaId),
    );
    return result;
  }

  async listarManifestacoes(achadoId: string) {
    return this.manifestacaoRepo.findMany({ where: { achadoId }, orderBy: { createdAt: 'desc' } });
  }
}
