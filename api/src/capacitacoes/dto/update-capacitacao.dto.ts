import { PartialType } from '@nestjs/swagger';
import { CreateCapacitacaoDto } from './create-capacitacao.dto';

export class UpdateCapacitacaoDto extends PartialType(CreateCapacitacaoDto) {}
