import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaController } from './biblioteca.controller';
import { BibliotecaService } from './biblioteca.service';

describe('BibliotecaController', () => {
  let controller: BibliotecaController;
  let service: any;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    upload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliotecaController],
      providers: [{ provide: BibliotecaService, useValue: mockService }],
    }).compile();
    controller = module.get<BibliotecaController>(BibliotecaController);
    service = module.get(BibliotecaService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should delegate', async () => {
    const dto = { titulo: 'Manual', tipo: 'MANUAL', arquivoPath: '/docs/m.pdf', status: 'ATIVO' };
    mockService.create.mockResolvedValue({ id: '1' });
    expect(await controller.create(dto as any)).toEqual({ id: '1' });
  });

  it('upload should delegate with versionamento', async () => {
    mockService.upload.mockResolvedValue({ versao: '1.1' });
    const result = await controller.upload('Manual', 'MANUAL', '/docs/v2.pdf', undefined, 'Categoria');
    expect(result.versao).toBe('1.1');
    expect(mockService.upload).toHaveBeenCalledWith('Manual', 'MANUAL', '/docs/v2.pdf', 'Categoria');
  });

  it('findAll should delegate with search', async () => {
    mockService.findAll.mockResolvedValue([]);
    await controller.findAll('MANUAL', undefined, 'Auditoria', 'ATIVO');
    expect(mockService.findAll).toHaveBeenCalledWith({
      tipo: 'MANUAL',
      categoria: undefined,
      search: 'Auditoria',
      status: 'ATIVO',
    });
  });

  it('findOne should delegate', async () => {
    mockService.findOne.mockResolvedValue({ id: '1' });
    expect(await controller.findOne('1')).toEqual({ id: '1' });
  });

  it('update should delegate', async () => {
    mockService.update.mockResolvedValue({ id: '1' });
    await controller.update('1', { titulo: 'Novo' });
    expect(mockService.update).toHaveBeenCalledWith('1', { titulo: 'Novo' });
  });

  it('remove should delegate', async () => {
    mockService.remove.mockResolvedValue({ id: '1', status: 'ARQUIVADO' });
    await controller.remove('1');
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
