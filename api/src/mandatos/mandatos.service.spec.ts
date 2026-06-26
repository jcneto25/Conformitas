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

  describe('create', () => {
    it('deve criar primeiro mandato', async () => {
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

    it('deve permitir segundo mandato consecutivo', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([{ id: 'm1', numeroMandato: 1, status: 'CONCLUIDO' }]);
      prisma.mandatoAuditorChefe.create.mockResolvedValue({ id: 'mandato-id' });

      const result = await service.create({
        usuarioId: 'user-id',
        dataInicio: '2028-01-01',
        dataFimPrevista: '2030-01-01',
        atoDesignacao: 'ATO-002/2028',
      });

      expect(result).toHaveProperty('id');
    });

    it('deve rejeitar terceiro mandato consecutivo', async () => {
      prisma.mandatoAuditorChefe.findMany.mockResolvedValue([
        { id: 'm2', numeroMandato: 2, status: 'CONCLUIDO' },
        { id: 'm1', numeroMandato: 1, status: 'CONCLUIDO' },
      ]);

      await expect(
        service.create({
          usuarioId: 'user-id',
          dataInicio: '2030-01-01',
          dataFimPrevista: '2032-01-01',
          atoDesignacao: 'ATO-003/2030',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
