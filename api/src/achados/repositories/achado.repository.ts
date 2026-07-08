import { AchadoStatus } from '../domain/achado-status';

export const ACHADO_REPOSITORY = 'ACHADO_REPOSITORY';
export const MANIFESTACAO_REPOSITORY = 'MANIFESTACAO_REPOSITORY';

/** Read model for achado listagem/detalhe. */
export interface AchadoListaItem {
  id: string;
  auditoriaId: string;
  codigo: string;
  status: AchadoStatus;
  tipo: string;
  situacaoEncontrada: string;
  criterio: string;
  causa: string;
  efeito: string;
  evidenciaIds: string[];
  autorId: string;
  dataLimiteManifestacao: Date | null;
  ressalva: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Includes opcionais
  auditoria?: { id: string; numero: string; unidadeAuditada: string; status: string };
  manifestacoes?: any[];
  _count?: { manifestacoes: number; recomendacoes: number };
}

/** Input para criação de achado. */
export interface AchadoCreateInput {
  id: string;
  auditoriaId: string;
  codigo: string;
  tipo: string;
  situacaoEncontrada: string;
  criterio: string;
  causa: string;
  efeito: string;
  status: AchadoStatus;
  evidenciaIds: string[];
  autorId: string;
}

export interface IAuditoriaAchadoRepository {
  findUnique(id: string): Promise<{ id: string; status: string } | null>;
}

export interface IAchadoRepository {
  create(data: AchadoCreateInput): Promise<AchadoListaItem>;
  findMany(where: any): Promise<AchadoListaItem[]>;
  findUnique(id: string, include?: any): Promise<any | null>;
  update(id: string, data: any): Promise<any>;
  count(where: any): Promise<number>;
}

export interface IManifestacaoRepository {
  create(data: any): Promise<any>;
  findMany(where: any): Promise<any[]>;
}
