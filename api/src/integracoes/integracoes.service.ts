import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { IIntegracaoRepository, INTEGRACAO_REPOSITORY } from './repositories/integracao.repository';
import { ILogIntegracaoRepository, LOG_INTEGRACAO_REPOSITORY } from './repositories/log-integracao.repository';
import { CreateIntegracaoDto, UpdateIntegracaoDto } from './dto/integracao.dto';
@Injectable()
export class IntegracoesService {
  constructor(
    @Inject(INTEGRACAO_REPOSITORY) private readonly integracaoRepo: IIntegracaoRepository,
    @Inject(LOG_INTEGRACAO_REPOSITORY) private readonly logRepo: ILogIntegracaoRepository,
  ) {}
  async findAll() {
    return this.integracaoRepo.findAll();
  }
  async findOne(id: string) {
    const i = await this.integracaoRepo.findUnique(id);
    if (!i) throw new NotFoundException('Integração não encontrada');
    return i;
  }
  async create(dto: CreateIntegracaoDto) {
    const existente = await this.integracaoRepo.findByNome(dto.nome);
    if (existente) throw new ConflictException('Já existe uma integração com este nome');
    return this.integracaoRepo.create({ ...dto, healthStatus: 'NAO_TESTADO' });
  }
  async update(id: string, dto: UpdateIntegracaoDto) {
    await this.findOne(id);
    return this.integracaoRepo.update(id, dto);
  }
  async remove(id: string) {
    await this.findOne(id);
    return this.integracaoRepo.delete(id);
  }
  async healthCheck(id: string) {
    const integracao = await this.findOne(id);
    const inicio = Date.now();
    let status = 'ONLINE';
    let erro: string | null = null;
    try {
      if (integracao.endpoint) {
        const response = await fetch(integracao.endpoint, { method: 'GET', signal: AbortSignal.timeout(5000) });
        if (!response.ok) {
          status = 'ERRO';
          erro = `HTTP ${response.status}`;
        }
      } else {
        status = 'NAO_TESTADO';
      }
    } catch (e: any) {
      status = 'OFFLINE';
      erro = e.message;
    }
    const duracaoMs = Date.now() - inicio;
    await this.logRepo.create({
      integracaoId: id,
      status,
      requisicao: { metodo: 'GET', url: integracao.endpoint },
      resposta: erro ? { erro } : { status: 'ok' },
      erro,
      duracaoMs,
    });
    await this.integracaoRepo.update(id, { healthStatus: status });
    return { integracaoId: id, healthStatus: status, duracaoMs, erro, timestamp: new Date().toISOString() };
  }
  async healthAll() {
    const integracoes = await this.findAll();
    const results = await Promise.allSettled(integracoes.map((i) => this.healthCheck(i.id)));
    return integracoes.map((integracao, i) => {
      const base = {
        id: integracao.id,
        nome: integracao.nome,
        sistemaExterno: integracao.sistemaExterno,
        healthStatus: integracao.healthStatus,
        status: integracao.status,
      };
      const r = results[i]!;
      if (r.status === 'fulfilled') {
        return { ...base, detalhe: r.value };
      }
      return { ...base, detalhe: { erro: r.reason?.message } };
    });
  }
  async logs(id: string) {
    await this.findOne(id);
    return this.logRepo.findByIntegracao(id);
  }
}
