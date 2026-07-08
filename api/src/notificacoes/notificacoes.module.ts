import { Module, Global } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificacoesService } from './notificacoes.service';
import { NotificacoesController } from './notificacoes.controller';
import { NotificacaoEventHandler } from './handlers/notificacao-event-handler';
import { PrismaNotificacaoRepository } from './repositories/prisma-notificacao.repository';
import { NOTIFICACAO_REPOSITORY } from './repositories/notificacao.repository';
@Global()
@Module({
  imports: [PrismaModule],
  controllers: [NotificacoesController],
  providers: [
    NotificacoesService,
    NotificacaoEventHandler,
    { provide: NOTIFICACAO_REPOSITORY, useClass: PrismaNotificacaoRepository },
  ],
  exports: [NotificacoesService],
})
export class NotificacoesModule {}
