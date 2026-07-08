export const LOG_INTEGRACAO_REPOSITORY = 'LOG_INTEGRACAO_REPOSITORY';
export interface ILogIntegracaoRepository {
  create(data: any): Promise<any>;
  findByIntegracao(integracaoId: string): Promise<any[]>;
}
