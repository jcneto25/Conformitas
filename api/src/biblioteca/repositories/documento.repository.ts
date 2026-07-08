export const DOCUMENTO_REPOSITORY = 'DOCUMENTO_REPOSITORY';
export interface DocumentoFilter { tipo?: string; categoria?: string; status?: string; search?: string; }
export interface IDocumentoRepository {
  create(data: any): Promise<any>;
  findMany(filter: DocumentoFilter): Promise<any[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  findByTitulo(titulo: string): Promise<any[]>;
}
