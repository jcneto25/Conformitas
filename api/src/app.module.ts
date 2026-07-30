import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './common/guards/auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ClassificacaoGuard } from './common/guards/classificacao.guard';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PerfisModule } from './perfis/perfis.module';
import { UniversoModule } from './universo/universo.module';
import { PlanosModule } from './planos/planos.module';
import { AuditoriasModule } from './auditorias/auditorias.module';
import { AchadosModule } from './achados/achados.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { RecomendacoesModule } from './recomendacoes/recomendacoes.module';
import { ConsultoriasModule } from './consultorias/consultorias.module';
import { QualidadeModule } from './qualidade/qualidade.module';
import { RiscosModule } from './riscos/riscos.module';
import { CapacitacoesModule } from './capacitacoes/capacitacoes.module';
import { CompetenciasModule } from './competencias/competencias.module';
import { EticaModule } from './etica/etica.module';
import { GovernancaModule } from './governanca/governanca.module';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { IntegracoesModule } from './integracoes/integracoes.module';
import { AcoesCoordenadasModule } from './acoes-coordenadas/acoes-coordenadas.module';
import { ConfigModule } from './config/config.module';
import { MandatosModule } from './mandatos/mandatos.module';
import { LogsSistemaModule } from './logs/logs-sistema.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { HealthController } from './app.controller';

import appConfig from './config/app.config';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      useFactory: () => {
        const isTest = process.env['NODE_ENV'] === 'test';
        return isTest
          ? [{ ttl: 60000, limit: 1000 }]   // high limit during tests
          : [{ ttl: 60000, limit: 60 }]; // 60 req/min in dev/prod
      },
    }),
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: appConfig.jwt.secret,
      signOptions: { expiresIn: appConfig.jwt.expiresIn },
    }),
    PrismaModule,
    AuthModule,
    UsuariosModule,
    PerfisModule,
    UniversoModule,
    PlanosModule,
    AuditoriasModule,
    AchadosModule,
    RelatoriosModule,
    RecomendacoesModule,
    ConsultoriasModule,
    QualidadeModule,
    RiscosModule,
    CapacitacoesModule,
    CompetenciasModule,
    EticaModule,
    GovernancaModule,
    BibliotecaModule,
    DashboardsModule,
    IntegracoesModule,
    AcoesCoordenadasModule,
    ConfigModule,
    MandatosModule,
    LogsSistemaModule,
    NotificacoesModule,
  ],
  controllers: [HealthController],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ClassificacaoGuard },
  ],
})
export class AppModule {}
