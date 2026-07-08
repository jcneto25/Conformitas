export const CONSULTORIA_REPOSITORY = 'CONSULTORIA_REPOSITORY';
export interface IConsultoriaRepository {
  create(data: any): Promise<any>;
  findAll(tipo?: string): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  findBySolicitacao(solicitacaoId: string): Promise<any[]>;
  update(id: string, data: any): Promise<any>;
}
