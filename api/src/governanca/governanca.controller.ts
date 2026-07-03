import { Controller, Get, Post, Put, Param, Body, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GovernancaService } from './governanca.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateDeterminacaoDto } from './dto/create-determinacao.dto';
import { UpdateDeterminacaoDto } from './dto/update-determinacao.dto';
import { CreateRegistroFraudeDto } from './dto/create-registro-fraude.dto';
import { ComunicarFraudeDto } from './dto/comunicar-fraude.dto';

@ApiTags('governanca')
@ApiBearerAuth()
@Controller()
export class GovernancaController {
  constructor(private readonly service: GovernancaService) {}

  // ── Determinações Externas (RF-013.1) ─────────

  @Post('determinacoes-externas')
  @Roles('P01')
  @ApiOperation({ summary: 'Criar determinação externa (TCE/CNJ)' })
  createDeterminacao(@Body() dto: CreateDeterminacaoDto) {
    return this.service.createDeterminacao(dto);
  }

  @Get('determinacoes-externas')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar determinações externas' })
  listarDeterminacoes(@Query('orgao') orgao?: string, @Query('status') status?: string) {
    return this.service.listarDeterminacoes({ orgao, status });
  }

  @Get('determinacoes-externas/:id')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Detalhar determinação externa' })
  buscarDeterminacao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarDeterminacao(id);
  }

  @Put('determinacoes-externas/:id')
  @Roles('P01')
  @ApiOperation({ summary: 'Atualizar determinação externa' })
  atualizarDeterminacao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDeterminacaoDto) {
    return this.service.atualizarDeterminacao(id, dto);
  }

  @Post('determinacoes-externas/:id/concluir')
  @Roles('P01')
  @ApiOperation({ summary: 'Concluir determinação (PENDENTE → CONCLUIDA)' })
  concluirDeterminacao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluirDeterminacao(id);
  }

  // ── Registros de Fraude (RF-013.2) ────────────

  @Post('registros-fraude')
  @Roles('P02')
  @ApiOperation({ summary: 'Registrar indício de fraude' })
  createRegistroFraude(@Body() dto: CreateRegistroFraudeDto) {
    return this.service.createRegistroFraude(dto);
  }

  @Get('registros-fraude')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar registros de fraude' })
  listarRegistrosFraude(
    @Query('classificacao') classificacao?: string,
    @Query('auditoriaId') auditoriaId?: string,
  ) {
    return this.service.listarRegistrosFraude({ classificacao, auditoriaId });
  }

  @Get('registros-fraude/:id')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Detalhar registro de fraude' })
  buscarRegistroFraude(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.buscarRegistroFraude(id);
  }

  @Post('registros-fraude/:id/comunicar')
  @Roles('P01')
  @ApiOperation({ summary: 'Comunicar fraude (SUPERIOR ou TCE) — RF-013.3' })
  comunicar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ComunicarFraudeDto) {
    return this.service.comunicar(id, dto);
  }
}
