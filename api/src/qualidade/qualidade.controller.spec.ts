import { Test, TestingModule } from '@nestjs/testing';
import { QualidadeController } from './qualidade.controller';
import { QualidadeService } from './qualidade.service';

describe('QualidadeController', () => {
  let controller: QualidadeController;
  let service: QualidadeService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QualidadeController],
      providers: [
        { provide: QualidadeService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<QualidadeController>(QualidadeController);
    service = module.get(QualidadeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return service.findAll() result', () => {
      const expected = [{ id: '1' }];
      mockService.findAll.mockReturnValue(expected);

      const result = controller.findAll();

      expect(result).toEqual(expected);
      expect(mockService.findAll).toHaveBeenCalled();
    });
  });
});
