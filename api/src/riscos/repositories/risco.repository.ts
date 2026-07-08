export const RISCO_REPOSITORY = 'RISCO_REPOSITORY';

export interface RiscoFilter { categoria?: string; status?: string; nivel?: string; }

export interface RiscoReadModel {
  id: string; nome: string; categoria: string | null; probabilidade: number;
  impacto: number; nivel: string; status: string;
  createdAt: Date; updatedAt: Date;
}

export interface IRiscoRepository {
  create(data: any): Promise<RiscoReadModel>;
  findMany(filter: RiscoFilter): Promise<RiscoReadModel[]>;
  findUnique(id: string): Promise<RiscoReadModel | null>;
  update(id: string, data: any): Promise<RiscoReadModel>;
  delete(id: string): Promise<RiscoReadModel>;
}
