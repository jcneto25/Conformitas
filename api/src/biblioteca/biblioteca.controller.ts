import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BibliotecaService } from './biblioteca.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateDocumentoDto } from './dto/update-documento.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('biblioteca')
@Controller('biblioteca')
@ApiBearerAuth()
export class BibliotecaController {
  constructor(private readonly service: BibliotecaService) {}

  @Post()
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Adicionar documento metodológico (P01, P10)' })
  create(@Body() dto: CreateDocumentoDto) {
    return this.service.create(dto);
  }

  @Post('upload')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Upload de documento com versionamento automático (RF-012.4)' })
  @ApiQuery({ name: 'titulo', required: true })
  @ApiQuery({ name: 'tipo', required: true, enum: ['NORMA', 'MANUAL', 'TEMPLATE', 'CHECKLIST'] })
  @ApiQuery({ name: 'categoria', required: false })
  upload(
    @Query('titulo') titulo: string,
    @Query('tipo') tipo: string,
    @Query('arquivoPath') arquivoPath: string,
    @Query('arquivo_path') arquivoPathLegado: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.service.upload(titulo, tipo, arquivoPath || arquivoPathLegado, categoria);
  }

  @Get()
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Listar documentos metodológicos (P01, P02, P10)' })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAll(
    @Query('tipo') tipo?: string,
    @Query('categoria') categoria?: string,
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.service.findAll({ tipo, categoria, search, status });
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P10')
  @ApiOperation({ summary: 'Obter documento por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Atualizar documento (P01, P10)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDocumentoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Arquivar documento (soft, P01)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
