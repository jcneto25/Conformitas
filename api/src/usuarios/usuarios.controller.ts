import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly service: UsuariosService) {}

  @Get()
  @Roles('P10')
  @ApiOperation({ summary: 'Listar usuários (P10)' })
  findAll() {
    return this.service.findAll();
  }
}
