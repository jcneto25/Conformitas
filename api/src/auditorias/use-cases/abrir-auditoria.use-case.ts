import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  IAuditoriaRepository,
  AUDITORIA_REPOSITORY,
  IComunicadoRepository,
  COMUNICADO_REPOSITORY,
} from '../repositories/auditoria.repository';
import { CreateAuditoriaDto } from '../dto/create-auditoria.dto';
import { Auditoria } from '../domain/auditoria.entity';
import { AuditoriaAbertaEvent } from '../../shared/events/auditoria-events';
import * as crypto from 'crypto';

@Injectable()
export class AbrirAuditoriaUseCase {
  constructor(
    @Inject(AUDITORIA_REPOSITORY) private readonly auditoriaRepo: IAuditoriaRepository,
    @Inject(COMUNICADO_REPOSITORY) private readonly comunicadoRepo: IComunicadoRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(createAuditoriaDto: CreateAuditoriaDto, criadoPorId: string) {
    const itemPlano = await this.auditoriaRepo.findUnique(createAuditoriaDto.itemPlanoId, {
      include: { plano: true, universo: true },
    });
    if (!itemPlano) throw new NotFoundException('Item do plano não encontrado');
    if (!['APROVADO', 'PUBLICADO'].includes(itemPlano.plano?.status)) {
      throw new BadRequestException('Item do plano deve pertencer a um plano aprovado');
    }

    const count = await this.auditoriaRepo.count();
    const numero = `AUD-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const entity = Auditoria.criar({
      id: crypto.randomUUID(),
      numero,
      unidadeAuditada: itemPlano.universo?.unidadeResponsavel ?? '',
      objetivo: itemPlano.objetivo ?? '',
      itemPlanoId: createAuditoriaDto.itemPlanoId,
      tipo: createAuditoriaDto.tipo || 'CONFORMIDADE',
      forma: createAuditoriaDto.forma || 'DIRETA',
      sigilosa: createAuditoriaDto.sigilosa || false,
      escopo: itemPlano.escopo ?? null,
      dataFimPrevista: createAuditoriaDto.dataFimPrevista ? new Date(createAuditoriaDto.dataFimPrevista) : null,
    });

    const saved = await this.auditoriaRepo.create({
      id: entity.id,
      itemPlanoId: entity.itemPlanoId,
      numero: entity.numero,
      tipo: entity.tipo,
      forma: entity.forma,
      status: entity.status,
      unidadeAuditada: entity.unidadeAuditada,
      objetivo: entity.objetivo,
      sigilosa: entity.sigilosa,
      escopo: entity.escopo,
      dataFimPrevista: entity.dataFimPrevista,
    });

    const comCount = await this.comunicadoRepo.count({ where: { auditoriaId: saved.id } });
    await this.comunicadoRepo.create({
      auditoriaId: saved.id,
      numero: `COM-${saved.numero}-${comCount + 1}`,
      conteudo: `Comunicado da auditoria ${saved.numero}. Unidade: ${saved.unidadeAuditada}. Objetivo: ${saved.objetivo}`,
      assinadoPor: criadoPorId,
    });

    this.eventEmitter.emit('auditoria.aberta', new AuditoriaAbertaEvent(saved.id, saved.numero, saved.unidadeAuditada));

    return saved;
  }
}
