import { PartialType } from '@nestjs/swagger';
import { CreateRiscoDto } from './create-risco.dto';

export class UpdateRiscoDto extends PartialType(CreateRiscoDto) {}
