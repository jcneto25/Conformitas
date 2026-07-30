import { Test, TestingModule } from '@nestjs/testing';
import { RiscosService } from './riscos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RiscosService', () => {
  let service: RiscosService;
  let prisma: any;

  const mockPrisma = {
    risco: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RiscosService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<RiscosService>(RiscosService);
    prisma = mockPrisma;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calcularNivel', () => {
    it('prob=1 × impact=1 should be BAIXO', () => {
      expect((service as any).calcularNivel(1, 1)).toBe('BAIXO');
    });
    it('prob=2 × impact=3 should be MEDIO', () => {
      expect((service as any).calcularNivel(2, 3)).toBe('MEDIO');
    });
    it('prob=3 × impact=4 should be ALTO (RF-012.1)', () => {
      expect((service as any).calcularNivel(3, 4)).toBe('ALTO');
    });
    it('prob=4 × impact=5 should be CRITICO', () => {
      expect((service as any).calcularNivel(4, 5)).toBe('CRITICO');
    });
    it('prob=5 × impact=5 should be EXTREMO', () => {
      expect((service as any).calcularNivel(5, 5)).toBe('EXTREMO');
    });
  });

  describe('create', () => {
    it('should create risco with calculated nivel', async () => {
      const dto = { codigo: 'R001', descricao: 'Risco teste', probabilidade: 3, impacto: 4, status: 'IDENTIFICADO' };
      prisma.risco.create.mockResolvedValue({ id: '1', ...dto, nivel: 'ALTO', createdAt: new Date(), updatedAt: new Date() });
      const result = await service.create(dto as any);
      expect(prisma.risco.create).toHaveBeenCalledWith({ data: { ...dto, nivel: 'ALTO' } });
      expect(result.nivel).toBe('ALTO');
    });
  });

  describe('findAll', () => {
    it('should return all riscos', async () => {
      prisma.risco.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should filter by nivel', async () => {
      await service.findAll({ nivel: 'ALTO' });
      expect(prisma.risco.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { nivel: 'ALTO' } })
      );
    });
  });

  describe('findOne', () => {
    it('should return risco by id', async () => {
      const data = { id: '1', codigo: 'R001', descricao: 'Teste', nivel: 'MEDIO' };
      prisma.risco.findUnique.mockResolvedValue(data);
      const result = await service.findOne('1');
      expect(result).toEqual(data);
    });

    it('should throw if not found', async () => {
      prisma.risco.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow('Risco não encontrado');
    });
  });

  describe('update', () => {
    it('should recalculate nivel when probabilidade changes', async () => {
      prisma.risco.findUnique.mockResolvedValueOnce({ id: '1', probabilidade: 3, impacto: 4 });
      prisma.risco.findUnique.mockResolvedValueOnce({ id: '1', probabilidade: 3, impacto: 4 });
      prisma.risco.update.mockResolvedValue({ id: '1', probabilidade: 5, impacto: 4, nivel: 'CRITICO' });
      const result = await service.update('1', { probabilidade: 5 } as any);
      expect(result.nivel).toBe('CRITICO');
      expect(prisma.risco.update).toHaveBeenCalledWith(
        { where: { id: '1' }, data: { probabilidade: 5, nivel: 'CRITICO' } }
      );
    });
  });

  describe('matrizRiscos', () => {
    it('should return grouped riscos', async () => {
      prisma.risco.findMany.mockResolvedValue([
        { nivel: 'BAIXO' }, { nivel: 'ALTO' }, { nivel: 'ALTO' },
      ]);
      const result = await service.matrizRiscos();
      expect(result.total).toBe(3);
      expect(result.agrupado.BAIXO).toBe(1);
      expect(result.agrupado.ALTO).toBe(2);
      expect(result.agrupado.CRITICO).toBe(0);
    });
  });

  describe('resumoPorCategoria', () => {
    it('should return per-category summary', async () => {
      prisma.risco.findMany.mockResolvedValue([
        { categoria: 'FISCAL', probabilidade: 3, impacto: 4 },
        { categoria: 'FISCAL', probabilidade: 2, impacto: 3 },
        { categoria: 'OPERACIONAL', probabilidade: 4, impacto: 5 },
      ]);
      const result = await service.resumoPorCategoria();
      expect(result).toHaveLength(2);
      const fiscal = result.find(r => r.categoria === 'FISCAL');
      expect(fiscal?.total).toBe(2);
      expect(fiscal?.scoreMedio).toBe(9); // (12+6)/2 = 9
    });
  });

  describe('remove', () => {
    it('should delete a risco', async () => {
      prisma.risco.findUnique.mockResolvedValue({ id: '1' });
      prisma.risco.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(prisma.risco.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
