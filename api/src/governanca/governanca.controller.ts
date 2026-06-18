import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GovernancaService } from './governanca.service';

@ApiTags('governanca')
@Controller('governanca')
export class GovernancaController {
  constructor(private readonly service: GovernancaService) {}
  @Get() @ApiOperation({ summary: 'Listar determinações externas' }) findAll() { return this.service.findAll(); }
}
