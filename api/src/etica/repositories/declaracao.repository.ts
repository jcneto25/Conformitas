export const DECLARACAO_REPOSITORY = 'DECLARACAO_REPOSITORY';
export const IMPEDIMENTO_REPOSITORY = 'IMPEDIMENTO_REPOSITORY';
export const CLASSIFICACAO_REPOSITORY = 'CLASSIFICACAO_REPOSITORY';
export const LOG_SIGILOSO_REPOSITORY = 'LOG_SIGILOSO_REPOSITORY';

export interface IDeclaracaoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}
export interface IImpedimentoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
export interface IClassificacaoRepository {
  upsert(where: any, data: any): Promise<any>;
  findUnique(where: any): Promise<any | null>;
}
export interface ILogSigilosoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}
