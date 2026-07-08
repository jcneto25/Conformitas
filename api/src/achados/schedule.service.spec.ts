import { Test } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ConsolidarAchadoUseCase } from './use-cases/consolidar-achado.use-case';

describe('ScheduleService', () => {
  it('delega consolidação de expirados para ConsolidarAchadoUseCase', async () => {
    const consolidarExpirados = jest.fn().mockResolvedValue({ consolidados: 0 });
    const module = await Test.createTestingModule({
      providers: [ScheduleService, { provide: ConsolidarAchadoUseCase, useValue: { consolidarExpirados } }],
    }).compile();

    const service = module.get(ScheduleService);
    await service.consolidarAchadosExpirados();
    expect(consolidarExpirados).toHaveBeenCalled();
  });
});
