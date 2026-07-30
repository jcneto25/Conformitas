import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { IntegracoesService } from './integracoes.service';
import { PrismaService } from '../prisma/prisma.service';

// Mock global fetch for healthCheck tests
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('IntegracoesService', () => {
  let service: IntegracoesService;

  const mockPrisma = {
    integracao: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    logIntegracao: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IntegracoesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<IntegracoesService>(IntegracoesService);
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return integracoes from prisma ordered by createdAt desc', async () => {
      mockPrisma.integracao.findMany.mockResolvedValue([{ id: '1', nome: 'Teste' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockPrisma.integracao.findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
    });
  });

  describe('findOne', () => {
    it('should return integracao if found', async () => {
      const integracao = { id: '1', nome: 'Teste' };
      mockPrisma.integracao.findUnique.mockResolvedValue(integracao);
      const result = await service.findOne('1');
      expect(result).toEqual(integracao);
    });

    it('should throw NotFoundException if integracao not found', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create integracao with healthStatus NAO_TESTADO', async () => {
      mockPrisma.integracao.findFirst.mockResolvedValue(null);
      mockPrisma.integracao.create.mockResolvedValue({ id: 'new-id', healthStatus: 'NAO_TESTADO' });

      const dto = { nome: 'Test', sistemaExterno: 'T', tipo: 'ENTRADA', protocolo: 'REST', status: 'EM_CONFIGURACAO' };
      const result = await service.create(dto as any);
      expect(result.id).toBe('new-id');
    });

    it('should throw ConflictException if nome exists', async () => {
      mockPrisma.integracao.findFirst.mockResolvedValue({ id: '1' });
      const dto = { nome: 'Exists', sistemaExterno: 'T', tipo: 'ENTRADA', protocolo: 'REST', status: 'EM_CONFIGURACAO' };
      await expect(service.create(dto as any)).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update integracao when it exists', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', nome: 'Old' });
      mockPrisma.integracao.update.mockResolvedValue({ id: '1', nome: 'Updated' });

      const result = await service.update('1', { nome: 'Updated' } as any);
      expect(result.nome).toBe('Updated');
      expect(mockPrisma.integracao.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { nome: 'Updated' },
      });
    });

    it('should throw NotFoundException if integracao not found', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue(null);
      await expect(service.update('x', { nome: 'New' } as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete integracao', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.integracao.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result).toEqual({ id: '1' });
    });

    it('should throw NotFoundException if integracao not found', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue(null);
      await expect(service.remove('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('healthCheck', () => {
    it('should return NAO_TESTADO for integracao without endpoint', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', endpoint: null, nome: 'Test' });
      mockPrisma.logIntegracao.create.mockResolvedValue({});
      mockPrisma.integracao.update.mockResolvedValue({});

      const result = await service.healthCheck('1');
      expect(result.healthStatus).toBe('NAO_TESTADO');
    });

    it('should return ONLINE when endpoint responds ok', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', endpoint: 'https://example.com/api', nome: 'Test' });
      mockFetch.mockResolvedValue({ ok: true });
      mockPrisma.logIntegracao.create.mockResolvedValue({});
      mockPrisma.integracao.update.mockResolvedValue({});

      const result = await service.healthCheck('1');
      expect(result.healthStatus).toBe('ONLINE');
    });

    it('should return ERRO when endpoint returns non-ok', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', endpoint: 'https://example.com/api', nome: 'Test' });
      mockFetch.mockResolvedValue({ ok: false, status: 500 });
      mockPrisma.logIntegracao.create.mockResolvedValue({});
      mockPrisma.integracao.update.mockResolvedValue({});

      const result = await service.healthCheck('1');
      expect(result.healthStatus).toBe('ERRO');
    });

    it('should return OFFLINE when fetch throws', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', endpoint: 'https://invalid.example.com', nome: 'Test' });
      mockFetch.mockRejectedValue(new Error('Network error'));
      mockPrisma.logIntegracao.create.mockResolvedValue({});
      mockPrisma.integracao.update.mockResolvedValue({});

      const result = await service.healthCheck('1');
      expect(result.healthStatus).toBe('OFFLINE');
    });
  });

  describe('healthAll', () => {
    it('should return health status for all integracoes', async () => {
      const integracoes = [
        { id: '1', nome: 'API 1', sistemaExterno: 'S1', healthStatus: 'NAO_TESTADO', status: 'ATIVA' },
        { id: '2', nome: 'API 2', sistemaExterno: 'S2', healthStatus: 'ONLINE', status: 'ATIVA' },
      ];
      mockPrisma.integracao.findMany.mockResolvedValue(integracoes);
      // healthAll calls this.healthCheck for each, which calls findOne (findUnique) then fetch
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1', endpoint: null, nome: 'API 1' });
      mockFetch.mockResolvedValue({ ok: true });
      mockPrisma.logIntegracao.create.mockResolvedValue({});
      mockPrisma.integracao.update.mockResolvedValue({});

      const results = await service.healthAll();
      expect(results).toHaveLength(2);
    });
  });

  describe('logs', () => {
    it('should return last 50 logs for an integracao', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.logIntegracao.findMany.mockResolvedValue([{ id: 'log-1' }, { id: 'log-2' }]);
      const result = await service.logs('1');
      expect(result).toHaveLength(2);
    });

    it('should throw if integracao not found', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue(null);
      await expect(service.logs('x')).rejects.toThrow(NotFoundException);
    });
  });
});