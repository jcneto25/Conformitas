import { Test, TestingModule } from '@nestjs/testing';
import { IntegracoesController } from './integracoes.controller';
import { IntegracoesService } from './integracoes.service';

describe('IntegracoesController', () => {
  let controller: IntegracoesController;
  let service: IntegracoesService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegracoesController],
      providers: [
        { provide: IntegracoesService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<IntegracoesController>(IntegracoesController);
    service = module.get(IntegracoesService);
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
