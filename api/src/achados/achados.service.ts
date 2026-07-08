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
import * as crypto from 'crypto';
export const PRAZO_MANIFESTACAO_DIAS_UTEIS = 5;
export const RESSALVA_SEM_MANIFESTACAO = 'Sem manifestação da unidade auditada no prazo regulatório (5 dias úteis).';

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

  async create(auditoriaId: string, dto: CreateAchadoDto, autorId: string) {
    const auditoria = await this.achadoRepo.findUnique(auditoriaId);
    if (!auditoria) throw new NotFoundException('Auditoria não encontrada');
    if (auditoria.status !== 'EM_EXECUCAO')
      throw new BadRequestException('Achados só podem ser criados em auditorias EM_EXECUCAO');
    const count = await this.achadoRepo.count({ where: { auditoriaId } });
    return this.achadoRepo.create({
      id: crypto.randomUUID(),
      auditoriaId,
      codigo: `ACH-${count + 1}`,
      tipo: dto.tipo,
      situacaoEncontrada: dto.situacaoEncontrada,
      criterio: dto.criterio,
      causa: dto.causa,
      efeito: dto.efeito,
      status: AchadoStatus.PRELIMINAR,
      evidenciaIds: dto.evidenciaIds ?? [],
      autorId,
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
  async update(id: string, dto: Partial<CreateAchadoDto>) {
    await this.findOne(id);
    return this.achadoRepo.update(id, dto);
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
    if (!achado) throw new NotFoundException('');
    if (achado.status !== 'EM_MANIFESTACAO') throw new BadRequestException('');
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
    dto: CreateManifestacaoDto,
    autorId: string,
    unidadeEscopo?: string | null,
  ) {
    const achado = await this.achadoRepo.findUnique(achadoId, { include: { auditoria: true } });
    if (!achado) throw new NotFoundException('Achado não encontrado');
    if (achado.status !== 'EM_MANIFESTACAO') throw new BadRequestException('');
    if (unidadeEscopo && achado.auditoria.unidadeAuditada !== unidadeEscopo) throw new ForbiddenException('');
    const result = await this.manifestacaoRepo.create({ achadoId, autorId, conteudo: dto.conteudo });
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
