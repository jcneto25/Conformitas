export const RELATORIO_REPOSITORY = 'RELATORIO_REPOSITORY';
export const RELATORIO_ANUAL_REPOSITORY = 'RELATORIO_ANUAL_REPOSITORY';
export interface IRelatorioRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string, include?: any): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
export interface IRelatorioAnualRepository {
  findUnique(where: any): Promise<any | null>;
  create(data: any): Promise<any>;
}
