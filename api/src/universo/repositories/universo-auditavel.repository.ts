export const UNIVERSO_AUDITAVEL_REPOSITORY = 'UNIVERSO_AUDITAVEL_REPOSITORY';
export interface UniversoFilter { tipo?: string; ativo?: boolean; search?: string }

export interface UniversoReadModel {
  id: string; nome: string; tipo: string; unidadeResponsavel: string;
  materialidade: number; relevancia: number; criticidade: number; risco: number;
  indicePriorizacao: number; ativo: boolean; deletedAt: Date | null;
  createdAt: Date; updatedAt: Date;
}

export interface IUniversoAuditavelRepository {
  create(data: any): Promise<UniversoReadModel>;
  findMany(filter: UniversoFilter): Promise<UniversoReadModel[]>;
  findUnique(id: string): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}

export function buildCreateData(dto: any) {
  return { nome: dto.nome, descricao: dto.descricao, tipo: dto.tipo, unidadeResponsavel: dto.unidadeResponsavel,
    materialidade: dto.materialidade, relevancia: dto.relevancia, criticidade: dto.criticidade, risco: dto.risco };
}
export function buildUpdateData(dto: any) { const d: any = {}; Object.entries(dto).forEach(([k,v]) => { if (v !== undefined) d[k] = v; }); return d; }
