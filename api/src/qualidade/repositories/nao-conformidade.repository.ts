export const NAO_CONFORMIDADE_REPOSITORY = 'NAO_CONFORMIDADE_REPOSITORY';
export interface INaoConformidadeRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
