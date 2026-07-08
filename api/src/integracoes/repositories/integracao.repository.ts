export const INTEGRACAO_REPOSITORY = 'INTEGRACAO_REPOSITORY';
export interface IIntegracaoRepository {
  findAll(): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  findByNome(nome: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<any>;
}
