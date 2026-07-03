import { Test, TestingModule } from '@nestjs/testing';
import { CapacitacoesService } from './capacitacoes.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CapacitacoesService', () => {
  let service: CapacitacoesService;
  let prisma: any;

  const mockPrisma = () => ({
    capacitacao: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    configuracaoSistema: {
      findUnique: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CapacitacoesService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<CapacitacoesService>(CapacitacoesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a capacitacao', async () => {
      const dto = {
        titulo: 'Curso de Auditoria', cargaHoraria: 20, tipo: 'CURSO',
        dataInicio: '2026-03-01', participanteIds: ['user-1'],
      };
      prisma.capacitacao.create.mockResolvedValue({ id: '1', ...dto, dataInicio: new Date('2026-03-01') });
      const result = await service.create(dto as any);
      expect(prisma.capacitacao.create).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return all capacitacoes', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue({ id: '1', titulo: 'Curso' });
      const result = await service.findOne('1');
      expect(result.titulo).toBe('Curso');
    });

    it('should throw if not found', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow('Capacitação não encontrada');
    });
  });

  describe('totalizarHoras', () => {
    it('should sum hours for participante in year', async () => {
      prisma.capacitacao.findMany.mockResolvedValue([
        { cargaHoraria: 20 }, { cargaHoraria: 15 },
      ]);
      const result = await service.totalizarHoras('user-1', 2026);
      expect(result.horasRealizadas).toBe(35);
      expect(result.totalCapacitacoes).toBe(2);
    });
  });

  describe('alertaMeta', () => {
    it('should return alert when hours are below meta (RF-012.3)', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue({ chave: 'meta_horas_capacitacao_anual', valor: '40' });
      prisma.capacitacao.findMany.mockResolvedValue([
        { cargaHoraria: 15 },
      ]);
      const result = await service.alertaMeta('user-1');
      expect(result.meta).toBe(40);
      expect(result.horasRealizadas).toBe(15);
      expect(result.faltam).toBe(25);
      expect(result.alerta).toBe('Meta de 40h/ano: faltam 25h');
    });

    it('should indicate meta atingida when hours >= meta', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue({ chave: 'meta_horas_capacitacao_anual', valor: '40' });
      prisma.capacitacao.findMany.mockResolvedValue([
        { cargaHoraria: 30 }, { cargaHoraria: 20 },
      ]);
      const result = await service.alertaMeta('user-1');
      expect(result.faltam).toBe(0);
      expect(result.alerta).toContain('atingida');
    });

    it('should default to 40h when config not found', async () => {
      prisma.configuracaoSistema.findUnique.mockResolvedValue(null);
      prisma.capacitacao.findMany.mockResolvedValue([]);
      const result = await service.alertaMeta('user-1');
      expect(result.meta).toBe(40);
    });
  });

  describe('update', () => {
    it('should update a capacitacao', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue({ id: '1' });
      prisma.capacitacao.update.mockResolvedValue({ id: '1', titulo: 'Novo' });
      const result = await service.update('1', { titulo: 'Novo' } as any);
      expect(result.titulo).toBe('Novo');
    });
  });

  describe('remove', () => {
    it('should delete a capacitacao', async () => {
      prisma.capacitacao.findUnique.mockResolvedValue({ id: '1' });
      prisma.capacitacao.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(prisma.capacitacao.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});
