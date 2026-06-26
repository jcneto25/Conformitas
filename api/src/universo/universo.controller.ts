import { Controller, Get, Post, Patch, Delete, Body, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UniversoService } from './universo.service';
import { CreateUniversoDto } from './dto/create-universo.dto';
import { UpdateUniversoDto } from './dto/update-universo.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('universo-auditavel')
@Controller('universo-auditavel')
@ApiBearerAuth()
export class UniversoController {
  constructor(private readonly service: UniversoService) {}

  @Post()
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Criar item no universo auditável (P01, P02)' })
  create(@Body() dto: CreateUniversoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar universo auditável (P01, P02)' })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'ativo', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('tipo') tipo?: string, @Query('ativo') ativo?: string, @Query('search') search?: string) {
    return this.service.findAll({
      tipo,
      ativo: ativo !== undefined ? ativo === 'true' : undefined,
      search,
    });
  }

  @Get('matriz-priorizacao')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Gerar matriz de priorização (P01, P02)' })
  @ApiQuery({ name: 'horas_disponiveis', required: false })
  matrizPriorizacao(@Query('horas_disponiveis') horas?: string) {
    return this.service.matrizPriorizacao(horas ? parseInt(horas, 10) : undefined);
  }

  @Get(':id')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Obter item do universo por ID (P01, P02)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Atualizar item do universo (P01, P02)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUniversoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Remover item do universo (soft delete, P01)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
