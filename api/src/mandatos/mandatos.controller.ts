import { Controller, Get, Post, Patch, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MandatosService } from './mandatos.service';
import { CreateMandatoDto } from './dto/create-mandato.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('mandatos')
@Controller('mandatos')
@ApiBearerAuth()
export class MandatosController {
  constructor(private readonly service: MandatosService) {}

  @Post()
  @Roles('P10')
  @ApiOperation({ summary: 'Criar mandato de Auditor-Chefe (P10)' })
  create(@Body() dto: CreateMandatoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('P01', 'P03', 'P04', 'P10')
  @ApiOperation({ summary: 'Listar mandatos (P01, P03, P04, P10)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('P01', 'P10')
  @ApiOperation({ summary: 'Obter mandato por ID (P01, P10)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id/concluir')
  @Roles('P10')
  @ApiOperation({ summary: 'Concluir mandato (P10)' })
  concluir(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.concluir(id);
  }
}
