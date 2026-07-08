import { Test, TestingModule } from '@nestjs/testing';
import { PerfisService } from './perfis.service';
import { PERFIL_REPOSITORY } from './repositories/perfil.repository';
import { USUARIO_PERFIL_REPOSITORY } from './repositories/usuario-perfil.repository';

describe('PerfisService', () => {
  let service: PerfisService;
  let perfilRepo: any;
  let usuarioPerfilRepo: any;

  const mockPerfilRepo = () => ({ findAll: jest.fn(), findUnique: jest.fn(), findByCodigo: jest.fn() });
  const mockUsuarioPerfilRepo = () => ({
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PerfisService,
        { provide: PERFIL_REPOSITORY, useValue: mockPerfilRepo() },
        { provide: USUARIO_PERFIL_REPOSITORY, useValue: mockUsuarioPerfilRepo() },
      ],
    }).compile();
    service = module.get<PerfisService>(PerfisService);
    perfilRepo = module.get(PERFIL_REPOSITORY);
    usuarioPerfilRepo = module.get(USUARIO_PERFIL_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should findAll', async () => {
    perfilRepo.findAll.mockResolvedValue([{ codigo: 'P01' }]);
    expect(await service.findAll()).toHaveLength(1);
  });
  it('should findOne', async () => {
    perfilRepo.findUnique.mockResolvedValue({ id: '1', codigo: 'P01' });
    expect((await service.findOne('1')).codigo).toBe('P01');
  });
  it('should throw if perfis nao encontrado', async () => {
    perfilRepo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Perfil não encontrado');
  });
  it('deve atribuir perfil com sucesso', async () => {
    usuarioPerfilRepo.findMany.mockResolvedValue([]);
    perfilRepo.findUnique.mockResolvedValue({ id: 'perfil-1', codigo: 'P02' });
    usuarioPerfilRepo.create.mockResolvedValue({ id: 'up-1' });
    const r = await service.atribuirPerfil('user-1', 'perfil-1', 'UNIDADE_X');
    expect(r.id).toBe('up-1');
  });
  it('deve rejeitar P01 com outros perfis', async () => {
    usuarioPerfilRepo.findMany.mockResolvedValue([{ perfil: { codigo: 'P02' } }]);
    perfilRepo.findUnique.mockResolvedValue({ id: 'p1', codigo: 'P01' });
    await expect(service.atribuirPerfil('user-1', 'p1')).rejects.toThrow('SOD_VIOLATION');
  });
  it('deve rejeitar atribuir perfil a usuario P10', async () => {
    usuarioPerfilRepo.findMany.mockResolvedValue([{ perfil: { codigo: 'P10' } }]);
    perfilRepo.findUnique.mockResolvedValue({ id: 'perfil-p02', codigo: 'P02' });
    await expect(service.atribuirPerfil('user-1', 'perfil-p02')).rejects.toThrow('SOD_VIOLATION');
  });
});
