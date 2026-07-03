import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GovernancaService } from './governanca.service';
import { PrismaService } from '../prisma/prisma.service';
import { OrgaoDeterminacao } from './dto/create-determinacao.dto';
import { ClassificacaoFraude } from './dto/create-registro-fraude.dto';
import { TipoComunicacao } from './dto/comunicar-fraude.dto';

const mockPrisma = () => ({
  determinacaoExterna: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  registroFraude: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

describe('GovernancaService', () => {
  let service: GovernancaService;
  let prisma: ReturnType<typeof mockPrisma>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GovernancaService, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();

    service = module.get<GovernancaService>(GovernancaService);
    prisma = module.get(PrismaService) as any;
  });

  // ── Determinações Externas ────────────────────

  describe('createDeterminacao', () => {
    it('deve criar determinação com status PENDENTE', async () => {
      prisma.determinacaoExterna.create.mockResolvedValue({
        id: 'det-1',
        orgao: 'TCE',
        numero: '123/2026',
        descricao: 'Determinação X',
        status: 'PENDENTE',
      });

      const result = await service.createDeterminacao({
        orgao: OrgaoDeterminacao.TCE,
        numero: '123/2026',
        descricao: 'Determinação X',
      });

      expect(result).toHaveProperty('status', 'PENDENTE');
      expect(result).toHaveProperty('orgao', 'TCE');
    });
  });

  describe('listarDeterminacoes', () => {
    it('deve listar sem filtro', async () => {
      prisma.determinacaoExterna.findMany.mockResolvedValue([{ id: '1' }]);
      const result = await service.listarDeterminacoes();
      expect(result).toHaveLength(1);
    });

    it('deve filtrar por orgao', async () => {
      prisma.determinacaoExterna.findMany.mockResolvedValue([]);
      await service.listarDeterminacoes({ orgao: 'CNJ' });
      expect(prisma.determinacaoExterna.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { orgao: 'CNJ' } }),
      );
    });
  });

  describe('buscarDeterminacao', () => {
    it('deve retornar por ID', async () => {
      prisma.determinacaoExterna.findUnique.mockResolvedValue({ id: 'det-1' });
      const result = await service.buscarDeterminacao('det-1');
      expect(result).toHaveProperty('id', 'det-1');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      prisma.determinacaoExterna.findUnique.mockResolvedValue(null);
      await expect(service.buscarDeterminacao('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('atualizarDeterminacao', () => {
    it('deve atualizar determinação existente', async () => {
      prisma.determinacaoExterna.findUnique.mockResolvedValue({ id: 'det-1' });
      prisma.determinacaoExterna.update.mockResolvedValue({ id: 'det-1', descricao: 'Nova' });

      const result = await service.atualizarDeterminacao('det-1', { descricao: 'Nova' });
      expect(result).toHaveProperty('descricao', 'Nova');
    });
  });

  describe('concluirDeterminacao', () => {
    it('deve transitar PENDENTE → CONCLUIDA', async () => {
      prisma.determinacaoExterna.findUnique.mockResolvedValue({ id: 'det-1', status: 'PENDENTE' });
      prisma.determinacaoExterna.update.mockResolvedValue({ id: 'det-1', status: 'CONCLUIDA' });

      const result = await service.concluirDeterminacao('det-1');
      expect(result).toHaveProperty('status', 'CONCLUIDA');
    });

    it('deve rejeitar se não estiver PENDENTE', async () => {
      prisma.determinacaoExterna.findUnique.mockResolvedValue({ id: 'det-1', status: 'CONCLUIDA' });
      await expect(service.concluirDeterminacao('det-1')).rejects.toThrow(BadRequestException);
    });
  });

  // ── Registros de Fraude ────────────────────────

  describe('createRegistroFraude', () => {
    it('deve criar registro SUSPEITA', async () => {
      prisma.registroFraude.create.mockResolvedValue({
        id: 'fraude-1',
        descricao: 'Indício de fraude',
        classificacao: 'SUSPEITA',
      });

      const result = await service.createRegistroFraude({
        descricao: 'Indício de fraude',
        classificacao: ClassificacaoFraude.SUSPEITA,
      });

      expect(result).toHaveProperty('classificacao', 'SUSPEITA');
    });
  });

  describe('listarRegistrosFraude', () => {
    it('deve listar com filtro de classificacao', async () => {
      prisma.registroFraude.findMany.mockResolvedValue([]);
      await service.listarRegistrosFraude({ classificacao: 'CONFIRMADA' });
      expect(prisma.registroFraude.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { classificacao: 'CONFIRMADA' } }),
      );
    });
  });

  describe('buscarRegistroFraude', () => {
    it('deve retornar por ID', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue({ id: 'f-1' });
      const result = await service.buscarRegistroFraude('f-1');
      expect(result).toHaveProperty('id', 'f-1');
    });

    it('deve lançar NotFoundException', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue(null);
      await expect(service.buscarRegistroFraude('x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('comunicar', () => {
    it('deve comunicar ao SUPERIOR', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoSuperior: null,
        dataComunicacaoTce: null,
      });
      prisma.registroFraude.update.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoSuperior: new Date(),
      });

      const result = await service.comunicar('f-1', { tipo: TipoComunicacao.SUPERIOR });
      expect(result).toHaveProperty('dataComunicacaoSuperior');
    });

    it('deve comunicar ao TCE após superior', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoSuperior: new Date('2026-01-01'),
        dataComunicacaoTce: null,
      });
      prisma.registroFraude.update.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoTce: new Date(),
      });

      const result = await service.comunicar('f-1', { tipo: TipoComunicacao.TCE });
      expect(result).toHaveProperty('dataComunicacaoTce');
    });

    it('deve rejeitar comunicação ao TCE sem SUPERIOR', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoSuperior: null,
        dataComunicacaoTce: null,
      });

      await expect(
        service.comunicar('f-1', { tipo: TipoComunicacao.TCE }),
      ).rejects.toThrow(BadRequestException);
    });

    it('deve rejeitar comunicação duplicada ao SUPERIOR', async () => {
      prisma.registroFraude.findUnique.mockResolvedValue({
        id: 'f-1',
        dataComunicacaoSuperior: new Date(),
        dataComunicacaoTce: null,
      });

      await expect(
        service.comunicar('f-1', { tipo: TipoComunicacao.SUPERIOR }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('verificarFraudes60Dias', () => {
    it('deve retornar registros com 60+ dias sem TCE', async () => {
      const mockRegistros = [{ id: 'f-1', descricao: 'Teste', dataComunicacaoSuperior: new Date('2026-01-01') }];
      prisma.registroFraude.findMany.mockResolvedValue(mockRegistros);

      const result = await service.verificarFraudes60Dias();
      expect(result.pendentes).toBe(1);
      expect(result.registros[0]).toHaveProperty('id', 'f-1');
    });
  });
});
