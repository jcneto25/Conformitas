import { Controller, Get, Post, Param, Body, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { EvidenciasService } from './evidencias.service';
import { PapeisTrabalhoService } from './papeis-trabalho.service';
import { RequisicoesService } from './requisicoes.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';

interface RequestWithUser extends Request { user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null }; }

@ApiTags('auditorias')
@Controller('auditorias/:auditoriaId')
@ApiBearerAuth()
export class AuditoriaEvidenciasController {
  constructor(private readonly service: EvidenciasService) {}

  @Post('evidencias')
  @Roles('P02')
  criar(@Param('auditoriaId') id: string, @Body() dto: CriarEvidenciaDto) { return this.service.criar(id, dto, ''); }
  @Get('evidencias')
  @Roles('P01', 'P02', 'P10')
  listar(@Param('auditoriaId') id: string) { return this.service.listar(id); }
}

@ApiTags('auditorias')
@Controller('auditorias/:auditoriaId')
@ApiBearerAuth()
export class AuditoriaPapeisController {
  constructor(private readonly service: PapeisTrabalhoService) {}
  @Post('papeis-trabalho')
  @Roles('P02')
  criar(@Param('auditoriaId') id: string, @Body() dto: CriarPapelTrabalhoDto, @Req() req: RequestWithUser) { return this.service.criar(id, dto, req.user.sub); }
  @Get('papeis-trabalho')
  @Roles('P01', 'P02', 'P10')
  listar(@Param('auditoriaId') id: string) { return this.service.listar(id); }
}

@ApiTags('auditorias')
@Controller('auditorias/:auditoriaId')
@ApiBearerAuth()
export class AuditoriaRequisicoesController {
  constructor(private readonly service: RequisicoesService) {}
  @Post('requisicoes')
  @Roles('P02')
  criar(@Param('auditoriaId') id: string, @Body() dto: CriarRequisicaoDto) { return this.service.criar(id, dto); }
  @Get('requisicoes')
  @Roles('P01', 'P02', 'P10')
  listar(@Param('auditoriaId') id: string) { return this.service.listar(id); }
}
