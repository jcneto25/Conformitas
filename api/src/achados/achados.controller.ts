import {
  Controller, Get, Post, Patch, Param, Body, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AchadosService } from './achados.service';

@ApiTags('achados')
@ApiBearerAuth()
@Controller('achados')
export class AchadosController {
  constructor(private readonly service: AchadosService) {}

  @Post()
  @ApiOperation({ summary: 'Criar achado de auditoria' })
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Listar achados (com filtros)' })
  findAll(@Query() query: any) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhar achado' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar achado' })
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  // ── Workflow ──────────────────────────────────

  @Post(':id/enviar-manifestacao')
  @ApiOperation({ summary: 'Enviar achado para manifestação da unidade auditada' })
  enviarManifestacao(
    @Param('id') id: string,
    @Body('prazoDias') prazoDias?: number,
  ) {
    return this.service.enviarManifestacao(id, prazoDias);
  }

  @Post(':id/consolidar')
  @ApiOperation({ summary: 'Consolidar achado após manifestação' })
  consolidar(@Param('id') id: string) {
    return this.service.consolidar(id);
  }

  // ── Manifestações ─────────────────────────────

  @Post(':id/manifestacoes')
  @ApiOperation({ summary: 'Registrar manifestação da unidade auditada' })
  criarManifestacao(@Param('id') id: string, @Body() body: any) {
    return this.service.criarManifestacao(id, body);
  }

  @Get(':id/manifestacoes')
  @ApiOperation({ summary: 'Listar manifestações de um achado' })
  listarManifestacoes(@Param('id') id: string) {
    return this.service.listarManifestacoes(id);
  }
}
