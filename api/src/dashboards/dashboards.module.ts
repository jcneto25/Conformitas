import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';

@Module({ imports: [PrismaModule], controllers: [DashboardsController], providers: [DashboardsService], exports: [DashboardsService] })
export class DashboardsModule {}
