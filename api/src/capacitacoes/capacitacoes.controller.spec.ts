import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacoesController } from './capacitacoes.controller';
import { CapacitacoesService } from './capacitacoes.service';

describe('CapacitacoesController', () => {
  let controller: CapacitacoesController;
  let service: CapacitacoesService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CapacitacoesController],
      providers: [
        { provide: CapacitacoesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<CapacitacoesController>(CapacitacoesController);
    service = module.get(CapacitacoesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return service.findAll() result', () => {
      mockService.findAll.mockReturnValue([{ id: '1' }]);
      expect(controller.findAll()).toEqual([{ id: '1' }]);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
});
