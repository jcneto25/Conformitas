export const REGISTRO_FRAUDE_REPOSITORY = 'REGISTRO_FRAUDE_REPOSITORY';
export interface IRegistroFraudeRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}
