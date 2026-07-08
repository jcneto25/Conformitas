import { CreateCapacitacaoDto } from '../dto/create-capacitacao.dto';
import { UpdateCapacitacaoDto } from '../dto/update-capacitacao.dto';

export const CAPACITACAO_REPOSITORY = 'CAPACITACAO_REPOSITORY';

export interface CapacitacaoFilter {
  tipo?: string;
  participanteId?: string;
  ano?: number;
}

export interface CapacitacaoReadModel {
  id: string;
  titulo: string;
  instituicao: string | null;
  cargaHoraria: number;
  tipo: string;
  dataInicio: Date;
  dataFim: Date | null;
  participanteIds: string[];
  certificadoPath: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICapacitacaoRepository {
  create(data: ReturnType<typeof buildCreateData>): Promise<CapacitacaoReadModel>;
  findMany(filter: CapacitacaoFilter): Promise<CapacitacaoReadModel[]>;
  findUnique(id: string): Promise<CapacitacaoReadModel | null>;
  update(id: string, data: any): Promise<CapacitacaoReadModel>;
  delete(id: string): Promise<CapacitacaoReadModel>;
  findConfig(chave: string): Promise<{ valor: string } | null>;
}

export function buildCreateData(dto: CreateCapacitacaoDto) {
  return {
    titulo: dto.titulo, instituicao: dto.instituicao, cargaHoraria: dto.cargaHoraria,
    tipo: dto.tipo, dataInicio: new Date(dto.dataInicio),
    dataFim: dto.dataFim ? new Date(dto.dataFim) : null,
    participanteIds: dto.participanteIds, certificadoPath: dto.certificadoPath,
  };
}

export function buildUpdateData(dto: UpdateCapacitacaoDto) {
  const data: any = { ...dto };
  if (dto.dataInicio) data.dataInicio = new Date(dto.dataInicio);
  if (dto.dataFim) data.dataFim = new Date(dto.dataFim);
  return data;
}
