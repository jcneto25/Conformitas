import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RiscosService } from './riscos.service';
import { RiscosController } from './riscos.controller';

@Module({ imports: [PrismaModule], controllers: [RiscosController], providers: [RiscosService], exports: [RiscosService] })
export class RiscosModule {}
