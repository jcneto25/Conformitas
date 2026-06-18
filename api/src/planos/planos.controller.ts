import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlanosService } from './planos.service';

@ApiTags('planos')
@Controller('planos')
export class PlanosController {
  constructor(private readonly service: PlanosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar planos' })
  findAll() { return this.service.findAll(); }
}
