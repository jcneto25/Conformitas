import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EticaService } from './etica.service';

@ApiTags('etica')
@Controller('etica')
export class EticaController {
  constructor(private readonly service: EticaService) {}
  @Get() @ApiOperation({ summary: 'Listar declarações de independência' }) findAll() { return this.service.findAll(); }
}
