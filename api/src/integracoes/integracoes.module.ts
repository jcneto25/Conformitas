import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';

@Module({ imports: [PrismaModule], controllers: [IntegracoesController], providers: [IntegracoesService], exports: [IntegracoesService] })
export class IntegracoesModule {}
