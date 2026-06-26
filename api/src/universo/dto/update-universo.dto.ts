import { PartialType } from '@nestjs/swagger';
import { CreateUniversoDto } from './create-universo.dto';

export class UpdateUniversoDto extends PartialType(CreateUniversoDto) {}
