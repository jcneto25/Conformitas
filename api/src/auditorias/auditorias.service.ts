import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAuditoriaRepository,
  AUDITORIA_REPOSITORY,
  IComunicadoRepository,
  COMUNICADO_REPOSITORY,
  IEvidenciaRepository,
  EVIDENCIA_REPOSITORY,
  IPapelTrabalhoRepository,
  PAPEL_TRABALHO_REPOSITORY,
  IRequisicaoRepository,
  REQUISICAO_REPOSITORY,
} from './repositories/auditoria.repository';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';
import { AuditoriaAbertaEvent, AuditoriaSuspensaEvent } from '../shared/events/auditoria-events';
import { AuditoriaStatus } from './domain/auditoria-status';

@Injectable()
export class AuditoriasService {
  constructor(
    @Inject(AUDITORIA_REPOSITORY) private readonly auditoriaRepo: IAuditoriaRepository,
    @Inject(COMUNICADO_REPOSITORY) private readonly comunicadoRepo: IComunicadoRepository,
    @Inject(EVIDENCIA_REPOSITORY) private readonly evidenciaRepo: IEvidenciaRepository,
    @Inject(PAPEL_TRABALHO_REPOSITORY) private readonly papelRepo: IPapelTrabalhoRepository,
    @Inject(REQUISICAO_REPOSITORY) private readonly requisicaoRepo: IRequisicaoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  private async gerarNumeroSequencial(): Promise<string> {
    const count = await this.auditoriaRepo.count();
    return `AUD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
  }

  async create(dto: CreateAuditoriaDto, criadoPorId: string) {
    const itemPlano = await this.auditoriaRepo.findUnique(dto.itemPlanoId, {
      include: { plano: true, universo: true },
    });
    if (!itemPlano) throw new NotFoundException('Item do plano não encontrado');
    if (!['APROVADO', 'PUBLICADO'].includes(itemPlano.plano?.status))
      throw new BadRequestException('Item do plano deve pertencer a um plano aprovado');
    const numero = await this.gerarNumeroSequencial();
    const auditoria = await this.auditoriaRepo.create({
      id: crypto.randomUUID(),
      itemPlanoId: dto.itemPlanoId,
      numero,
      tipo: dto.tipo || 'CONFORMIDADE',
      forma: dto.forma || 'DIRETA',
      status: AuditoriaStatus.ABERTA,
      unidadeAuditada: itemPlano.universo?.unidadeResponsavel ?? '',
      objetivo: itemPlano.objetivo ?? null,
      sigilosa: dto.sigilosa || false,
      escopo: itemPlano.escopo ?? null,
      dataFimPrevista: dto.dataFimPrevista ? new Date(dto.dataFimPrevista) : null,
    });
    await this.gerarComunicado(auditoria.id, criadoPorId);
    this.eventEmitter.emit(
      'auditoria.aberta',
      new AuditoriaAbertaEvent(auditoria.id, auditoria.numero, auditoria.unidadeAuditada),
    );
    return auditoria;
  }

  async findAll(params?: { status?: string; unidade?: string; search?: string }, unidadeEscopo?: string | null) {
    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;
    if (params?.unidade) where.unidadeAuditada = params.unidade;
    else if (unidadeEscopo) where.unidadeAuditada = unidadeEscopo;
    if (params?.search) {
      where.OR = [
        { numero: { contains: params.search } },
        { unidadeAuditada: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    return this.auditoriaRepo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        itemPlano: { include: { universo: true } },
        _count: { select: { evidencias: true, papeisTrabalho: true, requisicoes: true } },
      },
    });
  }

  async findOne(id: string) {
    const a = await this.auditoriaRepo.findUnique(id, {
      itemPlano: { include: { universo: true } },
      comunicados: { orderBy: { dataEmissao: 'desc' } },
      evidencias: { orderBy: { dataObtencao: 'desc' } },
      papeisTrabalho: { orderBy: { createdAt: 'desc' } },
      requisicoes: { orderBy: { createdAt: 'desc' } },
    });
    if (!a || a.deletedAt) throw new NotFoundException('Auditoria não encontrada');
    return a;
  }

  async iniciarExecucao(id: string) {
    const a = await this.auditoriaRepo.findUnique(id);
    if (!a) throw new NotFoundException('');
    if (a.status !== 'ABERTA') throw new BadRequestException('');
    return this.auditoriaRepo.update(id, { status: 'EM_EXECUCAO', dataInicio: new Date() });
  }
  async concluir(id: string) {
    const a = await this.auditoriaRepo.findUnique(id);
    if (!a) throw new NotFoundException('');
    if (a.status !== 'EM_EXECUCAO') throw new BadRequestException('');
    return this.auditoriaRepo.update(id, { status: 'CONCLUIDA', dataFimReal: new Date() });
  }

  async suspender(id: string, motivo: string) {
    const a = await this.auditoriaRepo.findUnique(id);
    if (!a) throw new NotFoundException('');
    const r = await this.auditoriaRepo.update(id, { status: 'SUSPENSA', motivoSuspensao: motivo });
    this.eventEmitter.emit('auditoria.suspensa', new AuditoriaSuspensaEvent(a.id, a.numero, motivo));
    return r;
  }

  async gerarComunicado(auditoriaId: string, assinadoPor: string) {
    const a = await this.auditoriaRepo.findUnique(auditoriaId, { itemPlano: { include: { universo: true } } });
    if (!a) throw new NotFoundException('');
    const count = await this.comunicadoRepo.count({ where: { auditoriaId } });
    return this.comunicadoRepo.create({
      auditoriaId,
      numero: `COM-${a.numero}-${count + 1}`,
      conteudo: `Comunicado da auditoria ${a.numero}. Unidade: ${a.unidadeAuditada}. Objetivo: ${a.objetivo}`,
      assinadoPor,
    });
  }

  async criarEvidencia(auditoriaId: string, dto: CriarEvidenciaDto, arquivoPath: string) {
    const a = await this.auditoriaRepo.findUnique(auditoriaId);
    if (!a) throw new NotFoundException('');
    return this.evidenciaRepo.create({
      auditoriaId,
      tipo: dto.tipo,
      descricao: dto.descricao,
      fonte: dto.fonte,
      arquivoPath,
    });
  }
  async listarEvidencias(auditoriaId: string) {
    return this.evidenciaRepo.findMany({ where: { auditoriaId }, orderBy: { dataObtencao: 'desc' } });
  }
  async criarPapelTrabalho(auditoriaId: string, dto: CriarPapelTrabalhoDto, autorId: string) {
    const a = await this.auditoriaRepo.findUnique(auditoriaId);
    if (!a) throw new NotFoundException('');
    return this.papelRepo.create({
      auditoriaId,
      codigo: dto.codigo,
      descricao: dto.descricao,
      evidenciaIds: dto.evidenciaIds || [],
      autorId,
    });
  }
  async listarPapeisTrabalho(auditoriaId: string) {
    return this.papelRepo.findMany({ where: { auditoriaId }, orderBy: { createdAt: 'desc' } });
  }
  async criarRequisicao(auditoriaId: string, dto: CriarRequisicaoDto) {
    const a = await this.auditoriaRepo.findUnique(auditoriaId);
    if (!a) throw new NotFoundException('');
    const prazo = new Date();
    prazo.setDate(prazo.getDate() + dto.prazoDias);
    return this.requisicaoRepo.create({ auditoriaId, descricao: dto.descricao, prazo });
  }
  async listarRequisicoes(auditoriaId: string) {
    return this.requisicaoRepo.findMany({ where: { auditoriaId }, orderBy: { createdAt: 'desc' } });
  }
}
