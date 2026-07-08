import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { IForcaTrabalhoRepository, FORCA_TRABALHO_REPOSITORY } from './forca-trabalho.repository';
@Injectable()
export class PrismaForcaTrabalhoRepository implements IForcaTrabalhoRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: any) {
    return this.prisma.forcaTrabalho.create({ data });
  }
  async findMany(where: any) {
    return this.prisma.forcaTrabalho.findMany(where);
  }
}
