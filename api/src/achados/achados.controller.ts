import { Controller, Get, Post, Patch, Param, Body, Query, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { AchadosService } from './achados.service';
import { CriarAchadoUseCase } from './use-cases/criar-achado.use-case';
import { EnviarManifestacaoUseCase } from './use-cases/enviar-manifestacao.use-case';
import { ConsolidarAchadoUseCase } from './use-cases/consolidar-achado.use-case';
import { RegistrarManifestacaoUseCase } from './use-cases/registrar-manifestacao.use-case';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateAchadoDto } from './dto/create-achado.dto';
import { CreateManifestacaoDto } from './dto/create-manifestacao.dto';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

@ApiTags('achados')
@ApiBearerAuth()
@Controller('achados')
export class AchadosController {
  constructor(
    private readonly enviarManifestacaoUseCase: EnviarManifestacaoUseCase,
    private readonly consolidarUseCase: ConsolidarAchadoUseCase,
    private readonly registrarManifestacaoUseCase: RegistrarManifestacaoUseCase,
    private readonly service: AchadosService,
  ) {}

  @Get()
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Quadro de achados (com filtros status/tipo)' })
  findAll(@Query() query: any, @Req() req: RequestWithUser) {
    return this.service.findAll(query, req.user?.unidadeEscopo);
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Detalhar achado' })
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.service.findOne(id, req.user?.unidadeEscopo);
  }

  @Patch(':id')
  @Roles('P02')
  @ApiOperation({ summary: 'Atualizar achado (apenas PRELIMINAR)' })
  update(@Param('id') id: string, @Body() body: Partial<CreateAchadoDto>) {
    return this.service.update(id, body);
  }

  // ── Workflow ──────────────────────────────────

  @Post(':id/enviar-manifestacao')
  @Roles('P02')
  @ApiOperation({ summary: 'Enviar achado para manifestação da unidade auditada' })
  enviarManifestacao(@Param('id') id: string, @Body('prazoDiasUteis') prazoDiasUteis?: number) {
    return this.enviarManifestacaoUseCase.execute(id, prazoDiasUteis);
  }

  @Patch(':id/status')
  @Roles('P02')
  @ApiOperation({ summary: 'Atualizar status do achado (PATCH — compat)' })
  atualizarStatus(@Param('id') id: string, @Body() body: { status: string; prazoDiasUteis?: number }) {
    const statusMap: Record<string, () => any> = {
      'EM_MANIFESTACAO': () => this.enviarManifestacaoUseCase.execute(id, body.prazoDiasUteis),
      'CONSOLIDADO': () => this.consolidarUseCase.execute(id),
    };
    const handler = statusMap[body.status];
    if (!handler) throw new BadRequestException(`Status inválido: ${body.status}`);
    return handler();
  }

  @Post(':id/consolidar')
  @Roles('P02')
  @ApiOperation({ summary: 'Consolidar achado (manual)' })
  consolidar(@Param('id') id: string) {
    return this.consolidarUseCase.execute(id);
  }

  // ── Manifestações ─────────────────────────────

  @Post(':id/manifestacoes')
  @Roles('P05')
  @ApiOperation({ summary: 'Registrar manifestação da unidade auditada' })
  criarManifestacao(@Param('id') id: string, @Body() dto: CreateManifestacaoDto, @Req() req: RequestWithUser) {
    return this.registrarManifestacaoUseCase.execute(id, dto, req.user.sub, req.user?.unidadeEscopo);
  }

  @Get(':id/manifestacoes')
  @Roles('P01', 'P02', 'P05')
  @ApiOperation({ summary: 'Listar manifestações de um achado' })
  listarManifestacoes(@Param('id') id: string) {
    return this.service.listarManifestacoes(id);
  }
}
