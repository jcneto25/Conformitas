export const PLANO_AUDITORIA_REPOSITORY = 'PLANO_AUDITORIA_REPOSITORY';
export interface IPlanoAuditoriaRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string, include?: any): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
