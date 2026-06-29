import { Controller, Get, Post, Patch, Put, Body, Param, Query, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { EticaService } from './etica.service';
import { CreateDeclaracaoDto } from './dto/create-declaracao.dto';
import { CreateImpedimentoDto } from './dto/create-impedimento.dto';
import { ClassificarDocumentoDto } from './dto/classificar-documento.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[] };
}

@ApiTags('etica')
@Controller()
@ApiBearerAuth()
export class EticaController {
  constructor(private readonly service: EticaService) {}

  // ── Declarações de Independência ──────────────

  @Post('declaracoes-independencia')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Registrar declaração de independência (P01, P02)' })
  criarDeclaracao(@Req() req: RequestWithUser, @Body() dto: CreateDeclaracaoDto) {
    return this.service.criarDeclaracao(req.user.sub, dto);
  }

  @Get('declaracoes-independencia')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar declarações de independência' })
  listarDeclaracoes(@Query('usuario_id') usuarioId?: string) {
    return this.service.listarDeclaracoes(usuarioId);
  }

  // ── Impedimentos ──────────────────────────────

  @Post('impedimentos')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Registrar impedimento (P01, P02)' })
  criarImpedimento(@Req() req: RequestWithUser, @Body() dto: CreateImpedimentoDto) {
    return this.service.criarImpedimento(req.user.sub, dto);
  }

  @Get('impedimentos')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Listar impedimentos' })
  listarImpedimentos(@Query('auditoria_id') auditoriaId?: string) {
    return this.service.listarImpedimentos(auditoriaId);
  }

  @Patch('impedimentos/:id/aceitar')
  @Roles('P01')
  @ApiOperation({ summary: 'Aceitar impedimento (P01)' })
  aceitarImpedimento(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.aceitarImpedimento(id);
  }

  @Get('verificar-conflitos')
  @Roles('P01')
  @ApiOperation({ summary: 'Verificar conflitos de um usuário (P01)' })
  verificarConflitos(@Query('usuario_id') usuarioId: string, @Query('unidade') unidade: string) {
    return this.service.verificarConflitos(usuarioId, unidade);
  }

  // ── Classificação de Documentos ───────────────

  @Put(':entidadeTipo/:id/classificacao')
  @Roles('P01')
  @ApiOperation({ summary: 'Classificar documento por nível de sigilo (P01)' })
  classificarDocumento(
    @Req() req: RequestWithUser,
    @Param('entidadeTipo') entidadeTipo: string,
    @Param('id', ParseUUIDPipe) entidadeId: string,
    @Body() dto: ClassificarDocumentoDto,
  ) {
    return this.service.classificarDocumento(entidadeTipo, entidadeId, req.user.sub, dto);
  }

  @Get(':entidadeTipo/:id/classificacao')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter classificação de sigilo de documento' })
  obterClassificacao(@Param('entidadeTipo') entidadeTipo: string, @Param('id', ParseUUIDPipe) entidadeId: string) {
    return this.service.obterClassificacao(entidadeTipo, entidadeId);
  }

  // ── Trilha de Acesso Sigiloso ─────────────────

  @Get('trilha-acesso-sigiloso')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Listar trilha de acesso a documentos sigilosos (P01, P10)' })
  listarTrilhaAcesso(@Query('entidade_tipo') entidadeTipo?: string, @Query('entidade_id') entidadeId?: string) {
    return this.service.listarTrilhaAcesso(entidadeTipo, entidadeId);
  }
}
