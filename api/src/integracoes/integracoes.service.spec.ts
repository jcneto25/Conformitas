import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesService } from './integracoes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('IntegracoesService', () => {
  let service: IntegracoesService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntegracoesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<IntegracoesService>(IntegracoesService);
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
