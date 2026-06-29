import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacoesService } from './capacitacoes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CapacitacoesService', () => {
  let service: CapacitacoesService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CapacitacoesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<CapacitacoesService>(CapacitacoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an empty array', () => {
      expect(service.findAll()).toEqual([]);
    });
  });
});
