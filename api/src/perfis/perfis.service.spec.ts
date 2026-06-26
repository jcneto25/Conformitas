import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { PerfisService } from './perfis.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  perfil: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  usuarioPerfil: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
});

describe('PerfisService', () => {
  let service: PerfisService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PerfisService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<PerfisService>(PerfisService);
    prisma = module.get(PrismaService) as any;
  });

  describe('atribuirPerfil', () => {
    it('deve permitir atribuir P02 a usuário sem perfis', async () => {
      prisma.usuarioPerfil.findMany.mockResolvedValue([]);
      prisma.perfil.findUnique.mockResolvedValue({ id: 'perfil-id', codigo: 'P02' });

      prisma.usuarioPerfil.create.mockResolvedValue({ id: 'up-id' });

      const result = await service.atribuirPerfil('user-id', 'perfil-id');
      expect(result).toHaveProperty('id');
    });

    it('deve rejeitar atribuir P02 a usuário que já é P01', async () => {
      prisma.usuarioPerfil.findMany.mockResolvedValue([{ id: 'up1', perfil: { codigo: 'P01' } }]);
      prisma.perfil.findUnique.mockResolvedValue({ id: 'perfil-id', codigo: 'P02' });

      await expect(service.atribuirPerfil('user-id', 'perfil-id')).rejects.toThrow('SOD_VIOLATION');
    });

    it('deve rejeitar atribuir perfil a usuário P10', async () => {
      prisma.usuarioPerfil.findMany.mockResolvedValue([{ id: 'up1', perfil: { codigo: 'P10' } }]);
      prisma.perfil.findUnique.mockResolvedValue({ id: 'perfil-id', codigo: 'P02' });

      await expect(service.atribuirPerfil('user-id', 'perfil-id')).rejects.toThrow('SOD_VIOLATION');
    });
  });
});
