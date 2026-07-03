import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesService } from './integracoes.service';
import { PrismaService } from '../prisma/prisma.service';

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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return integracoes from prisma', async () => {
      mockPrisma.integracao.findMany.mockResolvedValue([{ id: '1', nome: 'Teste' }]);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(mockPrisma.integracao.findMany).toHaveBeenCalled();
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
      await expect(service.create(dto as any)).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if integracao not found', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete integracao', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.integracao.delete.mockResolvedValue({ id: '1' });
      const result = await service.remove('1');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('logs', () => {
    it('should return last 50 logs for an integracao', async () => {
      mockPrisma.integracao.findUnique.mockResolvedValue({ id: '1' });
      mockPrisma.logIntegracao.findMany.mockResolvedValue([{ id: 'log-1' }, { id: 'log-2' }]);
      const result = await service.logs('1');
      expect(result).toHaveLength(2);
    });
  });
});
