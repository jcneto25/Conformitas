import { Module } from '@nestjs/common';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';

@Module({ controllers: [IntegracoesController], providers: [IntegracoesService], exports: [IntegracoesService] })
export class IntegracoesModule {}
