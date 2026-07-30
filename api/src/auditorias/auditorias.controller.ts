import { Controller, Get, Post, Patch, Body, Param, Query, Req, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { AuditoriasService } from './auditorias.service';
import { EvidenciasService } from './evidencias.service';
import { AbrirAuditoriaUseCase } from './use-cases/abrir-auditoria.use-case';
import { IniciarExecucaoUseCase } from './use-cases/iniciar-execucao.use-case';
import { ConcluirAuditoriaUseCase } from './use-cases/concluir-auditoria.use-case';
import { SuspenderAuditoriaUseCase } from './use-cases/suspender-auditoria.use-case';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { ExigeClassificacao } from '../common/decorators/classificacao.decorator';

interface RequestWithUser extends Request { user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null }; }

@ApiTags('auditorias')
@Controller()
@ApiBearerAuth()
export class AuditoriasController {
  constructor(
    private readonly abrirUseCase: AbrirAuditoriaUseCase,
    private readonly iniciarExecucaoUseCase: IniciarExecucaoUseCase,
    private readonly concluirUseCase: ConcluirAuditoriaUseCase,
    private readonly suspenderUseCase: SuspenderAuditoriaUseCase,
    private readonly service: AuditoriasService,
    private readonly evidenciasService: EvidenciasService,
  ) {}

  @Post('auditorias')
  @Roles('P01')
  create(@Req() req: RequestWithUser, @Body() dto: CreateAuditoriaDto) { return this.abrirUseCase.execute(dto, req.user.sub); }

  @Get('auditorias')
  @Roles('P01', 'P02', 'P05', 'P10')
  findAll(@Query('status') status?: string, @Query('unidade') unidade?: string, @Query('search') search?: string, @Query('page') page?: string, @Query('limit') limit?: string, @Req() req?: RequestWithUser) {
    const p = page ? parseInt(page, 10) : undefined;
    const l = limit ? parseInt(limit, 10) : undefined;
    return this.service.findAll({ status, unidade, search, page: p, limit: l }, req?.user?.unidadeEscopo);
  }

  @Get('auditorias/:id')
  @Roles('P01', 'P02', 'P10')
  @ExigeClassificacao({ entidadeTipo: 'auditoria', entidadeIdParam: 'id' })
  findOne(@Param('id', ParseUUIDPipe) id: string) { return this.service.findOne(id); }

  @Post('auditorias/:id/iniciar')
  @Roles('P01')
  iniciarExecucao(@Param('id', ParseUUIDPipe) id: string) { return this.iniciarExecucaoUseCase.execute(id); }

  @Patch('auditorias/:id')
  @Roles('P01')
  atualizarStatus(@Param('id', ParseUUIDPipe) id: string, @Body() body: { status: string; motivo?: string }) {
    const statusMap: Record<string, () => any> = {
      'EM_EXECUCAO': () => this.iniciarExecucaoUseCase.execute(id),
      'CONCLUIDA': () => this.concluirUseCase.execute(id),
      'SUSPENSA': () => this.suspenderUseCase.execute(id, body.motivo ?? ''),
    };
    const handler = statusMap[body.status];
    if (!handler) throw new BadRequestException(`Status inválido: ${body.status}`);
    return handler();
  }

  @Post('auditorias/:id/concluir')
  @Roles('P01')
  concluir(@Param('id', ParseUUIDPipe) id: string) { return this.concluirUseCase.execute(id); }

  @Post('auditorias/:id/suspender')
  @Roles('P01')
  suspender(@Param('id', ParseUUIDPipe) id: string, @Body('motivo') motivo: string) { return this.suspenderUseCase.execute(id, motivo); }

  @Post('auditorias/:id/comunicado')
  @Roles('P01')
  gerarComunicado(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) { return this.comunicadosService.gerar(id, req.user.sub); }

  @Post('auditorias/:id/evidencias')
  @Roles('P02')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('arquivo', {
    storage: diskStorage({ destination: join(process.cwd(), 'uploads'), filename: (_req, file, cb) => { cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`); } }),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => { const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/tiff', 'application/zip']; if (allowed.includes(file.mimetype)) cb(null, true); else cb(new BadRequestException(`Tipo não permitido: ${file.mimetype}`), false); },
  }))
  criarEvidencia(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarEvidenciaDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Arquivo é obrigatório');
    return this.evidenciasService.criar(id, dto, file.path);
  }

  @Get('auditorias/:id/evidencias')
  @Roles('P01', 'P02', 'P10')
  @ExigeClassificacao({ entidadeTipo: 'auditoria', entidadeIdParam: 'id' })
  listarEvidencias(@Param('id', ParseUUIDPipe) id: string) { return this.evidenciasService.listar(id); }
}
