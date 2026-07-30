import { Controller, Get, Post, Patch, Param, Body, Query, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { QualidadeService } from './qualidade.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateAvaliacaoDto } from './dto/create-avaliacao.dto';
import { UpdateAvaliacaoDto } from './dto/update-avaliacao.dto';
import { CreateNaoConformidadeDto } from './dto/create-nao-conformidade.dto';
import { UpdateNaoConformidadeDto } from './dto/update-nao-conformidade.dto';
import { CreateIndicadorDto } from './dto/create-indicador.dto';
import { UpdateIndicadorDto } from './dto/update-indicador.dto';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[] };
}

@ApiTags('qualidade')
@ApiBearerAuth()
@Controller('qualidade')
export class QualidadeController {
  constructor(private readonly service: QualidadeService) {}

  // ── Avaliações ────────────────────────────────

  @Post('avaliacoes')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Criar avaliação de qualidade (RF-011.1, RF-011.3)' })
  createAvaliacao(@Body() dto: CreateAvaliacaoDto, @Req() req: RequestWithUser) {
    return this.service.createAvaliacao(dto, req.user.sub);
  }

  @Get('avaliacoes')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Listar avaliações de qualidade' })
  listarAvaliacoes(@Query('tipo') tipo?: string, @Query('status') status?: string) {
    return this.service.listarAvaliacoes({ tipo, status });
  }

  @Get('avaliacoes/:id')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Detalhar avaliação de qualidade' })
  buscarAvaliacao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarAvaliacao(id);
  }

  @Patch('avaliacoes/:id')
  @Roles('P01')
  @ApiOperation({ summary: 'Atualizar avaliação (apenas RASCUNHO)' })
  atualizarAvaliacao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAvaliacaoDto) {
    return this.service.atualizarAvaliacao(id, dto);
  }

  @Post('avaliacoes/:id/concluir')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Concluir avaliação (RASCUNHO → CONCLUIDA)' })
  concluirAvaliacao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluirAvaliacao(id);
  }

  @Post('avaliacoes/:id/homologar')
  @Roles('P01')
  @ApiOperation({ summary: 'Homologar avaliação (CONCLUIDA → HOMOLOGADA, P01)' })
  homologarAvaliacao(@Param('id', ParseUUIDPipe) id: string, @Req() req: RequestWithUser) {
    return this.service.homologarAvaliacao(id, req.user.sub);
  }

  // ── Não Conformidades ─────────────────────────

  @Post('avaliacoes/:avaliacaoId/nao-conformidades')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Criar não conformidade vinculada a uma avaliação (RF-011.2)' })
  criarNaoConformidade(
    @Param('avaliacaoId', ParseUUIDPipe) avaliacaoId: string,
    @Body() dto: CreateNaoConformidadeDto,
  ) {
    return this.service.criarNaoConformidade(avaliacaoId, dto);
  }

  @Get('nao-conformidades')
  @Roles('P01', 'P07')
  @ApiOperation({ summary: 'Listar não conformidades (opcional: filtrar por avaliação)' })
  listarNaoConformidades(@Query('avaliacaoId') avaliacaoId?: string) {
    return this.service.listarNaoConformidades(avaliacaoId);
  }

  @Patch('nao-conformidades/:id/acao-corretiva')
  @Roles('P01')
  @ApiOperation({ summary: 'Registrar ação corretiva (ABERTA → EM_CORRECAO)' })
  registrarAcaoCorretiva(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNaoConformidadeDto) {
    return this.service.registrarAcaoCorretiva(id, dto);
  }

  @Post('nao-conformidades/:id/concluir')
  @Roles('P01')
  @ApiOperation({ summary: 'Concluir não conformidade (EM_CORRECAO → CORRIGIDA)' })
  concluirNaoConformidade(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluirNaoConformidade(id);
  }

  // ── Indicadores ───────────────────────────────

  @Post('indicadores')
  @Roles('P01')
  @ApiOperation({ summary: 'Criar indicador de qualidade (RF-011.4)' })
  criarIndicador(@Body() dto: CreateIndicadorDto) {
    return this.service.criarIndicador(dto);
  }

  @Get('indicadores')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar indicadores de qualidade' })
  listarIndicadores() {
    return this.service.listarIndicadores();
  }

  @Patch('indicadores/:id')
  @Roles('P01')
  @ApiOperation({ summary: 'Atualizar indicador de qualidade (inclui valorAtual)' })
  atualizarIndicador(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateIndicadorDto) {
    return this.service.atualizarIndicador(id, dto);
  }
}
