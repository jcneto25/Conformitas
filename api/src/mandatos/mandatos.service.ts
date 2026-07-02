import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMandatoDto } from './dto/create-mandato.dto';

@Injectable()
export class MandatosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMandatoDto) {
    const dataInicio = new Date(dto.dataInicio);
    const dataFimPrevista = new Date(dto.dataFimPrevista);

    // Validar duração máxima de 2 anos por mandato
    const diffMs = dataFimPrevista.getTime() - dataInicio.getTime();
    const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
    if (diffYears > 2) {
      throw new BadRequestException('Mandato não pode exceder 2 anos');
    }

    // Buscar mandatos anteriores ordenados
    const mandatosAnteriores = await this.prisma.mandatoAuditorChefe.findMany({
      where: { usuarioId: dto.usuarioId },
      orderBy: { numeroMandato: 'desc' },
    });

    // Validar limite total de 6 mandatos (vitalício)
    const totalMandatos = mandatosAnteriores.length;
    if (totalMandatos >= 6) {
      throw new BadRequestException('Limite máximo de 6 mandatos (vitalício) atingido');
    }

    // Validar se já existe mandato ativo
    const mandatoAtivo = mandatosAnteriores.find((m) => m.status === 'ATIVO');
    if (mandatoAtivo) {
      throw new BadRequestException('Já existe um mandato ativo para este auditor');
    }

    // Validar limite de 2 consecutivos + interstício de 1 ano
    const concluidos = mandatosAnteriores.filter((m) => m.status === 'CONCLUIDO');

    if (concluidos.length >= 2) {
      const ultimo = concluidos[0];
      if (!ultimo) {
        throw new BadRequestException('Erro ao validar mandatos anteriores');
      }
      const ultimoFim = ultimo.dataFimReal || ultimo.dataFimPrevista;
      const diferencaMs = dataInicio.getTime() - new Date(ultimoFim).getTime();
      const diferencaAnos = diferencaMs / (1000 * 60 * 60 * 24 * 365.25);

      if (diferencaAnos < 1) {
        throw new BadRequestException(
          'Após 2 mandatos consecutivos é necessário interstício mínimo de 1 ano (CNJ 308, art. 6º)',
        );
      }
    }

    const numeroMandato = totalMandatos + 1;

    return this.prisma.mandatoAuditorChefe.create({
      data: {
        usuarioId: dto.usuarioId,
        numeroMandato,
        dataInicio,
        dataFimPrevista,
        atoDesignacao: dto.atoDesignacao,
        status: dto.status || 'ATIVO',
      },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
  }

  async findAll() {
    return this.prisma.mandatoAuditorChefe.findMany({
      include: { usuario: { select: { id: true, nome: true, email: true } } },
      orderBy: { dataInicio: 'desc' },
    });
  }

  async findOne(id: string) {
    const mandato = await this.prisma.mandatoAuditorChefe.findUnique({
      where: { id },
      include: { usuario: { select: { id: true, nome: true, email: true } } },
    });
    if (!mandato) throw new NotFoundException('Mandato não encontrado');
    return mandato;
  }

  async concluir(id: string) {
    const mandato = await this.prisma.mandatoAuditorChefe.findUnique({
      where: { id },
    });
    if (!mandato) throw new NotFoundException('Mandato não encontrado');

    return this.prisma.mandatoAuditorChefe.update({
      where: { id },
      data: {
        status: 'CONCLUIDO',
        dataFimReal: new Date(),
      },
    });
  }
}
