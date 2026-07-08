import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY, IComunicadoRepository, COMUNICADO_REPOSITORY } from './repositories/auditoria.repository';

@Injectable()
export class ComunicadosService {
  constructor(
    @Inject(AUDITORIA_REPOSITORY) private readonly auditoriaRepo: IAuditoriaRepository,
    @Inject(COMUNICADO_REPOSITORY) private readonly comunicadoRepo: IComunicadoRepository,
  ) {}

  async gerar(auditoriaId: string, assinadoPor: string) {
    const a = await this.auditoriaRepo.findUnique(auditoriaId, { itemPlano: { include: { universo: true } } });
    if (!a) throw new NotFoundException('Auditoria não encontrada');
    const count = await this.comunicadoRepo.count({ where: { auditoriaId } });
    return this.comunicadoRepo.create({
      auditoriaId, numero: `COM-${a.numero}-${count + 1}`,
      conteudo: `Comunicado da auditoria ${a.numero}. Unidade: ${a.unidadeAuditada}. Objetivo: ${a.objetivo}`,
      assinadoPor,
    });
  }
}
