import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ConfigService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.configuracaoSistema.findMany({ orderBy: { chave: 'asc' } });
  }

  async findOne(chave: string) {
    const config = await this.prisma.configuracaoSistema.findUnique({ where: { chave } });
    if (!config) throw new NotFoundException('Configuração não encontrada');
    return config;
  }

  async update(chave: string, valor: string) {
    const config = await this.findOne(chave);
    if (!config.editavel) {
      throw new ForbiddenException('Configuração não é editável');
    }

    return this.prisma.configuracaoSistema.update({
      where: { chave },
      data: { valor },
    });
  }

  async getValor(chave: string, padrao?: string): Promise<string> {
    const config = await this.prisma.configuracaoSistema.findUnique({ where: { chave } });
    return config?.valor ?? padrao ?? '';
  }
}
