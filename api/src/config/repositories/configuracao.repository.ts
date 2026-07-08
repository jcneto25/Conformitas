export const CONFIGURACAO_REPOSITORY = 'CONFIGURACAO_REPOSITORY';

export interface IConfiguracaoRepository {
  findAll(): Promise<any[]>;
  findUnique(chave: string): Promise<any | null>;
  update(chave: string, valor: string): Promise<any>;
}
