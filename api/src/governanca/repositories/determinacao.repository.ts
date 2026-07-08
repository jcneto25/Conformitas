export const DETERMINACAO_REPOSITORY = 'DETERMINACAO_REPOSITORY';
export interface IDeterminacaoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
