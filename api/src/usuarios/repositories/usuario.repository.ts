export const USUARIO_REPOSITORY = 'USUARIO_REPOSITORY';

export interface IUsuarioRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string, include?: any): Promise<any | null>;
  findByEmail(email: string, include?: any): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
