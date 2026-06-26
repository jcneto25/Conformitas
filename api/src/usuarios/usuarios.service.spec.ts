import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from './usuarios.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  usuario: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

describe('UsuariosService', () => {
  let service: UsuariosService;
  let prisma: ReturnType<typeof mockPrisma>;

  const mockUser = {
    id: 'uuid-1',
    nome: 'João Silva',
    email: 'joao@audin.tjce.gov.br',
    matricula: 'AUD001',
    cargo: 'Auditor',
    unidade: 'AUDIN',
    senhaHash: '',
    mfaEnabled: false,
    mfaSecret: null,
    ativo: true,
    dataDesativacao: null,
    tentativasLogin: 0,
    bloqueadoAte: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
    prisma = module.get(PrismaService) as any;
  });

  describe('create', () => {
    it('deve criar usuário com senha hasheada', async () => {
      const dto = {
        nome: 'João Silva',
        email: 'joao@audin.tjce.gov.br',
        matricula: 'AUD001',
        cargo: 'Auditor',
        unidade: 'AUDIN',
        senha: 'Valid@123',
      };
      prisma.usuario.create.mockResolvedValue({ ...mockUser, senhaHash: 'hashed-password' });

      const result = await service.create(dto);

      const createCall = prisma.usuario.create.mock.calls[0][0];
      const isHashed = await bcrypt.compare(dto.senha, createCall.data.senhaHash);
      expect(isHashed).toBe(true);
      expect(result).not.toHaveProperty('senhaHash');
    });

    it('deve lançar ConflictException para email duplicado', async () => {
      prisma.usuario.create.mockRejectedValue({ code: 'P2002', meta: { target: ['email'] } });

      await expect(
        service.create({
          nome: 'Test',
          email: 'exists@test.com',
          matricula: 'XXX',
          cargo: 'Auditor',
          unidade: 'AUDIN',
          senha: 'Valid@123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários sem senhaHash', async () => {
      prisma.usuario.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(result[0]).not.toHaveProperty('senhaHash');
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário por id', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne('uuid-1');

      expect(result).toHaveProperty('id', 'uuid-1');
      expect(result).not.toHaveProperty('senhaHash');
    });

    it('deve lançar NotFoundException para id inexistente', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar campos do usuário', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);
      prisma.usuario.update.mockResolvedValue({ ...mockUser, nome: 'Novo Nome' });

      const result = await service.update('uuid-1', { nome: 'Novo Nome' });

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: { nome: 'Novo Nome' },
        }),
      );
      expect(result).toHaveProperty('nome', 'Novo Nome');
    });

    it('deve lançar NotFoundException para usuário inexistente', async () => {
      prisma.usuario.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid-id', { nome: 'Test' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deactivate', () => {
    it('deve desativar usuário (soft delete)', async () => {
      prisma.usuario.findUnique.mockResolvedValue(mockUser);

      await service.deactivate('uuid-1');

      expect(prisma.usuario.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: expect.objectContaining({
            ativo: false,
            dataDesativacao: expect.any(Date),
          }),
        }),
      );
    });
  });
});
