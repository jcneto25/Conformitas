export const INDICADOR_REPOSITORY = 'INDICADOR_REPOSITORY';
export interface IIndicadorRepository {
  create(data: any): Promise<any>;
  findMany(where?: any): Promise<any[]>;
  update(id: string, data: any): Promise<any>;
}
