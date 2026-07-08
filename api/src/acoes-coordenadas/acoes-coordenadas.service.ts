import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IAcaoCoordenadaRepository, ACAO_COORDENADA_REPOSITORY } from './repositories/acao-coordenada.repository';
import {
  CreateAcaoCoordenadaDto,
  UpdateAcaoCoordenadaDto,
  ReportarResultadoDto,
  StatusAcaoCoordenada,
} from './dto/acao-coordenada.dto';
@Injectable()
export class AcoesCoordenadasService {
  constructor(@Inject(ACAO_COORDENADA_REPOSITORY) private readonly repo: IAcaoCoordenadaRepository) {}
  async findAll() {
    return this.repo.findAll();
  }
  async findOne(id: string) {
    const a = await this.repo.findUnique(id);
    if (!a) throw new NotFoundException('Ação Coordenada não encontrada');
    return a;
  }
  async create(dto: CreateAcaoCoordenadaDto) {
    const existente = await this.repo.findFirst({ where: { codigoSiaud: dto.codigoSiaud } });
    if (existente) throw new BadRequestException('Já existe uma Ação Coordenada com este código SIAUD');
    return this.repo.create({
      ...dto,
      dataAprovacaoCpa: dto.dataAprovacaoCpa ? new Date(dto.dataAprovacaoCpa) : null,
      prazoExecucao: dto.prazoExecucao ? new Date(dto.prazoExecucao) : null,
      resultadoReportado: false,
    });
  }
  async update(id: string, dto: UpdateAcaoCoordenadaDto) {
    await this.findOne(id);
    return this.repo.update(id, {
      ...dto,
      dataAprovacaoCpa: dto.dataAprovacaoCpa ? new Date(dto.dataAprovacaoCpa) : undefined,
      prazoExecucao: dto.prazoExecucao ? new Date(dto.prazoExecucao) : undefined,
    });
  }
  async reportarResultado(id: string, dto: ReportarResultadoDto) {
    const acao = await this.findOne(id);
    if (acao.resultadoReportado) throw new BadRequestException('Resultado já foi reportado à CPA');
    return this.repo.update(id, { status: 'REPORTADA', auditoriaId: dto.auditoriaId, resultadoReportado: true });
  }
  async webhookReceber(dto: CreateAcaoCoordenadaDto) {
    return this.create({ ...dto, status: StatusAcaoCoordenada.RECEBIDA });
  }
}
