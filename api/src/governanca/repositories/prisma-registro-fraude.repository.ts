import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IRegistroFraudeRepository, REGISTRO_FRAUDE_REPOSITORY } from './registro-fraude.repository';
@Injectable()
export class PrismaRegistroFraudeRepository implements IRegistroFraudeRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.registroFraude.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.registroFraude.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.registroFraude.findUnique({ where: { id } });
  }
  async update(id: string, data: any) {
    return this.prisma.registroFraude.update({ where: { id }, data });
  }
}
