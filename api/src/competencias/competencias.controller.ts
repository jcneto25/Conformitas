import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CompetenciasService } from './competencias.service';
import { CreateCompetenciaDto } from './dto/create-competencia.dto';
import { UpdateCompetenciaDto } from './dto/update-competencia.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('competencias')
@Controller('competencias')
@ApiBearerAuth()
export class CompetenciasController {
  constructor(private readonly service: CompetenciasService) {}

  @Post()
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Cadastrar competência (P01, P10)' })
  create(@Body() dto: CreateCompetenciaDto) { return this.service.create(dto); }

  @Get()
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar competências (P01, P02, P10)' })
  @ApiQuery({ name: 'tipo', required: false, enum: ['TECNICA', 'GERENCIAL'] })
  findAll(@Query('tipo') tipo?: string) { return this.service.findAll({ tipo }); }

  @Get(':id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter competência por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Atualizar competência (P01, P10)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCompetenciaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Remover competência (P01)' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
