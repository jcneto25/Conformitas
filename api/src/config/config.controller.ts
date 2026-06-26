import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('configuracoes')
@Controller('configuracoes')
@ApiBearerAuth()
export class ConfigController {
  constructor(private readonly service: ConfigService) {}

  @Get()
  @Roles('P10')
  @ApiOperation({ summary: 'Listar configurações (P10)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':chave')
  @Roles('P10')
  @ApiOperation({ summary: 'Obter configuração por chave (P10)' })
  findOne(@Param('chave') chave: string) {
    return this.service.findOne(chave);
  }

  @Put(':chave')
  @Roles('P10')
  @ApiOperation({ summary: 'Atualizar configuração (P10)' })
  update(@Param('chave') chave: string, @Body() body: { valor: string }) {
    return this.service.update(chave, body.valor);
  }
}
