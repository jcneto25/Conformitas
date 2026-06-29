import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultoriasService } from './consultorias.service';

@ApiTags('consultorias')
@ApiBearerAuth()
@Controller('consultorias')
export class ConsultoriasController {
  constructor(private readonly service: ConsultoriasService) {}

  // ── Consultorias ──────────────────────────────

  @Get()
  @ApiOperation({ summary: 'Listar consultorias (filtro: tipo)' })
  findAll(@Query('tipo') tipo?: string) {
    return this.service.listarConsultorias(tipo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter consultoria por ID' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Registrar consultoria (ASSESSORAMENTO/CONSULTORIA/COGESTAO)' })
  registrarConsultoria(@Body() body: any) {
    return this.service.registrarConsultoria(body);
  }

  // ── Solicitações ──────────────────────────────

  @Post('solicitacoes')
  @ApiOperation({ summary: 'Criar solicitação de consultoria (P05)' })
  criarSolicitacao(@Body() body: any) {
    return this.service.criarSolicitacao(body);
  }

  @Get('solicitacoes')
  @ApiOperation({ summary: 'Listar solicitações de consultoria' })
  listarSolicitacoes(@Query('status') status?: string) {
    return this.service.listarSolicitacoes(status);
  }

  @Post('solicitacoes/:id/aceitar')
  @ApiOperation({ summary: 'Aceitar solicitação de consultoria (P01)' })
  aceitarSolicitacao(@Param('id') id: string) {
    return this.service.aceitarSolicitacao(id);
  }
}
