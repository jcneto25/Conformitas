import { Controller, Get, Post, Param, Body, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { ConsultoriasService } from './consultorias.service';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

@ApiTags('consultorias')
@ApiBearerAuth()
@Controller()
export class ConsultoriasController {
  constructor(private readonly service: ConsultoriasService) {}

  // ── Solicitações de Consultoria (P05) ─────────

  @Post('solicitacoes-consultoria')
  @Roles('P05')
  @ApiOperation({ summary: 'Criar solicitação de consultoria (P05)' })
  criarSolicitacao(@Req() req: RequestWithUser, @Body() body: any) {
    return this.service.criarSolicitacao({ ...body, solicitanteId: req.user.sub });
  }

  @Get('solicitacoes-consultoria')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Listar solicitações de consultoria (P01)' })
  listarSolicitacoes(@Query('status') status?: string) {
    return this.service.listarSolicitacoes(status);
  }

  @Post('solicitacoes-consultoria/:id/aceitar')
  @Roles('P01')
  @ApiOperation({ summary: 'Aceitar solicitação de consultoria (P01)' })
  aceitarSolicitacao(@Param('id') id: string) {
    return this.service.aceitarSolicitacao(id);
  }

  @Post('solicitacoes-consultoria/:id/recusar')
  @Roles('P01')
  @ApiOperation({ summary: 'Recusar solicitação de consultoria (P01)' })
  recusarSolicitacao(@Param('id') id: string) {
    return this.service.recusarSolicitacao(id);
  }

  @Post('solicitacoes-consultoria/:id/concluir')
  @Roles('P01')
  @ApiOperation({ summary: 'Concluir consultoria com termo de cogestão (P01)' })
  concluirSolicitacao(@Param('id') id: string, @Body() body: { resultado: string }) {
    return this.service.concluirSolicitacao(id, body.resultado);
  }

  // ── Consultorias ──────────────────────────────

  @Get('consultorias')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar consultorias (filtro: tipo)' })
  findAll(@Query('tipo') tipo?: string) {
    return this.service.listarConsultorias(tipo);
  }

  @Get('consultorias/:id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter consultoria por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post('consultorias')
  @Roles('P01')
  @ApiOperation({ summary: 'Registrar consultoria (ASSESSORAMENTO/CONSULTORIA/COGESTAO)' })
  registrarConsultoria(@Body() body: any) {
    return this.service.registrarConsultoria(body);
  }
}
