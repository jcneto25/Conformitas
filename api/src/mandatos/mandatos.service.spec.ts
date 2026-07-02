import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { MandatosService } from './mandatos.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  mandatoAuditorChefe: {
    findMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

function makeMandato(overrides: any = {}) {
  return {
    id: 'm-uuid',
    numeroMandato: 1,
    usuarioId: 'user-id',
    status: 'CONCLUIDO',
    dataInicio: new Date('2024-01-01'),
    dataFimPrevista: new Date('2026-01-01'),
    dataFimReal: new Date('2026-01-01'),
    atoDesignacao: 'ATO-001',
    createdAt: new Date(),
    ...overrides,
  };
}

describe('MandatosService', () => {
  let service: MandatosService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MandatosService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<MandatosService>(MandatosService);
    prisma = module.get(PrismaService) as any;
  });

  describe('create — validação de duração', () => {
    it('deve criar mandato com duração ≤ 2 anos', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([]);
      prisma.mandatoAuditorChefe.create.mockResolvedValue({ id: 'mandato-id' });

      const result = await service.create({
        usuarioId: 'user-id',
        dataInicio: '2026-01-01',
        dataFimPrevista: '2028-01-01',
        atoDesignacao: 'ATO-001/2026',
      });

      expect(result).toHaveProperty('id');
    });

    it('deve rejeitar mandato com duração > 2 anos', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([]);

      await expect(
        service.create({
          usuarioId: 'user-id',
          dataInicio: '2026-01-01',
          dataFimPrevista: '2029-01-01',
          atoDesignacao: 'ATO-001/2026',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('create — limite de mandatos', () => {
    it('deve permitir segundo mandato com interstício ≥ 1 ano', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([
        makeMandato({ numeroMandato: 1, dataFimReal: new Date('2026-01-01') }),
      ]);
      prisma.mandatoAuditorChefe.create.mockResolvedValue({ id: 'mandato-id' });

      const result = await service.create({
        usuarioId: 'user-id',
        dataInicio: '2027-06-01',
        dataFimPrevista: '2029-06-01',
        atoDesignacao: 'ATO-002/2027',
      });

      expect(result).toHaveProperty('id');
    });

    it('deve rejeitar terceiro consecutivo sem interstício de 1 ano', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([
        makeMandato({ numeroMandato: 2, status: 'CONCLUIDO', dataFimReal: new Date('2028-06-01') }),
        makeMandato({ numeroMandato: 1, status: 'CONCLUIDO', dataFimReal: new Date('2026-01-01') }),
      ]);

      await expect(
        service.create({
          usuarioId: 'user-id',
          dataInicio: '2028-08-01',
          dataFimPrevista: '2030-08-01',
          atoDesignacao: 'ATO-003/2028',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar 7º mandato (limite vitalício de 6)', async () => {
      const mandatos = Array.from({ length: 6 }, (_, i) =>
        makeMandato({ numeroMandato: i + 1, status: 'CONCLUIDO' }),
      );
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue(mandatos);

      await expect(
        service.create({
          usuarioId: 'user-id',
          dataInicio: '2040-01-01',
          dataFimPrevista: '2042-01-01',
          atoDesignacao: 'ATO-007/2040',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
