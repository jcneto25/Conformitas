import { Test, TestingModule } from '@nestjs/testing';
import { UniversoController } from './universo.controller';
import { UniversoService } from './universo.service';
import { CreateUniversoDto } from './dto/create-universo.dto';

describe('UniversoController', () => {
  let controller: UniversoController;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    matrizPriorizacao: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UniversoController],
      providers: [
        { provide: UniversoService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<UniversoController>(UniversoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /universo-auditavel', () => {
    it('criar item retorna 201 com índice calculado', async () => {
      const dto: CreateUniversoDto = {
        nome: 'Secretaria de Finanças',
        tipo: 'AREA',
        unidadeResponsavel: 'SEFIN',
        materialidade: 5,
        relevancia: 5,
        criticidade: 4,
        risco: 3,
      };
      mockService.create.mockResolvedValue({ id: 'uuid', ...dto, indicePriorizacao: 4.16 });
      const result = await controller.create(dto);
      expect(result).toHaveProperty('indicePriorizacao');
      expect(mockService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('GET /universo-auditavel', () => {
    it('listar retorna array', async () => {
      mockService.findAll.mockResolvedValue([{ id: '1' }, { id: '2' }]);
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(2);
      expect(mockService.findAll).toHaveBeenCalled();
    });

    it('listar com filtro tipo', async () => {
      mockService.findAll.mockResolvedValue([]);
      await controller.findAll('AREA');
      expect(mockService.findAll).toHaveBeenCalledWith({ tipo: 'AREA', ativo: undefined, search: undefined });
    });
  });

  describe('GET /universo-auditavel/:id', () => {
    it('buscar por ID retorna item', async () => {
      mockService.findOne.mockResolvedValue({ id: 'abc-123', nome: 'Teste' });
      const result = await controller.findOne('abc-123');
      expect(result).toHaveProperty('id', 'abc-123');
      expect(mockService.findOne).toHaveBeenCalledWith('abc-123');
    });
  });

  describe('PATCH /universo-auditavel/:id', () => {
    it('atualizar nota recalcula índice', async () => {
      const dto = { materialidade: 4, relevancia: 4, criticidade: 4, risco: 4 };
      mockService.update.mockResolvedValue({ id: 'abc-123', ...dto, indicePriorizacao: 4.0 });
      const result = await controller.update('abc-123', dto as any);
      expect(result.indicePriorizacao).toBe(4.0);
      expect(mockService.update).toHaveBeenCalledWith('abc-123', dto);
    });
  });

  describe('DELETE /universo-auditavel/:id', () => {
    it('soft delete retorna 204', async () => {
      mockService.remove.mockResolvedValue({ id: 'abc-123', deletedAt: new Date(), ativo: false });
      const result = await controller.remove('abc-123');
      expect(result).toHaveProperty('ativo', false);
      expect(mockService.remove).toHaveBeenCalledWith('abc-123');
    });
  });

  describe('GET /universo-auditavel/matriz-priorizacao', () => {
    it('retorna itens + destaques', async () => {
      mockService.matrizPriorizacao.mockResolvedValue({
        itens: [{ id: '1', indicePriorizacao: 5.0 }, { id: '2', indicePriorizacao: 3.0 }],
        destaques: ['1'],
      });
      const result = await controller.matrizPriorizacao('200');
      expect(result).toHaveProperty('itens');
      expect(result).toHaveProperty('destaques');
      expect(result.destaques).toContain('1');
      expect(mockService.matrizPriorizacao).toHaveBeenCalledWith(200);
    });
  });
});
