import { Test, TestingModule } from '@nestjs/testing';
import { GovernancaService } from './governanca.service';
import { PrismaService } from '../prisma/prisma.service';

describe('GovernancaService', () => {
  let service: GovernancaService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GovernancaService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<GovernancaService>(GovernancaService);
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
