import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { QualidadeService } from './qualidade.service';
import { QualidadeController } from './qualidade.controller';

@Module({ imports: [PrismaModule], controllers: [QualidadeController], providers: [QualidadeService], exports: [QualidadeService] })
export class QualidadeModule {}
