import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditoriasService } from './auditorias.service';

@ApiTags('auditorias')
@Controller('auditorias')
export class AuditoriasController {
  constructor(private readonly service: AuditoriasService) {}

  @Get()
  @ApiOperation({ summary: 'Listar auditorias' })
  findAll() { return this.service.findAll(); }
}
