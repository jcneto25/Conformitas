export const MANDATO_AUDITOR_CHEFE_REPOSITORY = 'MANDATO_AUDITOR_CHEFE_REPOSITORY';
export interface IMandatoAuditorChefeRepository {
  create(data: any): Promise<any>;
  findAll(): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  findByUsuario(usuarioId: string): Promise<any[]>;
  update(id: string, data: any): Promise<any>;
}
