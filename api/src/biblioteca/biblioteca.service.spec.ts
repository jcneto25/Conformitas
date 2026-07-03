import { Test, TestingModule } from '@nestjs/testing';
import { BibliotecaService } from './biblioteca.service';
import { PrismaService } from '../prisma/prisma.service';

describe('BibliotecaService', () => {
  let service: BibliotecaService;
  let prisma: any;

  const mockPrisma = () => ({
    documentoMetodologico: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BibliotecaService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();
    service = module.get<BibliotecaService>(BibliotecaService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a documento', async () => {
      const dto = {
        titulo: 'Manual de Auditoria', tipo: 'MANUAL',
        arquivoPath: '/docs/manual.pdf', status: 'ATIVO',
      };
      prisma.documentoMetodologico.create.mockResolvedValue({ id: '1', ...dto, versao: '1.0' });
      const result = await service.create(dto as any);
      expect(prisma.documentoMetodologico.create).toHaveBeenCalled();
      expect(result.id).toBe('1');
    });
  });

  describe('findAll', () => {
    it('should return all documentos', async () => {
      prisma.documentoMetodologico.findMany.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });

    it('should search by titulo', async () => {
      await service.findAll({ search: 'Auditoria' });
      expect(prisma.documentoMetodologico.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should return by id', async () => {
      prisma.documentoMetodologico.findUnique.mockResolvedValue({ id: '1', titulo: 'Doc' });
      const result = await service.findOne('1');
      expect(result.titulo).toBe('Doc');
    });

    it('should throw if not found', async () => {
      prisma.documentoMetodologico.findUnique.mockResolvedValue(null);
      await expect(service.findOne('x')).rejects.toThrow('Documento não encontrado');
    });
  });

  describe('upload with versionamento (RF-012.4)', () => {
    it('should create first version as 1.0', async () => {
      prisma.documentoMetodologico.findMany.mockResolvedValue([]);
      prisma.documentoMetodologico.create.mockResolvedValue({
        id: '1', titulo: 'Manual', tipo: 'MANUAL', versao: '1.0', arquivoPath: '/docs/v1.pdf', status: 'ATIVO',
      });
      const result = await service.upload('Manual', 'MANUAL', '/docs/v1.pdf');
      expect(result.versao).toBe('1.0');
    });

    it('should increment version for existing document (RF-012.4)', async () => {
      prisma.documentoMetodologico.findMany.mockResolvedValue([
        { titulo: 'Manual', versao: '1.0' },
      ]);
      prisma.documentoMetodologico.create.mockResolvedValue({
        id: '2', titulo: 'Manual', tipo: 'MANUAL', versao: '1.1', arquivoPath: '/docs/v2.pdf', status: 'ATIVO',
      });
      const result = await service.upload('Manual', 'MANUAL', '/docs/v2.pdf');
      expect(result.versao).toBe('1.1');
    });

    it('should increment minor version correctly', () => {
      const result = (service as any).incrementarVersao('2.5');
      expect(result).toBe('2.6');
    });
  });

  describe('remove', () => {
    it('should set status to ARQUIVADO', async () => {
      prisma.documentoMetodologico.findUnique.mockResolvedValue({ id: '1', status: 'ATIVO' });
      prisma.documentoMetodologico.update.mockResolvedValue({ id: '1', status: 'ARQUIVADO' });
      const result = await service.remove('1');
      expect(prisma.documentoMetodologico.update).toHaveBeenCalledWith(
        { where: { id: '1' }, data: { status: 'ARQUIVADO' } }
      );
      expect(result.status).toBe('ARQUIVADO');
    });
  });
});
