import { Test, TestingModule } from '@nestjs/testing';
import { QualidadeService } from './qualidade.service';
import { PrismaService } from '../prisma/prisma.service';

describe('QualidadeService', () => {
  let service: QualidadeService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QualidadeService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<QualidadeService>(QualidadeService);
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
