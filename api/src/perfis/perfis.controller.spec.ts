import { Test, TestingModule } from '@nestjs/testing';
import { PerfisController } from './perfis.controller';
import { PerfisService } from './perfis.service';
import { ConflictException } from '@nestjs/common';

type MockPerfisService = {
  [K in keyof PerfisService]: jest.Mock;
};

describe('PerfisController', () => {
  let controller: PerfisController;
  let service: MockPerfisService;

  beforeEach(async () => {
    const mockService: MockPerfisService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByCodigo: jest.fn(),
      atribuirPerfil: jest.fn(),
      removerPerfil: jest.fn(),
      listarPerfisUsuario: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PerfisController],
      providers: [{ provide: PerfisService, useValue: mockService }],
    }).compile();

    controller = module.get<PerfisController>(PerfisController);
    service = module.get(PerfisService) as MockPerfisService;
  });

  describe('GET /perfis', () => {
    it('deve listar perfis', async () => {
      service.findAll.mockResolvedValue([{ id: '1', codigo: 'P01', nome: 'Auditor-Chefe' }]);
      const result = await controller.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('GET /perfis/:id', () => {
    it('deve retornar perfil por ID', async () => {
      service.findOne.mockResolvedValue({ id: '1', codigo: 'P01' });
      const result = await controller.findOne('1');
      expect(result).toHaveProperty('codigo', 'P01');
    });
  });

  describe('POST /usuarios/:id/perfis', () => {
    it('deve atribuir perfil a usuário', async () => {
      service.atribuirPerfil.mockResolvedValue({ id: 'up-1', usuarioId: 'user-1', perfilId: 'perfil-1' });
      const result = await controller.atribuirPerfil('user-1', { perfil_id: 'perfil-1' });
      expect(result).toHaveProperty('id');
    });

    it('deve propagar ConflictException em violação SOD', async () => {
      service.atribuirPerfil.mockRejectedValue(new Error('SOD_VIOLATION: P01 não pode acumular outro perfil'));
      await expect(
        controller.atribuirPerfil('user-1', { perfil_id: 'perfil-2' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('DELETE /usuarios-perfis/:id', () => {
    it('deve remover perfil de usuário', async () => {
      service.removerPerfil.mockResolvedValue(undefined);
      const result = await controller.removerPerfil('up-1');
      expect(result).toBeUndefined();
    });
  });

  describe('GET /usuarios/:id/perfis', () => {
    it('deve listar perfis do usuário', async () => {
      service.listarPerfisUsuario.mockResolvedValue([{ id: 'up-1', perfil: { codigo: 'P01' } }]);
      const result = await controller.listarPerfisUsuario('user-1');
      expect(result).toHaveLength(1);
    });
  });
});
