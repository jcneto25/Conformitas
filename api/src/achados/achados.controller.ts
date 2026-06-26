import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AchadosService } from './achados.service';

@ApiTags('achados')
@Controller('achados')
export class AchadosController {
  constructor(private readonly service: AchadosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar achados' })
  findAll() {
    return this.service.findAll();
  }
}
