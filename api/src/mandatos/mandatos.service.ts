import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import {
  IMandatoAuditorChefeRepository,
  MANDATO_AUDITOR_CHEFE_REPOSITORY,
} from './repositories/mandato-auditor-chefe.repository';
import { CreateMandatoDto } from './dto/create-mandato.dto';
@Injectable()
export class MandatosService {
  constructor(@Inject(MANDATO_AUDITOR_CHEFE_REPOSITORY) private readonly repo: IMandatoAuditorChefeRepository) {}
  async create(dto: CreateMandatoDto) {
    const dataInicio = new Date(dto.dataInicio);
    const dataFimPrevista = new Date(dto.dataFimPrevista);
    const diffMs = dataFimPrevista.getTime() - dataInicio.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    if (diffYears > 2) throw new BadRequestException('Mandato não pode exceder 2 anos');
    const mandatosAnteriores = await this.repo.findByUsuario(dto.usuarioId);
    if (mandatosAnteriores.length >= 6)
      throw new BadRequestException('Limite máximo de 6 mandatos (vitalício) atingido');
    if (mandatosAnteriores.find((m) => m.status === 'ATIVO'))
      throw new BadRequestException('Já existe um mandato ativo');
    const concluidos = mandatosAnteriores.filter((m) => m.status === 'CONCLUIDO');
    if (concluidos.length >= 2) {
      const ultimo = concluidos[0];
      const ultimoFim = ultimo.dataFimReal || ultimo.dataFimPrevista;
      const diferencaMs = dataInicio.getTime() - new Date(ultimoFim).getTime();
      if (diferencaMs / (1000 * 60 * 60 * 24 * 365.25) < 1)
        throw new BadRequestException(
          'Após 2 mandatos consecutivos é necessário interstício mínimo de 1 ano (CNJ 308, art. 6º)',
        );
    }
    return this.repo.create({
      usuarioId: dto.usuarioId,
      numeroMandato: mandatosAnteriores.length + 1,
      dataInicio,
      dataFimPrevista,
      atoDesignacao: dto.atoDesignacao,
      status: dto.status || 'ATIVO',
    });
  }
  async findAll() {
    return this.repo.findAll();
  }
  async findOne(id: string) {
    const m = await this.repo.findUnique(id);
    if (!m) throw new NotFoundException('Mandato não encontrado');
    return m;
  }
  async concluir(id: string) {
    await this.findOne(id);
    return this.repo.update(id, { status: 'CONCLUIDO', dataFimReal: new Date() });
  }
}
