import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PerfisService } from './perfis.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('perfis')
@Controller()
@ApiBearerAuth()
export class PerfisController {
  constructor(private readonly service: PerfisService) {}

  @Get('perfis')
  @Roles('P10', 'P01')
  @ApiOperation({ summary: 'Listar perfis (P10, P01)' })
  findAll() {
    return this.service.findAll();
  }

  @Get('perfis/:id')
  @Roles('P10', 'P01')
  @ApiOperation({ summary: 'Obter perfil por ID (P10, P01)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post('usuarios/:id/perfis')
  @Roles('P10')
  @ApiOperation({ summary: 'Atribuir perfil a usuário (P10)' })
  async atribuirPerfil(
    @Param('id', ParseUUIDPipe) usuarioId: string,
    @Body() body: { perfil_id: string; unidade_escopo?: string },
  ) {
    try {
      return await this.service.atribuirPerfil(usuarioId, body.perfil_id, body.unidade_escopo);
    } catch (error: any) {
      if (error?.message?.startsWith('SOD_VIOLATION')) {
        throw new ConflictException(error.message.replace('SOD_VIOLATION: ', ''));
      }
      throw error;
    }
  }

  @Delete('usuarios-perfis/:id')
  @Roles('P10')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover perfil de usuário (P10)' })
  removerPerfil(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removerPerfil(id);
  }

  @Get('usuarios/:id/perfis')
  @Roles('P10', 'P01')
  @ApiOperation({ summary: 'Listar perfis de um usuário (P10, P01)' })
  listarPerfisUsuario(@Param('id', ParseUUIDPipe) usuarioId: string) {
    return this.service.listarPerfisUsuario(usuarioId);
  }
}
