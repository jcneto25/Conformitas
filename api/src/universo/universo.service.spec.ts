import { Test, TestingModule } from '@nestjs/testing';
import { UniversoService } from './universo.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  universoAuditavel: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

describe('UniversoService', () => {
  let service: UniversoService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniversoService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<UniversoService>(UniversoService);
    prisma = module.get(PrismaService) as any;
  });

  describe('cálculo do índice de priorização', () => {
    it('notas 5,5,5,5 deve resultar índice 5.0', async () => {
      prisma.universoAuditavel.create.mockResolvedValue({ id: 'uuid', indicePriorizacao: 5.0 });
      const result = await service.create({
        nome: 'Teste',
        tipo: 'AREA',
        unidadeResponsavel: 'AUDIN',
        materialidade: 5,
        relevancia: 5,
        criticidade: 5,
        risco: 5,
      });
      const createCall = prisma.universoAuditavel.create.mock.calls[0][0];
      expect(createCall.data.indicePriorizacao).toBe(5.0);
      expect(result).toHaveProperty('indicePriorizacao');
    });

    it('notas 1,1,1,1 deve resultar índice 1.0', async () => {
      prisma.universoAuditavel.create.mockResolvedValue({ id: 'uuid', indicePriorizacao: 1.0 });
      await service.create({
        nome: 'Teste',
        tipo: 'AREA',
        unidadeResponsavel: 'AUDIN',
        materialidade: 1,
        relevancia: 1,
        criticidade: 1,
        risco: 1,
      });
      const createCall = prisma.universoAuditavel.create.mock.calls[0][0];
      expect(createCall.data.indicePriorizacao).toBe(1.0);
    });

    it('notas 3,4,5,2 deve resultar índice ~3.31', async () => {
      prisma.universoAuditavel.create.mockResolvedValue({ id: 'uuid', indicePriorizacao: 0 });
      await service.create({
        nome: 'Teste',
        tipo: 'AREA',
        unidadeResponsavel: 'AUDIN',
        materialidade: 3,
        relevancia: 4,
        criticidade: 5,
        risco: 2,
      });
      const createCall = prisma.universoAuditavel.create.mock.calls[0][0];
      expect(createCall.data.indicePriorizacao).toBeCloseTo(3.31, 1);
    });
  });

  describe('findAll', () => {
    it('deve filtrar por tipo', async () => {
      prisma.universoAuditavel.findMany.mockResolvedValue([]);
      await service.findAll({ tipo: 'AREA' });
      expect(prisma.universoAuditavel.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ tipo: 'AREA' }),
        }),
      );
    });
  });

  describe('matrizPriorizacao', () => {
    it('deve retornar itens ordenados por índice descendente', async () => {
      prisma.universoAuditavel.findMany.mockResolvedValue([
        { id: '1', nome: 'Alto', indicePriorizacao: 5.0 },
        { id: '2', nome: 'Baixo', indicePriorizacao: 1.0 },
      ]);
      const result = await service.matrizPriorizacao();
      expect(result.itens).toHaveLength(2);
      expect((result.itens[0]!.indicePriorizacao ?? 0)).toBeGreaterThanOrEqual((result.itens[1]!.indicePriorizacao ?? 0));
    });
  });
});
