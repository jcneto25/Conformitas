import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PlanosService } from './planos.service';
import { PLANO_AUDITORIA_REPOSITORY } from './repositories/plano-auditoria.repository';
import { ITEM_PLANO_REPOSITORY } from './repositories/item-plano.repository';
import { FORCA_TRABALHO_REPOSITORY } from './repositories/forca-trabalho.repository';

describe('PlanosService', () => {
  let service: PlanosService;
  let planoRepo: any;
  let itemRepo: any;
  let ftRepo: any;

  const mockRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  });
  const mockItemRepo = () => ({ create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), delete: jest.fn() });
  const mockFtRepo = () => ({ create: jest.fn(), findMany: jest.fn() });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlanosService,
        { provide: PLANO_AUDITORIA_REPOSITORY, useValue: mockRepo() },
        { provide: ITEM_PLANO_REPOSITORY, useValue: mockItemRepo() },
        { provide: FORCA_TRABALHO_REPOSITORY, useValue: mockFtRepo() },
      ],
    }).compile();
    service = module.get<PlanosService>(PlanosService);
    planoRepo = module.get(PLANO_AUDITORIA_REPOSITORY);
    itemRepo = module.get(ITEM_PLANO_REPOSITORY);
    ftRepo = module.get(FORCA_TRABALHO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar plano como RASCUNHO', async () => {
      planoRepo.create.mockResolvedValue({ id: 'plano-id', status: 'RASCUNHO' });
      const result = await service.create({ tipo: 'PAA', anoInicio: 2026, anoFim: 2026 } as any, 'user-id');
      expect(result.status).toBe('RASCUNHO');
    });
  });

  describe('submeter', () => {
    it('deve rejeitar plano sem itens', async () => {
      planoRepo.findUnique.mockResolvedValue({ id: 'p1', status: 'RASCUNHO', itensPlano: [], forcTrabalho: [] });
      await expect(service.submeter('p1')).rejects.toThrow('ao menos 1 item');
    });
    it('deve rejeitar plano sem status RASCUNHO', async () => {
      planoRepo.findUnique.mockResolvedValue({ id: 'p1', status: 'APROVADO' });
      await expect(service.submeter('p1')).rejects.toThrow(BadRequestException);
    });
    it('deve submeter com sucesso', async () => {
      planoRepo.findUnique.mockResolvedValue({
        id: 'p1',
        status: 'RASCUNHO',
        tipo: 'PDG',
        itensPlano: [{ id: 'i1' }],
        forcTrabalho: [],
      });
      planoRepo.update.mockResolvedValue({ id: 'p1', status: 'SUBMETIDO' });
      const result = await service.submeter('p1');
      expect(result.status).toBe('SUBMETIDO');
    });
  });

  describe('findOne', () => {
    it('deve retornar plano', async () => {
      planoRepo.findUnique.mockResolvedValue({ id: 'p1', status: 'RASCUNHO' });
      const r = await service.findOne('p1');
      expect(r.id).toBe('p1');
    });
    it('deve rejeitar plano deletado', async () => {
      planoRepo.findUnique.mockResolvedValue({ id: 'p1', deletedAt: new Date() });
      await expect(service.findOne('p1')).rejects.toThrow('Plano não encontrado');
    });
  });

  describe('adicionarItem', () => {
    it('deve criar item em plano RASCUNHO', async () => {
      planoRepo.findUnique.mockResolvedValue({ id: 'p1', status: 'RASCUNHO' });
      itemRepo.create.mockResolvedValue({ id: 'i1' });
      const r = await service.adicionarItem('p1', { universoAuditavelId: 'u1' } as any);
      expect(r.id).toBe('i1');
    });
  });

  describe('adicionarForcaTrabalho', () => {
    it('deve adicionar força de trabalho', async () => {
      ftRepo.create.mockResolvedValue({ id: 'ft1', usuarioId: 'u1' });
      const r = await service.adicionarForcaTrabalho('p1', { usuarioId: 'u1', horasDisponiveisAno: 500, ano: 2026 });
      expect(r.id).toBe('ft1');
    });
  });
});
