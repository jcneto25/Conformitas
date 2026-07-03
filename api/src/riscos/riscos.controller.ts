import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RiscosService } from './riscos.service';
import { CreateRiscoDto } from './dto/create-risco.dto';
import { UpdateRiscoDto } from './dto/update-risco.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('riscos')
@Controller('riscos')
@ApiBearerAuth()
export class RiscosController {
  constructor(private readonly service: RiscosService) {}

  @Post()
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Cadastrar risco (P01, P02) — nível calculado automaticamente' })
  create(@Body() dto: CreateRiscoDto) { return this.service.create(dto); }

  @Get()
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar riscos (P01, P02, P10)' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'nivel', required: false })
  findAll(@Query('categoria') categoria?: string, @Query('status') status?: string, @Query('nivel') nivel?: string) {
    return this.service.findAll({ categoria, status, nivel });
  }

  @Get('matriz')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Matriz de riscos com agrupamento por nível (5 níveis)' })
  matriz() { return this.service.matrizRiscos(); }

  @Get('resumo-categoria')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Resumo de riscos agrupado por categoria' })
  resumoPorCategoria() { return this.service.resumoPorCategoria(); }

  @Get(':id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter risco por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Atualizar risco — recalcula nível se prob/impacto mudar' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateRiscoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Remover risco (P01)' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
