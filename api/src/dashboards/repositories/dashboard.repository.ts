export const DASHBOARD_REPOSITORY = 'DASHBOARD_REPOSITORY';

export interface IDashboardRepository {
  findPlanosAno(ano: number): Promise<any[]>;
  findAuditorias(filters: any): Promise<any[]>;
  findRecomendacoes(filters: any): Promise<any[]>;
  findAvaliacoesQualidade(filters: any): Promise<any[]>;
  findIndicadoresQualidade(): Promise<any[]>;
  findNaoConformidades(filters: any): Promise<any[]>;
  findForcaTrabalho(planoId: string): Promise<any[]>;
}
