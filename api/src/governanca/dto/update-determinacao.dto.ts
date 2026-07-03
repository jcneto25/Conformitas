import { PartialType } from '@nestjs/swagger';
import { CreateDeterminacaoDto } from './create-determinacao.dto';

export class UpdateDeterminacaoDto extends PartialType(CreateDeterminacaoDto) {}
