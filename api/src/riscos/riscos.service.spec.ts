import { Test, TestingModule } from '@nestjs/testing';
import { RiscosService } from './riscos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RiscosService', () => {
  let service: RiscosService;

  const mockPrisma = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RiscosService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RiscosService>(RiscosService);
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
