import { Controller, Get, Post, Patch, Delete, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('usuarios')
@Controller('usuarios')
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Post()
  @Roles('P10')
  @ApiOperation({ summary: 'Criar usuário (P10)' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('P10')
  @ApiOperation({ summary: 'Listar usuários (P10)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('P10')
  @ApiOperation({ summary: 'Obter usuário por ID (P10)' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles('P10')
  @ApiOperation({ summary: 'Atualizar usuário (P10)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateUsuarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('P10')
  @ApiOperation({ summary: 'Desativar usuário - soft delete (P10)' })
  deactivate(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.deactivate(id);
  }
}
