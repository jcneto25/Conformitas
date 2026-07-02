import { Controller, Get, Post, Patch, Body, Param, Query, Req, ParseUUIDPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { Request } from 'express';
import { AuditoriasService } from './auditorias.service';
import { CreateAuditoriaDto } from './dto/create-auditoria.dto';
import { CriarEvidenciaDto } from './dto/criar-evidencia.dto';
import { CriarPapelTrabalhoDto } from './dto/criar-papel-trabalho.dto';
import { CriarRequisicaoDto } from './dto/criar-requisicao.dto';
import { Roles } from '../common/decorators/roles.decorator';

interface RequestWithUser extends Request {
  user: { sub: string; email: string; roles: string[]; unidadeEscopo?: string | null };
}

@ApiTags('auditorias')
@Controller()
@ApiBearerAuth()
export class AuditoriasController {
  constructor(private readonly service: AuditoriasService) {}

  @Post('auditorias')
  @Roles('P01')
  @ApiOperation({ summary: 'Abrir auditoria a partir de item do PAA (P01)' })
  create(@Req() req: RequestWithUser, @Body() dto: CreateAuditoriaDto) {
    return this.service.create(dto, req.user.sub);
  }

  @Get('auditorias')
  @Roles('P01', 'P02', 'P05', 'P10')
  @ApiOperation({ summary: 'Listar auditorias' })
  findAll(
    @Query('status') status?: string,
    @Query('unidade') unidade?: string,
    @Query('search') search?: string,
    @Req() req?: RequestWithUser,
  ) {
    return this.service.findAll({ status, unidade, search }, req?.user?.unidadeEscopo);
  }

  @Get('auditorias/:id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter auditoria por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('auditorias/:id/iniciar')
  @Roles('P01')
  @ApiOperation({ summary: 'Iniciar execução da auditoria (P01)' })
  iniciarExecucao(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.iniciarExecucao(id);
  }

  @Post('auditorias/:id/concluir')
  @Roles('P01')
  @ApiOperation({ summary: 'Concluir auditoria (P01)' })
  concluir(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluir(id);
  }

  @Post('auditorias/:id/suspender')
  @Roles('P01')
  @ApiOperation({ summary: 'Suspender auditoria (P01)' })
  suspender(@Param('id', ParseUUIDPipe) id: string, @Body('motivo') motivo: string) {
    return this.service.suspender(id, motivo);
  }

  @Post('auditorias/:id/comunicado')
  @Roles('P01')
  @ApiOperation({ summary: 'Gerar comunicado de auditoria (P01)' })
  gerarComunicado(@Req() req: RequestWithUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.service.gerarComunicado(id, req.user.sub);
  }

  // ── Evidências ───────────────────────────────

  @Post('auditorias/:id/evidencias')
  @Roles('P02')
  @ApiOperation({ summary: 'Adicionar evidência com arquivo à auditoria (P02)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('arquivo', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 25 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowedMimes = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'image/tiff',
          'application/zip',
          'application/x-zip-compressed',
        ];
        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new BadRequestException(`Tipo de arquivo não permitido: ${file.mimetype}`), false);
        }
      },
    }),
  )
  criarEvidencia(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CriarEvidenciaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo é obrigatório');
    return this.service.criarEvidencia(id, dto, file.path);
  }

  @Get('auditorias/:id/evidencias')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar evidências da auditoria' })
  listarEvidencias(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarEvidencias(id);
  }

  // ── Papéis de Trabalho ───────────────────────

  @Post('auditorias/:id/papeis-trabalho')
  @Roles('P02')
  @ApiOperation({ summary: 'Criar papel de trabalho (P02)' })
  criarPapelTrabalho(
    @Req() req: RequestWithUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CriarPapelTrabalhoDto,
  ) {
    return this.service.criarPapelTrabalho(id, dto, req.user.sub);
  }

  @Get('auditorias/:id/papeis-trabalho')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar papéis de trabalho da auditoria' })
  listarPapeisTrabalho(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarPapeisTrabalho(id);
  }

  // ── Requisições ──────────────────────────────

  @Post('auditorias/:id/requisicoes')
  @Roles('P02')
  @ApiOperation({ summary: 'Emitir requisição à unidade auditada (P02)' })
  criarRequisicao(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CriarRequisicaoDto) {
    return this.service.criarRequisicao(id, dto);
  }

  @Get('auditorias/:id/requisicoes')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar requisições da auditoria' })
  listarRequisicoes(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.listarRequisicoes(id);
  }
}
