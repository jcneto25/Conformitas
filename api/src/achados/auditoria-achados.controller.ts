import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AchadosService } from './achados.service';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateAchadoDto } from './dto/create-achado.dto';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

/**
 * Rotas aninhadas em auditoria — honra o contrato do PRP-006 §3:
 *   POST /api/v1/auditorias/{id}/achados   (P02)
 *   GET  /api/v1/auditorias/{id}/achados   (P01, P02, P05 — própria unidade)
 */
@ApiTags('achados')
@ApiBearerAuth()
@Controller('auditorias/:auditoriaId/achados')
export class AuditoriaAchadosController {
  constructor(private readonly service: AchadosService) {}

  @Post()
  @Roles('P02')
  @ApiOperation({ summary: 'Criar achado de auditoria (4 atributos CNJ obrigatórios)' })
  criar(
    @Param('auditoriaId') auditoriaId: string,
    @Body() dto: CreateAchadoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.create(auditoriaId, dto, req.user.sub);
  }

  @Get()
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Listar achados de uma auditoria (escopo: própria unidade)' })
  listar(@Param('auditoriaId') auditoriaId: string, @Req() req: RequestWithUser) {
    return this.service.findAll({ auditoriaId }, req.user?.unidadeEscopo);
  }
}
