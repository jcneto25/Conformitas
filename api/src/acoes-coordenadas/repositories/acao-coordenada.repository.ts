export const ACAO_COORDENADA_REPOSITORY = 'ACAO_COORDENADA_REPOSITORY';
export interface IAcaoCoordenadaRepository {
  findAll(): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  findFirst(where: any): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
