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
      providers: [
        IntegracoesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
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
    it('should create integracao', async () => {
      mockPrisma.integracao.findFirst.mockResolvedValue(null);
      mockPrisma.integracao.create.mockResolvedValue({ id: 'new-id' });

      const dto = { nome: 'Test', sistemaExterno: 'T', tipo: 'ENTRADA', protocolo: 'REST', status: 'EM_CONFIGURACAO' };
      const result = await service.create(dto as any);
      expect(result.id).toBe('new-id');
    });
  });
});
