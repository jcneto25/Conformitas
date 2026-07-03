import { Test, TestingModule } from '@nestjs/testing';
import { CompetenciasService } from './competencias.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CompetenciasService', () => {
  let service: CompetenciasService;
  let prisma: any;

  const mockPrisma = () => ({
    competencia: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompetenciasService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();
    service = module.get<CompetenciasService>(CompetenciasService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a competencia', async () => {
      const dto = { nome: 'Auditoria Financeira', tipo: 'TECNICA', areaAuditoria: 'Contábil' };
      prisma.competencia.create.mockResolvedValue({ id: '1', ...dto, createdAt: new Date() });
      const result = await service.create(dto);
      expect(prisma.competencia.create).toHaveBeenCalledWith({ data: dto });
      expect(result.nome).toBe('Auditoria Financeira');
    });
  });

  describe('findAll', () => {
    it('should return all competencias', async () => {
      const data = [{ id: '1', nome: 'Auditoria', tipo: 'TECNICA', areaAuditoria: null, createdAt: new Date() }];
      prisma.competencia.findMany.mockResolvedValue(data);
      const result = await service.findAll();
      expect(result).toEqual(data);
      expect(prisma.competencia.findMany).toHaveBeenCalledWith({ where: {}, orderBy: { nome: 'asc' } });
    });

    it('should filter by tipo', async () => {
      prisma.competencia.findMany.mockResolvedValue([]);
      await service.findAll({ tipo: 'GERENCIAL' });
      expect(prisma.competencia.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { tipo: 'GERENCIAL' } })
      );
    });
  });

  describe('findOne', () => {
    it('should return a competencia by id', async () => {
      const data = { id: '1', nome: 'Auditoria', tipo: 'TECNICA', areaAuditoria: null, createdAt: new Date() };
      prisma.competencia.findUnique.mockResolvedValue(data);
      const result = await service.findOne('1');
      expect(result).toEqual(data);
    });

    it('should throw NotFoundException if not found', async () => {
      prisma.competencia.findUnique.mockResolvedValue(null);
      await expect(service.findOne('not-found')).rejects.toThrow('Competência não encontrada');
    });
  });

  describe('update', () => {
    it('should update a competencia', async () => {
      const existing = { id: '1', nome: 'Antigo', tipo: 'TECNICA', areaAuditoria: null, createdAt: new Date() };
      prisma.competencia.findUnique.mockResolvedValue(existing);
      prisma.competencia.update.mockResolvedValue({ ...existing, nome: 'Novo' });
      const result = await service.update('1', { nome: 'Novo' });
      expect(result.nome).toBe('Novo');
      expect(prisma.competencia.update).toHaveBeenCalledWith({ where: { id: '1' }, data: { nome: 'Novo' } });
    });

    it('should throw if competencia not found', async () => {
      prisma.competencia.findUnique.mockResolvedValue(null);
      await expect(service.update('not-found', { nome: 'X' })).rejects.toThrow('Competência não encontrada');
    });
  });

  describe('remove', () => {
    it('should delete a competencia', async () => {
      prisma.competencia.findUnique.mockResolvedValue({ id: '1' });
      prisma.competencia.delete.mockResolvedValue({ id: '1' });
      await service.remove('1');
      expect(prisma.competencia.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw if not found', async () => {
      prisma.competencia.findUnique.mockResolvedValue(null);
      await expect(service.remove('not-found')).rejects.toThrow('Competência não encontrada');
    });
  });
});
