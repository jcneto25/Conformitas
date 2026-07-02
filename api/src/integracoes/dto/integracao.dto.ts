import { IsString, IsNotEmpty, IsOptional, IsEnum, IsUrl, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum TipoIntegracao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
  BIDIRECIONAL = 'BIDIRECIONAL',
}

export enum ProtocoloIntegracao {
  REST = 'REST',
  SOAP = 'SOAP',
  GRAPHQL = 'GRAPHQL',
  FILE = 'FILE',
}

export enum StatusIntegracao {
  ATIVA = 'ATIVA',
  INATIVA = 'INATIVA',
  EM_CONFIGURACAO = 'EM_CONFIGURACAO',
  ERRO = 'ERRO',
}

export class CreateIntegracaoDto {
  @ApiProperty({ example: 'Ouvidoria TJCE' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @ApiProperty({ example: 'Ouvidoria' })
  @IsString()
  @IsNotEmpty()
  sistemaExterno: string;

  @ApiProperty({ enum: TipoIntegracao })
  @IsEnum(TipoIntegracao)
  tipo: TipoIntegracao;

  @ApiProperty({ enum: ProtocoloIntegracao, example: 'REST' })
  @IsEnum(ProtocoloIntegracao)
  protocolo: ProtocoloIntegracao;

  @ApiPropertyOptional({ example: 'https://ouvidoria.tjce.jus.br/api/v1' })
  @IsOptional()
  @IsUrl()
  endpoint?: string;

  @ApiPropertyOptional({ example: 'API_KEY' })
  @IsOptional()
  @IsString()
  metodoAutenticacao?: string;

  @ApiPropertyOptional({ example: 'DIARIA' })
  @IsOptional()
  @IsString()
  frequencia?: string;

  @ApiProperty({ enum: StatusIntegracao, default: StatusIntegracao.EM_CONFIGURACAO })
  @IsEnum(StatusIntegracao)
  status: StatusIntegracao;
}

export class UpdateIntegracaoDto {
  @ApiPropertyOptional({ example: 'Ouvidoria TJCE' })
  @IsOptional()
  @IsString()
  @MinLength(3)
  nome?: string;

  @ApiPropertyOptional({ example: 'Ouvidoria' })
  @IsOptional()
  @IsString()
  sistemaExterno?: string;

  @ApiPropertyOptional({ enum: TipoIntegracao })
  @IsOptional()
  @IsEnum(TipoIntegracao)
  tipo?: TipoIntegracao;

  @ApiPropertyOptional({ enum: ProtocoloIntegracao })
  @IsOptional()
  @IsEnum(ProtocoloIntegracao)
  protocolo?: ProtocoloIntegracao;

  @ApiPropertyOptional({ example: 'https://ouvidoria.tjce.jus.br/api/v1' })
  @IsOptional()
  @IsUrl()
  endpoint?: string;

  @ApiPropertyOptional({ example: 'API_KEY' })
  @IsOptional()
  @IsString()
  metodoAutenticacao?: string;

  @ApiPropertyOptional({ example: 'DIARIA' })
  @IsOptional()
  @IsString()
  frequencia?: string;

  @ApiPropertyOptional({ enum: StatusIntegracao })
  @IsOptional()
  @IsEnum(StatusIntegracao)
  status?: StatusIntegracao;

  @ApiPropertyOptional({ enum: ['ONLINE', 'OFFLINE', 'ERRO', 'NAO_TESTADO'] })
  @IsOptional()
  @IsString()
  healthStatus?: string;
}
