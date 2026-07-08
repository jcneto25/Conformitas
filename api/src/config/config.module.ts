import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigService } from './config.service';
import { ConfigController } from './config.controller';
import { PrismaConfiguracaoRepository } from './repositories/prisma-configuracao.repository';
import { CONFIGURACAO_REPOSITORY } from './repositories/configuracao.repository';
@Module({
  imports: [PrismaModule],
  controllers: [ConfigController],
  providers: [ConfigService, { provide: CONFIGURACAO_REPOSITORY, useClass: PrismaConfiguracaoRepository }],
  exports: [ConfigService],
})
export class ConfigModule {}
