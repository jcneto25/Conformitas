import { AuditoriaStatus } from '../domain/auditoria-status';
import { Auditoria } from '../domain/auditoria.entity';

/** Read model para listagem de auditorias (com contagens agregadas). */
export interface AuditoriaListaItem {
  id: string;
  numero: string;
  status: AuditoriaStatus;
  tipo: string;
  forma: string;
  unidadeAuditada: string;
  objetivo: string;
  sigilosa: boolean;
  escopo: string | null;
  dataFimPrevista: Date | null;
  dataInicio: Date | null;
  dataFimReal: Date | null;
  motivoSuspensao: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  itemPlano?: { id: string; universo?: { id: string; nome: string } } | null;
  _count?: { evidencias: number; papeisTrabalho: number; requisicoes: number };
}

/** Dados necessários para criar uma auditoria (Prisma create input). */
export interface AuditoriaCreateInput {
  id: string;
  itemPlanoId: string;
  numero: string;
  tipo: string;
  forma: string;
  status: AuditoriaStatus;
  unidadeAuditada: string;
  objetivo: string | null;
  sigilosa: boolean;
  escopo: string | null;
  dataFimPrevista: Date | null;
}

/** Dados para criar um comunicado. */
export interface ComunicadoCreateInput {
  auditoriaId: string;
  numero: string;
  conteudo: string;
  assinadoPor: string;
}

export interface ComunicadoReadModel {
  id: string;
  numero: string;
  conteudo: string;
  dataEmissao: Date;
}

export const AUDITORIA_REPOSITORY = 'AUDITORIA_REPOSITORY';
export const COMUNICADO_REPOSITORY = 'COMUNICADO_REPOSITORY';
export const EVIDENCIA_REPOSITORY = 'EVIDENCIA_REPOSITORY';
export const PAPEL_TRABALHO_REPOSITORY = 'PAPEL_TRABALHO_REPOSITORY';
export const REQUISICAO_REPOSITORY = 'REQUISICAO_REPOSITORY';

/** Filtros aceitos para listagem de auditorias. */
export interface AuditoriaFilter {
  status?: string;
  unidade?: string;
  search?: string;
}

export interface IAuditoriaRepository {
  count(where?: any): Promise<number>;
  create(data: AuditoriaCreateInput): Promise<AuditoriaListaItem>;
  findMany(where: any): Promise<AuditoriaListaItem[]>;
  findUnique(id: string, include?: any): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
}

export interface IComunicadoRepository {
  count(where: any): Promise<number>;
  create(data: ComunicadoCreateInput): Promise<ComunicadoReadModel>;
}

export interface IEvidenciaRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}

export interface IPapelTrabalhoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}

export interface IRequisicaoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}
