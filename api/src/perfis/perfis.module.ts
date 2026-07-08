import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PerfisService } from './perfis.service';
import { PerfisController } from './perfis.controller';
import { PrismaPerfilRepository } from './repositories/prisma-perfil.repository';
import { PrismaUsuarioPerfilRepository } from './repositories/prisma-usuario-perfil.repository';
import { PERFIL_REPOSITORY } from './repositories/perfil.repository';
import { USUARIO_PERFIL_REPOSITORY } from './repositories/usuario-perfil.repository';
@Module({
  imports: [PrismaModule],
  controllers: [PerfisController],
  providers: [
    PerfisService,
    { provide: PERFIL_REPOSITORY, useClass: PrismaPerfilRepository },
    { provide: USUARIO_PERFIL_REPOSITORY, useClass: PrismaUsuarioPerfilRepository },
  ],
})
export class PerfisModule {}
