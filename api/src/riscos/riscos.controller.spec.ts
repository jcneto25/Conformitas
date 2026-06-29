import { Test, TestingModule } from '@nestjs/testing';
import { RiscosController } from './riscos.controller';
import { RiscosService } from './riscos.service';

describe('RiscosController', () => {
  let controller: RiscosController;
  let service: RiscosService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RiscosController],
      providers: [
        { provide: RiscosService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<RiscosController>(RiscosController);
    service = module.get(RiscosService);
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
