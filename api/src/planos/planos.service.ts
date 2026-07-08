import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { IPlanoAuditoriaRepository, PLANO_AUDITORIA_REPOSITORY } from './repositories/plano-auditoria.repository';
import { IItemPlanoRepository, ITEM_PLANO_REPOSITORY } from './repositories/item-plano.repository';
import { IForcaTrabalhoRepository, FORCA_TRABALHO_REPOSITORY } from './repositories/forca-trabalho.repository';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';
import { CreateItemPlanoDto } from './dto/create-item-plano.dto';
import { CreateForcaTrabalhoDto } from './dto/create-forca-trabalho.dto';

@Injectable()
export class PlanosService {
  constructor(
    @Inject(PLANO_AUDITORIA_REPOSITORY) private readonly planoRepo: IPlanoAuditoriaRepository,
    @Inject(ITEM_PLANO_REPOSITORY) private readonly itemRepo: IItemPlanoRepository,
    @Inject(FORCA_TRABALHO_REPOSITORY) private readonly ftRepo: IForcaTrabalhoRepository,
  ) {}
  async create(dto: CreatePlanoDto, criadoPorId: string) {
    return this.planoRepo.create({
      tipo: dto.tipo,
      anoInicio: dto.anoInicio,
      anoFim: dto.anoFim,
      status: 'RASCUNHO',
      versao: 1,
      criadoPorId,
    });
  }
  async findAll(params?: { tipo?: string; ano?: number; status?: string }) {
    const where: any = { deletedAt: null };
    if (params?.tipo) where.tipo = params.tipo;
    if (params?.ano) where.ano = params.ano;
    if (params?.status) where.status = params.status;
    return this.planoRepo.findMany(where);
  }
  async findOne(id: string) {
    const p = await this.planoRepo.findUnique(id, {
      itensPlano: { include: { universo: true } },
      forcTrabalho: { include: { usuario: { select: { id: true, nome: true, email: true } } } },
    });
    if (!p || p.deletedAt) throw new NotFoundException('Plano não encontrado');
    return p;
  }
  async submeter(id: string) {
    const p = await this.planoRepo.findUnique(id, { itensPlano: true, forcTrabalho: true });
    if (!p) throw new NotFoundException('Plano não encontrado');
    if (p.status !== 'RASCUNHO') throw new BadRequestException('Apenas planos em RASCUNHO podem ser submetidos');
    if (p.itensPlano.length === 0) throw new BadRequestException('Plano deve ter ao menos 1 item');
    if (p.tipo === 'PAA' && p.forcTrabalho.length > 0) {
      const hDisp = p.forcTrabalho.reduce((s: number, f: any) => s + f.horasDisponiveisAno, 0);
      const hAloc = p.itensPlano.reduce((s: number, i: any) => s + (i.horasEstimadas || 0), 0);
      if (hAloc > hDisp)
        throw new BadRequestException(`Horas alocadas (${hAloc}h) excedem a força de trabalho (${hDisp}h)`);
    }
    return this.planoRepo.update(id, { status: 'SUBMETIDO', dataSubmissao: new Date() });
  }
  async aprovar(id: string) {
    const p = await this.planoRepo.findUnique(id);
    if (!p) throw new NotFoundException('');
    if (p.status !== 'SUBMETIDO') throw new BadRequestException('');
    return this.planoRepo.update(id, { status: 'APROVADO', dataAprovacao: new Date() });
  }
  async publicar(id: string) {
    const p = await this.planoRepo.findUnique(id);
    if (!p) throw new NotFoundException('');
    if (p.status !== 'APROVADO') throw new BadRequestException('');
    return this.planoRepo.update(id, { status: 'PUBLICADO', dataPublicacao: new Date() });
  }
  async update(id: string, dto: UpdatePlanoDto) {
    const p = await this.planoRepo.findUnique(id);
    if (!p || p.deletedAt) throw new NotFoundException('');
    if (p.status !== 'RASCUNHO') throw new BadRequestException('');
    return this.planoRepo.update(id, dto);
  }
  async devolver(id: string, motivo: string) {
    const p = await this.planoRepo.findUnique(id);
    if (!p) throw new NotFoundException('');
    if (p.status !== 'SUBMETIDO') throw new BadRequestException('');
    if (!motivo) throw new BadRequestException('');
    return this.planoRepo.update(id, { status: 'RASCUNHO' });
  }
  async criarRevisao(id: string, criadoPorId: string) {
    const p = await this.findOne(id);
    const novo = await this.planoRepo.create({
      tipo: p.tipo,
      anoInicio: p.anoInicio,
      anoFim: p.anoFim,
      status: 'RASCUNHO',
      versao: p.versao + 1,
      criadoPorId,
    });
    if (p.itensPlano?.length)
      for (const i of p.itensPlano)
        await this.itemRepo.create({
          ...i,
          id: undefined,
          planoId: novo.id,
          universoAuditavelId: i.universoAuditavelId,
          createdAt: undefined,
          updatedAt: undefined,
        });
    return this.findOne(novo.id);
  }
  async adicionarItem(planoId: string, dto: CreateItemPlanoDto) {
    const p = await this.planoRepo.findUnique(planoId);
    if (!p) throw new NotFoundException('');
    if (p.status !== 'RASCUNHO') throw new BadRequestException('');
    return this.itemRepo.create({
      planoId,
      ...dto,
      equipeIds: dto.equipeIds ? JSON.parse(JSON.stringify(dto.equipeIds)) : undefined,
      questoesAuditoria: dto.questoesAuditoria ? JSON.parse(JSON.stringify(dto.questoesAuditoria)) : undefined,
    });
  }
  async listarItens(planoId: string) {
    return this.itemRepo.findMany({ where: { planoId } });
  }
  async removerItem(id: string) {
    const i = await this.itemRepo.findUnique(id);
    if (!i) throw new NotFoundException('');
    return this.itemRepo.delete(id);
  }
  async adicionarForcaTrabalho(planoId: string, dto: Omit<CreateForcaTrabalhoDto, 'planoId'>) {
    return this.ftRepo.create({ planoId, ...dto });
  }
  async listarForcaTrabalho(planoId?: string, ano?: number) {
    const where: any = {};
    if (planoId) where.planoId = planoId;
    if (ano) where.ano = ano;
    return this.ftRepo.findMany(where);
  }
}
