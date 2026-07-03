import { Test } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { AchadosService } from './achados.service';

/**
 * T-078 — o cron (@Cron EVERY_HOUR) delega a consolidação de expirados
 * ao AchadosService. Garante o fio do cron (antes sem cobertura).
 */
describe('ScheduleService', () => {
  it('delega a consolidação de expirados para AchadosService', async () => {
    const consolidarExpirados = jest.fn().mockResolvedValue({ consolidados: 0 });
    const module = await Test.createTestingModule({
      providers: [ScheduleService, { provide: AchadosService, useValue: { consolidarExpirados } }],
    }).compile();

    const service = module.get(ScheduleService);
    await service.consolidarAchadosExpirados();
    expect(consolidarExpirados).toHaveBeenCalled();
  });
});
