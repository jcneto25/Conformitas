import { Module } from '@nestjs/common';
import { RiscosService } from './riscos.service';
import { RiscosController } from './riscos.controller';

@Module({ controllers: [RiscosController], providers: [RiscosService], exports: [RiscosService] })
export class RiscosModule {}
