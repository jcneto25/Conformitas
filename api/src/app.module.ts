import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
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
import { EticaModule } from './etica/etica.module';
import { GovernancaModule } from './governanca/governanca.module';
import { BibliotecaModule } from './biblioteca/biblioteca.module';
import { DashboardsModule } from './dashboards/dashboards.module';
import { IntegracoesModule } from './integracoes/integracoes.module';
import { ConfigModule } from './config/config.module';
import { HealthController } from './app.controller';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    ScheduleModule.forRoot(),
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
    EticaModule,
    GovernancaModule,
    BibliotecaModule,
    DashboardsModule,
    IntegracoesModule,
    ConfigModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
