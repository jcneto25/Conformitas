import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from './config.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  configuracaoSistema: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
});

describe('ConfigService', () => {
  let service: ConfigService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
    prisma = module.get(PrismaService) as any;
  });

  describe('findAll', () => {
    it('deve retornar todas as configurações ordenadas por chave', async () => {
      const configs = [{ chave: 'prazo_manifestacao', valor: '5' }];
      prisma.configuracaoSistema.findMany.mockResolvedValue(configs);

      const result = await service.findAll();
      expect(result).toEqual(configs);
      expect(prisma.configuracaoSistema.findMany).toHaveBeenCalledWith({ orderBy: { chave: 'asc' } });
    });
  });

  describe('findOne', () => {
    it('deve retornar configuração pela chave', async () => {
      const config = { chave: 'prazo_manifestacao', valor: '5' };
      prisma.configuracaoSistema.findUnique.mockResolvedValue(config);

      const result = await service.findOne('prazo_manifestacao');
      expect(result).toEqual(config);
    });

    it('deve lançar NotFoundException para chave inexistente', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue(null);

      await expect(service.findOne('inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar configuração editável', async () => {
      const config = { chave: 'prazo_manifestacao', valor: '5', editavel: true };
      prisma.configuracaoSistema.findUnique.mockResolvedValue(config);
      prisma.configuracaoSistema.update.mockResolvedValue({ ...config, valor: '7' });

      const result = await service.update('prazo_manifestacao', '7');
      expect(result.valor).toBe('7');
    });

    it('deve lançar ForbiddenException para configuração não editável', async () => {
      const config = { chave: 'tentativas_login_max', valor: '5', editavel: false };
      prisma.configuracaoSistema.findUnique.mockResolvedValue(config);

      await expect(service.update('tentativas_login_max', '10')).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getValor', () => {
    it('deve retornar valor da configuração ou fallback', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue(null);

      const result = await service.getValor('inexistente', '42');
      expect(result).toBe('42');
    });
  });
});
