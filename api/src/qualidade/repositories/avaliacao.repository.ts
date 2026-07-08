export const AVALIACAO_REPOSITORY = 'AVALIACAO_REPOSITORY';
export interface IAvaliacaoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
