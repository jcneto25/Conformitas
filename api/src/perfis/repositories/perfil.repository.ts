export const PERFIL_REPOSITORY = 'PERFIL_REPOSITORY';
export interface IPerfilRepository {
  findAll(): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  findByCodigo(codigo: string): Promise<any | null>;
}
