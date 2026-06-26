import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QualidadeService } from './qualidade.service';

@ApiTags('qualidade')
@Controller('qualidade')
export class QualidadeController {
  constructor(private readonly service: QualidadeService) {}
  @Get() @ApiOperation({ summary: 'Listar avaliações de qualidade' }) findAll() {
    return this.service.findAll();
  }
}
