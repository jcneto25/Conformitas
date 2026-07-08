import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { PrismaUsuarioRepository } from './repositories/prisma-usuario.repository';
import { USUARIO_REPOSITORY } from './repositories/usuario.repository';
@Module({
  imports: [PrismaModule],
  controllers: [UsuariosController],
  providers: [UsuariosService, { provide: USUARIO_REPOSITORY, useClass: PrismaUsuarioRepository }],
  exports: [UsuariosService],
})
export class UsuariosModule {}
