import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { AcoesCoordenadasService } from './acoes-coordenadas.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AcoesCoordenadasService', () => {
  let service: AcoesCoordenadasService;
  let prisma: any;

  const mockPrisma = {
    acaoCoordenada: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    auditoria: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcoesCoordenadasService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<AcoesCoordenadasService>(AcoesCoordenadasService);
    prisma = mockPrisma;
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all acoes ordenadas by createdAt desc', async () => {
      const mock = [{ id: '1', codigoSiaud: 'S-001', titulo: 'Test' }];
      prisma.acaoCoordenada.findMany.mockResolvedValue(mock);
      const result = await service.findAll();
      expect(result).toEqual(mock);
    });
  });

  describe('findOne', () => {
    it('should return an acao by id', async () => {
      const mock = { id: '1', codigoSiaud: 'S-001', titulo: 'Test' };
      prisma.acaoCoordenada.findUnique.mockResolvedValue(mock);
      const result = await service.findOne('1');
      expect(result).toEqual(mock);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should throw if codigoSiaud already exists', async () => {
      prisma.acaoCoordenada.findFirst.mockResolvedValue({ id: '1' });
      await expect(service.create({ codigoSiaud: 'S-001', titulo: 'Test', status: 'RECEBIDA' } as any))
        .rejects.toThrow(BadRequestException);
    });

    it('should create acao with resultadoReportado=false', async () => {
      prisma.acaoCoordenada.findFirst.mockResolvedValue(null);
      prisma.acaoCoordenada.create.mockResolvedValue({ id: '1', resultadoReportado: false });
      const result = await service.create({ codigoSiaud: 'S-001', titulo: 'Test', status: 'RECEBIDA' } as any);
      expect(result.resultadoReportado).toBe(false);
    });
  });

  describe('update', () => {
    it('should throw NotFoundException if acao does not exist', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue(null);
      await expect(service.update('x', {} as any)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reportarResultado', () => {
    it('should throw if resultado already reported', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue({ id: '1', resultadoReportado: true });
      await expect(service.reportarResultado('1', { auditoriaId: 'aud-1' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should throw if auditoria not found', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue({ id: '1', resultadoReportado: false });
      prisma.auditoria.findUnique.mockResolvedValue(null);
      await expect(service.reportarResultado('1', { auditoriaId: 'aud-1' }))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw if auditoria is not CONCLUIDA', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue({ id: '1', resultadoReportado: false });
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO', deletedAt: null });
      await expect(service.reportarResultado('1', { auditoriaId: 'aud-1' }))
        .rejects.toThrow(BadRequestException);
    });

    it('should report successfully with status REPORTADA', async () => {
      prisma.acaoCoordenada.findUnique.mockResolvedValue({ id: '1', resultadoReportado: false });
      prisma.auditoria.findUnique.mockResolvedValue({ id: 'aud-1', status: 'CONCLUIDA', deletedAt: null });
      prisma.acaoCoordenada.update.mockResolvedValue({ id: '1', status: 'REPORTADA', resultadoReportado: true });
      const result = await service.reportarResultado('1', { auditoriaId: 'aud-1' });
      expect(result.status).toBe('REPORTADA');
      expect(result.resultadoReportado).toBe(true);
    });
  });

  describe('webhookReceber', () => {
    it('should force status RECEBIDA for webhook entries', async () => {
      prisma.acaoCoordenada.findFirst.mockResolvedValue(null);
      prisma.acaoCoordenada.create.mockResolvedValue({ id: '1', status: 'RECEBIDA' });
      const result = await service.webhookReceber({ codigoSiaud: 'S-001', titulo: 'Test', status: 'EM_ANALISE' } as any);
      expect(result.status).toBe('RECEBIDA');
    });
  });
});
