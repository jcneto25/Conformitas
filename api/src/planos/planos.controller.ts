import { Controller, Get, Post, Delete, Body, Param, Query, Req, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PlanosService } from './planos.service';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { CreateItemPlanoDto } from './dto/create-item-plano.dto';
import { CreateForcaTrabalhoDto } from './dto/create-forca-trabalho.dto';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[] };
}

@ApiTags('planos')
@Controller()
@ApiBearerAuth()
export class PlanosController {
  constructor(private readonly service: PlanosService) {}

  // ── Planos ────────────────────────────────────

  @Post('planos')
  @Roles('P01')
  @ApiOperation({ summary: 'Criar plano PALP/PAA (P01)' })
  create(@Req() req: RequestWithUser, @Body() dto: CreatePlanoDto) {
    return this.service.create(dto, req.user.sub);
  }

  @Get('planos')
  @Roles('P01', 'P02', 'P03')
  @ApiOperation({ summary: 'Listar planos' })
  findAll(@Query('tipo') tipo?: string, @Query('ano') ano?: string, @Query('status') status?: string) {
    return this.service.findAll({
      tipo,
      ano: ano ? parseInt(ano, 10) : undefined,
      status,
    });
  }

  @Get('planos/:id')
  @Roles('P01', 'P02', 'P03')
  @ApiOperation({ summary: 'Obter plano por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('planos/:id/submeter')
  @Roles('P01')
  @ApiOperation({ summary: 'Submeter plano para aprovação (P01)' })
  submeter(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.submeter(id);
  }

  @Post('planos/:id/aprovar')
  @Roles('P03')
  @ApiOperation({ summary: 'Aprovar plano (P03)' })
  aprovar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.aprovar(id);
  }

  @Post('planos/:id/publicar')
  @Roles('P03')
  @ApiOperation({ summary: 'Publicar plano (P03)' })
  publicar(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.publicar(id);
  }

  @Post('planos/:id/revisao')
  @Roles('P01')
  @ApiOperation({ summary: 'Criar nova revisão do plano (P01)' })
  criarRevisao(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.criarRevisao(id, req.user.sub);
  }

  // ── Itens ─────────────────────────────────────

  @Post('planos/:id/itens')
  @Roles('P01')
  @ApiOperation({ summary: 'Adicionar item ao plano (P01)' })
  adicionarItem(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateItemPlanoDto) {
    return this.service.adicionarItem(id, dto);
  }

  @Get('planos/:id/itens')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar itens do plano' })
  listarItens(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarItens(id);
  }

  @Delete('itens-plano/:id')
  @Roles('P01')
  @ApiOperation({ summary: 'Remover item do plano (P01)' })
  removerItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removerItem(id);
  }

  // ── Força de Trabalho ─────────────────────────

  @Post('forca-trabalho')
  @Roles('P01')
  @ApiOperation({ summary: 'Adicionar força de trabalho (P01)' })
  adicionarForcaTrabalho(@Body() dto: CreateForcaTrabalhoDto) {
    const { planoId, ...rest } = dto;
    return this.service.adicionarForcaTrabalho(planoId, rest);
  }

  @Get('forca-trabalho')
  @Roles('P01', 'P02')
  @ApiOperation({ summary: 'Listar força de trabalho' })
  listarForcaTrabalho(@Query('plano_id') planoId?: string, @Query('ano') ano?: string) {
    return this.service.listarForcaTrabalho(planoId, ano ? parseInt(ano, 10) : undefined);
  }
}
