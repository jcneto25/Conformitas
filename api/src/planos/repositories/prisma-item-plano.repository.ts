import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IItemPlanoRepository, ITEM_PLANO_REPOSITORY } from './item-plano.repository';
@Injectable()
export class PrismaItemPlanoRepository implements IItemPlanoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.itemPlano.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.itemPlano.findMany(where);
  }
  async findUnique(id: string) {
    return this.prisma.itemPlano.findUnique({ where: { id } });
  }
  async delete(id: string) {
    return this.prisma.itemPlano.delete({ where: { id } });
  }
}
