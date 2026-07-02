import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { IntegracoesService } from './integracoes.service';
import { CreateIntegracaoDto, UpdateIntegracaoDto } from './dto/integracao.dto';

@ApiTags('integracoes')
@Controller('integracoes')
@ApiBearerAuth()
export class IntegracoesController {
  constructor(private readonly service: IntegracoesService) {}

  @Get()
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Listar todas as integrações' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Obter integração por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('P10')
  @ApiOperation({ summary: 'Criar nova integração' })
  create(@Body() dto: CreateIntegracaoDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('P10')
  @ApiOperation({ summary: 'Atualizar integração' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateIntegracaoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P10')
  @ApiOperation({ summary: 'Remover integração' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Post(':id/health')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Executar health check em integração' })
  healthCheck(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.healthCheck(id);
  }

  @Get('health/all')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Health check de todas as integrações' })
  healthAll() {
    return this.service.healthAll();
  }

  @Get(':id/logs')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Logs de integração' })
  logs(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.logs(id);
  }
}
