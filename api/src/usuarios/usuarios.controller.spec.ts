import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

type MockUsuariosService = {
  [K in keyof UsuariosService]: jest.Mock;
};

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: MockUsuariosService;

  beforeEach(async () => {
    const mockService: MockUsuariosService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      deactivate: jest.fn(),
      findByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [{ provide: UsuariosService, useValue: mockService }],
    }).compile();

    controller = module.get<UsuariosController>(UsuariosController);
    service = module.get(UsuariosService) as MockUsuariosService;
  });

  it('create deve chamar service.create com dto', async () => {
    const dto: CreateUsuarioDto = {
      nome: 'Test',
      email: 'test@test.com',
      matricula: 'TST',
      cargo: 'Auditor',
      unidade: 'AUDIN',
      senha: 'Valid@123',
    };
    service.create.mockResolvedValue({ id: 'uuid' });

    const result = await controller.create(dto);

    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toHaveProperty('id');
  });

  it('findAll deve chamar service.findAll', async () => {
    service.findAll.mockResolvedValue([]);

    await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
  });

  it('findOne deve chamar service.findOne com id', async () => {
    service.findOne.mockResolvedValue({ id: 'uuid-1' });

    const result = await controller.findOne('uuid-1');

    expect(service.findOne).toHaveBeenCalledWith('uuid-1');
    expect(result).toHaveProperty('id');
  });

  it('update deve chamar service.update com id e dto', async () => {
    const dto: UpdateUsuarioDto = { nome: 'Novo Nome' };
    service.update.mockResolvedValue({ id: 'uuid-1', nome: 'Novo Nome' });

    const result = await controller.update('uuid-1', dto);

    expect(service.update).toHaveBeenCalledWith('uuid-1', dto);
    expect(result).toHaveProperty('nome', 'Novo Nome');
  });

  it('deactivate deve chamar service.deactivate com id', async () => {
    service.deactivate.mockResolvedValue(undefined);

    await controller.deactivate('uuid-1');

    expect(service.deactivate).toHaveBeenCalledWith('uuid-1');
  });
});
