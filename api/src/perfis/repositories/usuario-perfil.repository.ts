export const USUARIO_PERFIL_REPOSITORY = 'USUARIO_PERFIL_REPOSITORY';
export interface IUsuarioPerfilRepository {
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  create(data: any): Promise<any>;
  update(id: string, data: any): Promise<any>;
}
