import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ConsultoriasService } from './consultorias.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  solicitacaoConsultoria: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  consultoria: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  planoAuditoria: {
    findUnique: jest.fn(),
  },
  forcaTrabalho: {
    findMany: jest.fn(),
  },
});

describe('ConsultoriasService', () => {
  let service: ConsultoriasService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsultoriasService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<ConsultoriasService>(ConsultoriasService);
    prisma = module.get(PrismaService) as any;
  });

  // ── Solicitacoes ──────────────────────────────

  describe('criarSolicitacao', () => {
    it('deve criar solicitação com status PENDENTE', async () => {
      prisma.solicitacaoConsultoria.create.mockResolvedValue({
        id: 'solic-1',
        unidadeSolicitante: '1ª Vara',
        tema: 'Auditoria Financeira',
        duvida: 'Como proceder?',
        status: 'PENDENTE',
        solicitanteId: 'user-1',
      });

      const result = await service.criarSolicitacao({
        unidadeSolicitante: '1ª Vara',
        tema: 'Auditoria Financeira',
        duvida: 'Como proceder?',
        solicitanteId: 'user-1',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('status', 'PENDENTE');
    });
  });

  describe('listarSolicitacoes', () => {
    it('deve listar solicitações com filtro opcional de status', async () => {
      prisma.solicitacaoConsultoria.findMany.mockResolvedValue([
        { id: '1', tema: 'Tema 1', status: 'PENDENTE' },
      ]);

      const result = await service.listarSolicitacoes('PENDENTE');
      expect(result).toHaveLength(1);
      expect(prisma.solicitacaoConsultoria.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: 'PENDENTE' },
        }),
      );
    });
  });

  // ── Consultorias ──────────────────────────────

  describe('aceitarSolicitacao', () => {
    it('deve aceitar solicitação e mudar status para ACEITA', async () => {
      prisma.solicitacaoConsultoria.findUnique.mockResolvedValue({
        id: 'solic-1',
        status: 'PENDENTE',
      });
      prisma.solicitacaoConsultoria.update.mockResolvedValue({
        id: 'solic-1',
        status: 'ACEITA',
      });

      const result = await service.aceitarSolicitacao('solic-1');
      expect(result).toHaveProperty('status', 'ACEITA');
    });

    it('deve rejeitar aceitação se solicitação não estiver PENDENTE', async () => {
      prisma.solicitacaoConsultoria.findUnique.mockResolvedValue({
        id: 'solic-1',
        status: 'CONCLUIDA',
      });

      await expect(
        service.aceitarSolicitacao('solic-1'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('registrarConsultoria', () => {
    it('deve registrar consultoria com termo de cogestão', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'plano-1',
        tipo: 'PAA',
        status: 'APROVADO',
      });
      prisma.forcaTrabalho.findMany.mockResolvedValue([
        { horasDisponiveisAno: 2000, usuarioId: 'user-2' },
      ]);
      prisma.consultoria.findMany.mockResolvedValue([]);
      prisma.consultoria.create.mockResolvedValue({
        id: 'cons-1',
        tipo: 'ASSESSORAMENTO',
        escopo: 'Apoio técnico',
        horasUtilizadas: 40,
        planoId: 'plano-1',
        equipeIds: ['user-2'],
      });

      const result = await service.registrarConsultoria({
        tipo: 'ASSESSORAMENTO',
        escopo: 'Apoio técnico',
        horasUtilizadas: 40,
        planoId: 'plano-1',
        equipeIds: ['user-2'],
        solicitacaoId: 'solic-1',
      });

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('horasUtilizadas', 40);
    });

    it('deve validar horas PAA — rejeitar se horas alocadas excederem disponíveis', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'plano-1',
        tipo: 'PAA',
        status: 'APROVADO',
      });
      prisma.forcaTrabalho.findMany.mockResolvedValue([
        { horasDisponiveisAno: 2000, usuarioId: 'user-1' },
      ]);
      // Simula 1990h já alocadas → só restam 10h
      prisma.consultoria.findMany.mockResolvedValue(
        Array(19).fill({ horasUtilizadas: 100 }).concat([{ horasUtilizadas: 90 }]),
      );

      await expect(
        service.registrarConsultoria({
          tipo: 'ASSESSORAMENTO',
          horasUtilizadas: 100,
          planoId: 'plano-1',
          equipeIds: ['user-1'],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve registrar termo de cogestão', async () => {
      prisma.planoAuditoria.findUnique.mockResolvedValue({
        id: 'plano-1',
        tipo: 'PAA',
        status: 'APROVADO',
      });
      prisma.forcaTrabalho.findMany.mockResolvedValue([
        { horasDisponiveisAno: 2000, usuarioId: 'user-1' },
      ]);
      prisma.consultoria.findMany.mockResolvedValue([]);
      prisma.consultoria.create.mockResolvedValue({
        id: 'cons-2',
        tipo: 'COGESTAO',
        escopo: 'Gestão compartilhada',
        horasUtilizadas: 0,
        resultado: 'Termo de cogestão firmado',
      });

      const result = await service.registrarConsultoria({
        tipo: 'COGESTAO',
        escopo: 'Gestão compartilhada',
        planoId: 'plano-1',
        equipeIds: ['user-1'],
        resultado: 'Termo de cogestão firmado',
      });

      expect(result).toHaveProperty('tipo', 'COGESTAO');
    });
  });

  describe('listarConsultorias', () => {
    it('deve listar consultorias com filtro opcional', async () => {
      prisma.consultoria.findMany.mockResolvedValue([
        { id: '1', tipo: 'ASSESSORAMENTO' },
      ]);

      const result = await service.listarConsultorias('ASSESSORAMENTO');
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar consultoria por ID', async () => {
      prisma.consultoria.findUnique.mockResolvedValue({
        id: '1',
        tipo: 'ASSESSORAMENTO',
      });

      const result = await service.findOne('1');
      expect(result).toHaveProperty('tipo');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      prisma.consultoria.findUnique.mockResolvedValue(null);

      await expect(service.findOne('inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
