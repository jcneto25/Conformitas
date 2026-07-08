export const LOG_SISTEMA_REPOSITORY = 'LOG_SISTEMA_REPOSITORY';
export interface ILogSistemaRepository {
  findMany(params: any): Promise<{ data: any[]; total: number }>;
  create(data: any): Promise<any>;
}
