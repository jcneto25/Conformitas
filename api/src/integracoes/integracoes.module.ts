import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IntegracoesService } from './integracoes.service';
import { IntegracoesController } from './integracoes.controller';
import { OuvidoriaConnector } from './ouvidoria-connector';

@Module({
  imports: [PrismaModule],
  controllers: [IntegracoesController],
  providers: [IntegracoesService, OuvidoriaConnector],
  exports: [IntegracoesService, OuvidoriaConnector],
})
export class IntegracoesModule {}
