import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExportFormato {
  PDF = 'PDF',
  XLSX = 'XLSX',
}

export class ExportDashboardDto {
  @ApiProperty({ enum: ExportFormato, example: 'PDF' })
  @IsEnum(ExportFormato)
  formato: ExportFormato;
}
