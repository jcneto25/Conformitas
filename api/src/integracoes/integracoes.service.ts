import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIntegracaoDto, UpdateIntegracaoDto } from './dto/integracao.dto';

@Injectable()
export class IntegracoesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.integracao.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const integracao = await this.prisma.integracao.findUnique({ where: { id } });
    if (!integracao) throw new NotFoundException('Integração não encontrada');
    return integracao;
  }

  async create(dto: CreateIntegracaoDto) {
    const existente = await this.prisma.integracao.findFirst({
      where: { nome: dto.nome },
    });
    if (existente) throw new ConflictException('Já existe uma integração com este nome');

    return this.prisma.integracao.create({
      data: {
        nome: dto.nome,
        sistemaExterno: dto.sistemaExterno,
        tipo: dto.tipo,
        protocolo: dto.protocolo,
        endpoint: dto.endpoint,
        metodoAutenticacao: dto.metodoAutenticacao,
        frequencia: dto.frequencia,
        status: dto.status,
        healthStatus: 'NAO_TESTADO',
      },
    });
  }

  async update(id: string, dto: UpdateIntegracaoDto) {
    await this.findOne(id);
    return this.prisma.integracao.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.integracao.delete({ where: { id } });
  }

  async healthCheck(id: string) {
    const integracao = await this.findOne(id);

    // Simula health check — em produção, faria uma chamada real ao endpoint
    const inicio = Date.now();
    let status = 'ONLINE';
    let erro: string | null = null;

    try {
      if (integracao.endpoint) {
        const response = await fetch(integracao.endpoint, {
          method: 'GET',
          signal: AbortSignal.timeout(5000),
        });
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

    // Registra log
    await this.prisma.logIntegracao.create({
      data: {
        integracaoId: id,
        status,
        requisicao: { metodo: 'GET', url: integracao.endpoint },
        resposta: erro ? { erro } : { status: 'ok' },
        erro,
        duracaoMs,
      },
    });

    // Atualiza health status
    await this.prisma.integracao.update({
      where: { id },
      data: { healthStatus: status },
    });

    return { integracaoId: id, healthStatus: status, duracaoMs, erro, timestamp: new Date().toISOString() };
  }

  async healthAll() {
    const integracoes = await this.findAll();
    const results = await Promise.allSettled(
      integracoes.map((i) => this.healthCheck(i.id)),
    );

    return integracoes.map((integracao, index) => {
      const result = results[index];
      const base: any = {
        id: integracao.id,
        nome: integracao.nome,
        sistemaExterno: integracao.sistemaExterno,
        healthStatus: integracao.healthStatus,
        status: integracao.status,
      };
      if (result && result.status === 'fulfilled') {
        base.detalhe = result.value;
      } else if (result && result.status === 'rejected') {
        base.detalhe = { erro: result.reason?.message };
      }
      return base;
    });
  }

  async logs(id: string) {
    await this.findOne(id);
    return this.prisma.logIntegracao.findMany({
      where: { integracaoId: id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }
}
