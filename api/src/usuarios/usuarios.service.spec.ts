jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hash123'),
  compare: jest.fn().mockResolvedValue(true),
}));
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';
import { USUARIO_REPOSITORY } from './repositories/usuario.repository';

describe('UsuariosService', () => {
  let service: UsuariosService;
  let repo: any;
  const mockRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService, { provide: USUARIO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<UsuariosService>(UsuariosService);
    repo = module.get(USUARIO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create usuario', async () => {
    repo.create.mockResolvedValue({ id: '1', nome: 'João', email: 'joao@teste.com', senhaHash: 'hash123' });
    const r = await service.create({
      nome: 'João',
      email: 'joao@teste.com',
      matricula: '123',
      cargo: 'AUDITOR',
      unidade: 'SEC',
      senha: '123456',
    } as any);
    expect(r.id).toBe('1');
  });
  it('should findAll', async () => {
    repo.findMany.mockResolvedValue([]);
    expect(await service.findAll()).toEqual([]);
  });
  it('should findOne', async () => {
    repo.findUnique.mockResolvedValue({ id: '1', nome: 'João', senhaHash: 'xxx' });
    const r = await service.findOne('1');
    expect(r.nome).toBe('João');
  });
  it('should throw if not found', async () => {
    repo.findUnique.mockResolvedValue(null);
    await expect(service.findOne('x')).rejects.toThrow('Usuário não encontrado');
  });
});
