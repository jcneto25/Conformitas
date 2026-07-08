export const SOLICITACAO_CONSULTORIA_REPOSITORY = 'SOLICITACAO_CONSULTORIA_REPOSITORY';
export interface ISolicitacaoConsultoriaRepository {
  create(data: any): Promise<any>;
  findMany(status?: string): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
