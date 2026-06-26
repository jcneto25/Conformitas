import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMandatoDto } from './dto/create-mandato.dto';

@Injectable()
export class MandatosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMandatoDto) {
    // Verificar limite de mandatos consecutivos (máx 2 = 6 anos)
    const mandatosAnteriores = await this.prisma.mandatoAuditorChefe.findMany({
      where: { usuarioId: dto.usuarioId },
      orderBy: { numeroMandato: 'desc' },
    });

    if (mandatosAnteriores.length >= 2) {
      const ultimo = mandatosAnteriores[0];
      if (ultimo?.status === 'CONCLUIDO' && mandatosAnteriores.length >= 2) {
        throw new BadRequestException('Limite máximo de 2 mandatos consecutivos (6 anos) atingido');
      }
    }

    const numeroMandato = mandatosAnteriores.length + 1;

    return this.prisma.mandatoAuditorChefe.create({
      data: {
        usuarioId: dto.usuarioId,
        numeroMandato,
        dataInicio: new Date(dto.dataInicio),
        dataFimPrevista: new Date(dto.dataFimPrevista),
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
