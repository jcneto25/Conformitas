import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogsSistemaService } from './logs-sistema.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('logs-sistema')
@Controller('logs-sistema')
@ApiBearerAuth()
export class LogsSistemaController {
  constructor(private readonly service: LogsSistemaService) {}

  @Get()
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Listar logs do sistema (P01, P10)' })
  findAll(
    @Query('usuario_id') usuarioId?: string,
    @Query('acao') acao?: string,
    @Query('data_inicio') dataInicio?: string,
    @Query('data_fim') dataFim?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.service.findAll({ usuarioId, acao, dataInicio, dataFim, page, limit });
  }
}
