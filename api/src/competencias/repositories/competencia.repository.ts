export const COMPETENCIA_REPOSITORY = 'COMPETENCIA_REPOSITORY';

export interface CompetenciaFilter { tipo?: string; }

export interface CompetenciaReadModel { id: string; nome: string; tipo: string; descricao: string | null; createdAt: Date; updatedAt: Date; }

export interface ICompetenciaRepository {
  create(data: any): Promise<CompetenciaReadModel>;
  findMany(filter: CompetenciaFilter): Promise<CompetenciaReadModel[]>;
  findUnique(id: string): Promise<CompetenciaReadModel | null>;
  update(id: string, data: any): Promise<CompetenciaReadModel>;
  delete(id: string): Promise<CompetenciaReadModel>;
}
