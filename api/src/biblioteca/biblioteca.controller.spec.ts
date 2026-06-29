import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaController } from './biblioteca.controller';
import { BibliotecaService } from './biblioteca.service';

describe('BibliotecaController', () => {
  let controller: BibliotecaController;
  let service: BibliotecaService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BibliotecaController],
      providers: [
        { provide: BibliotecaService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<BibliotecaController>(BibliotecaController);
    service = module.get(BibliotecaService);
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
