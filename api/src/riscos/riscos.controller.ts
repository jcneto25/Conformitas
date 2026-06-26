import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RiscosService } from './riscos.service';

@ApiTags('riscos')
@Controller('riscos')
export class RiscosController {
  constructor(private readonly service: RiscosService) {}
  @Get() @ApiOperation({ summary: 'Listar riscos' }) findAll() {
    return this.service.findAll();
  }
}
