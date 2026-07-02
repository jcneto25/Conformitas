import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';
import { AcoesCoordenadasController } from './acoes-coordenadas.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AcoesCoordenadasController],
  providers: [AcoesCoordenadasService],
  exports: [AcoesCoordenadasService],
})
export class AcoesCoordenadasModule {}
