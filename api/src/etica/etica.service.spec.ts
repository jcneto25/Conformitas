import { Test, TestingModule } from '@nestjs/testing';
import { EticaService } from './etica.service';
import { PrismaService } from '../prisma/prisma.service';

const mockPrisma = () => ({
  declaracaoIndependencia: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  impedimento: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  classificacaoDocumento: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  logAcessoSigiloso: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  usuarioPerfil: {
    findMany: jest.fn(),
  },
});

describe('EticaService', () => {
  let service: EticaService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EticaService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<EticaService>(EticaService);
    prisma = module.get(PrismaService) as any;
  });

  describe('Declarações', () => {
    it('deve criar declaração de independência', async () => {
      prisma.declaracaoIndependencia.create.mockResolvedValue({ id: 'dec-id' });
      const result = await service.criarDeclaracao('user-id', { ano: 2026 });
      expect(result).toHaveProperty('id');
      expect(prisma.declaracaoIndependencia.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ usuarioId: 'user-id', ano: 2026 }),
        }),
      );
    });
  });

  describe('Impedimentos', () => {
    it('deve criar impedimento com status PENDENTE', async () => {
      prisma.impedimento.create.mockResolvedValue({ id: 'imp-id' });
      const result = await service.criarImpedimento('user-id', {
        auditoriaId: 'aud-id',
        motivo: 'Atuei na unidade',
      });
      expect(result).toHaveProperty('id');
    });

    it('deve aceitar impedimento', async () => {
      prisma.impedimento.findUnique.mockResolvedValue({ id: 'imp-id' });
      prisma.impedimento.update.mockResolvedValue({ id: 'imp-id', status: 'ACEITO' });
      const result = await service.aceitarImpedimento('imp-id');
      expect(result.status).toBe('ACEITO');
    });
  });

  describe('Classificação', () => {
    it('deve classificar documento como SIGILOSO', async () => {
      prisma.classificacaoDocumento.findFirst.mockResolvedValue(null);
      prisma.classificacaoDocumento.create.mockResolvedValue({ id: 'class-id' });
      const result = await service.classificarDocumento('evidencia', 'ent-id', 'user-id', {
        nivelSigilo: 'SIGILOSO',
        justificativa: 'Dados sensíveis',
      });
      expect(result).toHaveProperty('id');
    });
  });

  describe('Verificação de conflitos', () => {
    it('deve detectar declaração pendente', async () => {
      prisma.impedimento.findMany.mockResolvedValue([]);
      prisma.declaracaoIndependencia.findMany.mockResolvedValue([]);
      const result = await service.verificarConflitos('user-id', 'UNIDADE_X');
      expect(result.temConflito).toBe(true);
      expect(result.declaracaoPendente).toBe(true);
    });
  });

  describe('Acesso sigiloso', () => {
    it('P01 deve ter acesso a documento SIGILOSO', async () => {
      prisma.classificacaoDocumento.findFirst.mockResolvedValue({
        nivelSigilo: 'SIGILOSO',
      });
      prisma.logAcessoSigiloso.create.mockResolvedValue({});
      prisma.usuarioPerfil.findMany.mockResolvedValue([{ perfil: { codigo: 'P01' } }]);
      const result = await service.verificarAcessoSigiloso('user-id', 'evidencia', 'ent-id');
      expect(result).toBe(true);
    });

    it('P05 deve ser barrado em documento SIGILOSO', async () => {
      prisma.classificacaoDocumento.findFirst.mockResolvedValue({
        nivelSigilo: 'SIGILOSO',
      });
      prisma.logAcessoSigiloso.create.mockResolvedValue({});
      prisma.usuarioPerfil.findMany.mockResolvedValue([{ perfil: { codigo: 'P05' } }]);
      const result = await service.verificarAcessoSigiloso('user-id', 'evidencia', 'ent-id');
      expect(result).toBe(false);
    });
  });
});
