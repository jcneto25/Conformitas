jest.mock('bcrypt', () => ({ hash: jest.fn(), compare: jest.fn() }));
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { USUARIO_REPOSITORY } from './repositories/usuario.repository';

describe('UsuariosController', () => {
  let controller: UsuariosController;

  beforeEach(async () => {
    const mockRepo = () => ({
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
    });
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [UsuariosService, { provide: USUARIO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    controller = module.get<UsuariosController>(UsuariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
