import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY } from './repositories/auditoria.repository';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { AuditoriaAbertaEvent, AuditoriaSuspensaEvent } from '../shared/events/auditoria-events';
import { AuditoriaStatus } from './domain/auditoria-status';
import * as crypto from 'crypto';

@Injectable()
export class AuditoriasService {
  constructor(
    @Inject(AUDITORIA_REPOSITORY) private readonly repo: IAuditoriaRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateAuditoriaDto, criadoPorId: string) {
    const itemPlano = await this.repo.findUnique(dto.itemPlanoId, { include: { plano: true, universo: true } });
    if (!itemPlano) throw new NotFoundException('Item do plano não encontrado');
    if (!['APROVADO', 'PUBLICADO'].includes(itemPlano.plano?.status))
      throw new BadRequestException('Item do plano deve pertencer a um plano aprovado');
    const count = await this.repo.count();
    const numero = `AUD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;
    const auditoria = await this.repo.create({
      id: crypto.randomUUID(), itemPlanoId: dto.itemPlanoId, numero,
      tipo: dto.tipo || 'CONFORMIDADE', forma: dto.forma || 'DIRETA',
      status: AuditoriaStatus.ABERTA, unidadeAuditada: itemPlano.universo?.unidadeResponsavel ?? '',
      objetivo: itemPlano.objetivo ?? null, sigilosa: dto.sigilosa || false,
      escopo: itemPlano.escopo ?? null, dataFimPrevista: dto.dataFimPrevista ? new Date(dto.dataFimPrevista) : null,
    });
    this.eventEmitter.emit('auditoria.aberta', new AuditoriaAbertaEvent(auditoria.id, auditoria.numero, auditoria.unidadeAuditada));
    return auditoria;
  }

  async findAll(params?: { status?: string; unidade?: string; search?: string }, unidadeEscopo?: string | null) {
    const where: any = { deletedAt: null };
    if (params?.status) where.status = params.status;
    if (params?.unidade) where.unidadeAuditada = params.unidade;
    else if (unidadeEscopo) where.unidadeAuditada = unidadeEscopo;
    if (params?.search) where.OR = [{ numero: { contains: params.search } }, { unidadeAuditada: { contains: params.search, mode: 'insensitive' } }];
    return this.repo.findMany({ where, orderBy: { createdAt: 'desc' }, include: { itemPlano: { include: { universo: true } }, _count: { select: { evidencias: true, papeisTrabalho: true, requisicoes: true } } } });
  }

  async findOne(id: string) {
    const a = await this.repo.findUnique(id, {
      itemPlano: { include: { universo: true } }, comunicados: { orderBy: { dataEmissao: 'desc' } },
      evidencias: { orderBy: { dataObtencao: 'desc' } }, papeisTrabalho: { orderBy: { createdAt: 'desc' } },
      requisicoes: { orderBy: { createdAt: 'desc' } },
    });
    if (!a || a.deletedAt) throw new NotFoundException('Auditoria não encontrada');
    return a;
  }

  async iniciarExecucao(id: string) { const a = await this.repo.findUnique(id); if (!a) throw new NotFoundException('Auditoria não encontrada'); if (a.status !== 'ABERTA') throw new BadRequestException('Auditoria deve estar ABERTA para iniciar execução'); return this.repo.update(id, { status: 'EM_EXECUCAO', dataInicio: new Date() }); }
  async concluir(id: string) { const a = await this.repo.findUnique(id); if (!a) throw new NotFoundException('Auditoria não encontrada'); if (a.status !== 'EM_EXECUCAO') throw new BadRequestException('Auditoria deve estar EM_EXECUCAO para concluir'); return this.repo.update(id, { status: 'CONCLUIDA', dataFimReal: new Date() }); }
  async suspender(id: string, motivo: string) { const a = await this.repo.findUnique(id); if (!a) throw new NotFoundException('Auditoria não encontrada'); const r = await this.repo.update(id, { status: 'SUSPENSA', motivoSuspensao: motivo }); this.eventEmitter.emit('auditoria.suspensa', new AuditoriaSuspensaEvent(a.id, a.numero, motivo)); return r; }
}
