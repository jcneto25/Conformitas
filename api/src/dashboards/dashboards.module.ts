import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DashboardsService } from './dashboards.service';
import { DashboardsController } from './dashboards.controller';
import { PrismaDashboardRepository } from './repositories/prisma-dashboard.repository';
import { DASHBOARD_REPOSITORY } from './repositories/dashboard.repository';
@Module({
  imports: [PrismaModule],
  controllers: [DashboardsController],
  providers: [DashboardsService, { provide: DASHBOARD_REPOSITORY, useClass: PrismaDashboardRepository }],
})
export class DashboardsModule {}
