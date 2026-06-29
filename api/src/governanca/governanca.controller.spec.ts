import { Test, TestingModule } from '@nestjs/testing';
import { GovernancaController } from './governanca.controller';
import { GovernancaService } from './governanca.service';

describe('GovernancaController', () => {
  let controller: GovernancaController;
  let service: GovernancaService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GovernancaController],
      providers: [
        { provide: GovernancaService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<GovernancaController>(GovernancaController);
    service = module.get(GovernancaService);
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
