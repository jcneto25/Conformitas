export const ITEM_PLANO_REPOSITORY = 'ITEM_PLANO_REPOSITORY';
export interface IItemPlanoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  delete(id: string): Promise<any>;
}
