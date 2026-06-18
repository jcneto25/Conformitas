import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('configuracoes')
@Controller('configuracoes')
export class ConfigController {
  constructor(private readonly service: ConfigService) {}
  @Get()
  @Roles('P10')
  @ApiOperation({ summary: 'Listar configurações (P10)' })
  findAll() { return this.service.findAll(); }
}
