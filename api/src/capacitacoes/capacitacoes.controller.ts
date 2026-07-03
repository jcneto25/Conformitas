import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CapacitacoesService } from './capacitacoes.service';
import { CreateCapacitacaoDto } from './dto/create-capacitacao.dto';
import { UpdateCapacitacaoDto } from './dto/update-capacitacao.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('capacitacoes')
@Controller('capacitacoes')
@ApiBearerAuth()
export class CapacitacoesController {
  constructor(private readonly service: CapacitacoesService) {}

  @Post()
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Registrar capacitação (P01, P10)' })
  create(@Body() dto: CreateCapacitacaoDto) { return this.service.create(dto); }

  @Get()
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar capacitações (P01, P02, P10)' })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'participante_id', required: false })
  findAll(@Query('tipo') tipo?: string, @Query('participante_id') participanteId?: string) {
    return this.service.findAll({ tipo, participanteId });
  }

  @Get('totalizacao/:participanteId')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Totalizar horas de capacitação por participante/ano' })
  @ApiQuery({ name: 'ano', required: false })
  totalizar(@Param('participanteId') participanteId: string, @Query('ano') ano?: string) {
    return this.service.totalizarHoras(participanteId, ano ? parseInt(ano, 10) : undefined);
  }

  @Get('alerta/:participanteId')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Alerta de meta 40h para participante' })
  alerta(@Param('participanteId') participanteId: string) {
    return this.service.alertaMeta(participanteId);
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter capacitação por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Patch(':id')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Atualizar capacitação (P01, P10)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateCapacitacaoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Remover capacitação (P01)' })
  remove(@Param('id', ParseUUIDPipe) id: string) { return this.service.remove(id); }
}
