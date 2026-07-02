import { Controller, Get, Post, Patch, Body, Param, Query, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AuditoriasService } from './auditorias.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

@ApiTags('auditorias')
@Controller()
@ApiBearerAuth()
export class AuditoriasController {
  constructor(private readonly service: AuditoriasService) {}

  @Post('auditorias')
  @Roles('P01')
  @ApiOperation({ summary: 'Abrir auditoria a partir de item do PAA (P01)' })
  create(@Body() dto: CreateAuditoriaDto) {
    return this.service.create(dto);
  }

  @Get('auditorias')
  @Roles('P01', 'P02', 'P05', 'P10')
  @ApiOperation({ summary: 'Listar auditorias' })
  findAll(
    @Query('status') status?: string,
    @Query('unidade') unidade?: string,
    @Query('search') search?: string,
    @Req() req?: RequestWithUser,
  ) {
    return this.service.findAll({ status, unidade, search }, req?.user?.unidadeEscopo);
  }

  @Get('auditorias/:id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter auditoria por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('auditorias/:id/iniciar')
  @Roles('P01')
  @ApiOperation({ summary: 'Iniciar execução da auditoria (P01)' })
  iniciarExecucao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.iniciarExecucao(id);
  }

  @Post('auditorias/:id/concluir')
  @Roles('P01')
  @ApiOperation({ summary: 'Concluir auditoria (P01)' })
  concluir(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluir(id);
  }

  @Post('auditorias/:id/suspender')
  @Roles('P01')
  @ApiOperation({ summary: 'Suspender auditoria (P01)' })
  suspender(@Param('id', ParseUUIDPipe) id: string, @Body('motivo') motivo: string) {
    return this.service.suspender(id, motivo);
  }

  @Post('auditorias/:id/comunicado')
  @Roles('P01')
  @ApiOperation({ summary: 'Gerar comunicado de auditoria (P01)' })
  gerarComunicado(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.gerarComunicado(id, req.user.sub);
  }

  // ── Evidências ───────────────────────────────

  @Post('auditorias/:id/evidencias')
  @Roles('P02')
  @ApiOperation({ summary: 'Adicionar evidência à auditoria (P02)' })
  criarEvidencia(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarEvidenciaDto) {
    return this.service.criarEvidencia(id, dto);
  }

  @Get('auditorias/:id/evidencias')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar evidências da auditoria' })
  listarEvidencias(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarEvidencias(id);
  }

  // ── Papéis de Trabalho ───────────────────────

  @Post('auditorias/:id/papeis-trabalho')
  @Roles('P02')
  @ApiOperation({ summary: 'Criar papel de trabalho (P02)' })
  criarPapelTrabalho(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CriarPapelTrabalhoDto,
  ) {
    return this.service.criarPapelTrabalho(id, dto, req.user.sub);
  }

  @Get('auditorias/:id/papeis-trabalho')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar papéis de trabalho da auditoria' })
  listarPapeisTrabalho(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarPapeisTrabalho(id);
  }

  // ── Requisições ──────────────────────────────

  @Post('auditorias/:id/requisicoes')
  @Roles('P02')
  @ApiOperation({ summary: 'Emitir requisição à unidade auditada (P02)' })
  criarRequisicao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarRequisicaoDto) {
    return this.service.criarRequisicao(id, dto);
  }

  @Get('auditorias/:id/requisicoes')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar requisições da auditoria' })
  listarRequisicoes(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarRequisicoes(id);
  }
}
