import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BibliotecaService } from './biblioteca.service';

@ApiTags('biblioteca')
@Controller('biblioteca')
export class BibliotecaController {
  constructor(private readonly service: BibliotecaService) {}
  @Get() @ApiOperation({ summary: 'Listar documentos metodológicos' }) findAll() { return this.service.findAll(); }
}
