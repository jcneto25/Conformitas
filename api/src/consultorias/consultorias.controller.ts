import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ConsultoriasService } from './consultorias.service';

@ApiTags('consultorias')
@Controller('consultorias')
export class ConsultoriasController {
  constructor(private readonly service: ConsultoriasService) {}
  @Get() @ApiOperation({ summary: 'Listar consultorias' }) findAll() { return this.service.findAll(); }
}
