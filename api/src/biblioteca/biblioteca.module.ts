import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BibliotecaService } from './biblioteca.service';
import { BibliotecaController } from './biblioteca.controller';
import { PrismaDocumentoRepository } from './repositories/prisma-documento.repository';
import { DOCUMENTO_REPOSITORY } from './repositories/documento.repository';

@Module({
  imports: [PrismaModule],
  controllers: [BibliotecaController],
  providers: [BibliotecaService, { provide: DOCUMENTO_REPOSITORY, useClass: PrismaDocumentoRepository }],
})
export class BibliotecaModule {}
