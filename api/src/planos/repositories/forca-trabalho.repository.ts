export const FORCA_TRABALHO_REPOSITORY = 'FORCA_TRABALHO_REPOSITORY';
export interface IForcaTrabalhoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}
