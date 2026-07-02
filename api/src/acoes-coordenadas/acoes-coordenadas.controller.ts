import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';
import { CreateAcaoCoordenadaDto, UpdateAcaoCoordenadaDto, ReportarResultadoDto } from './dto/acao-coordenada.dto';

@ApiTags('acoes-coordenadas')
@Controller('acoes-coordenadas')
@ApiBearerAuth()
export class AcoesCoordenadasController {
  constructor(private readonly service: AcoesCoordenadasService) {}

  @Get()
  @Roles('P01', 'P02', 'P08')
  @ApiOperation({ summary: 'Listar Ações Coordenadas do SIAUD-Jud' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('P01', 'P02', 'P08')
  @ApiOperation({ summary: 'Obter Ação Coordenada por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles('P01', 'P08')
  @ApiOperation({ summary: 'Registrar Ação Coordenada manualmente' })
  create(@Body() dto: CreateAcaoCoordenadaDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @Roles('P01')
  @ApiOperation({ summary: 'Atualizar Ação Coordenada' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAcaoCoordenadaDto) {
    return this.service.update(id, dto);
  }

  @Post(':id/reportar')
  @Roles('P01')
  @ApiOperation({ summary: 'Reportar resultado de Ação Coordenada à CPA' })
  reportar(@Param('id', ParseUUIDPipe) id: string, @Body() dto: ReportarResultadoDto) {
    return this.service.reportarResultado(id, dto);
  }

  // Webhook público (SIAUD-Jud)
  @Post('webhook')
  @Public()
  @ApiExcludeEndpoint()
  @ApiOperation({ summary: 'Webhook para receber Ações Coordenadas do SIAUD-Jud' })
  webhook(@Body() dto: CreateAcaoCoordenadaDto) {
    return this.service.webhookReceber(dto);
  }
}
