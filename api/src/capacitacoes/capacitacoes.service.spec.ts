import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacoesService } from './capacitacoes.service';
import { CAPACITACAO_REPOSITORY } from './repositories/capacitacao.repository';

describe('CapacitacoesService', () => {
  let service: CapacitacoesService;
  let repo: any;

  const mockRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findConfig: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacitacoesService, { provide: CAPACITACAO_REPOSITORY, useValue: mockRepo() }],
    }).compile();
    service = module.get<CapacitacoesService>(CapacitacoesService);
    repo = module.get(CAPACITACAO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a capacitacao', async () => {
      const dto = {
        titulo: 'Curso de Auditoria',
        cargaHoraria: 20,
        tipo: 'CURSO',
        dataInicio: '2026-03-01',
        participanteIds: ['user-1'],
      } as any;
      repo.create.mockResolvedValue({ id: '1', titulo: dto.titulo, cargaHoraria: 20, tipo: 'CURSO' });
      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return all capacitacoes', async () => {
      repo.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      repo.findUnique.mockResolvedValue({ id: '1', titulo: 'Curso' });
      const result = await service.findOne('1');
      expect(result.titulo).toBe('Curso');
    });

    it('should throw if not found', async () => {
      repo.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow('Capacitação não encontrada');
    });
  });

  describe('totalizarHoras', () => {
    it('should sum hours for participante in year', async () => {
      repo.findMany.mockResolvedValue([{ cargaHoraria: 20 }, { cargaHoraria: 15 }]);
      const result = await service.totalizarHoras('user-1', 2026);
      expect(result.horasRealizadas).toBe(35);
      expect(result.totalCapacitacoes).toBe(2);
    });
  });

  describe('alertaMeta', () => {
    it('should return alert when hours are below meta (RF-012.3)', async () => {
      repo.findConfig.mockResolvedValue({ valor: '40' });
      repo.findMany.mockResolvedValue([{ cargaHoraria: 15 }]);
      const result = await service.alertaMeta('user-1');
      expect(result.meta).toBe(40);
      expect(result.horasRealizadas).toBe(15);
      expect(result.faltam).toBe(25);
      expect(result.alerta).toBe('Meta de 40h/ano: faltam 25h');
    });

    it('should indicate meta atingida when hours >= meta', async () => {
      repo.findConfig.mockResolvedValue({ valor: '40' });
      repo.findMany.mockResolvedValue([{ cargaHoraria: 30 }, { cargaHoraria: 20 }]);
      const result = await service.alertaMeta('user-1');
      expect(result.faltam).toBe(0);
      expect(result.alerta).toContain('atingida');
    });

    it('should default to 40h when config not found', async () => {
      repo.findConfig.mockResolvedValue(null);
      repo.findMany.mockResolvedValue([]);
      const result = await service.alertaMeta('user-1');
      expect(result.meta).toBe(40);
    });
  });

  describe('update', () => {
    it('should update a capacitacao', async () => {
      repo.findUnique.mockResolvedValue({ id: '1' });
      repo.update.mockResolvedValue({ id: '1', titulo: 'Novo' });
      const result = await service.update('1', { titulo: 'Novo' } as any);
      expect(result.titulo).toBe('Novo');
    });
  });

  describe('remove', () => {
    it('should delete a capacitacao', async () => {
      repo.findUnique.mockResolvedValue({ id: '1' });
      repo.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(repo.delete).toHaveBeenCalledWith('1');
    });
  });
});
