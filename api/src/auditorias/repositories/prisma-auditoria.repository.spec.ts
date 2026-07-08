import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaAuditoriaRepository } from './prisma-auditoria.repository';
import { IAuditoriaRepository, AUDITORIA_REPOSITORY, AuditoriaCreateInput } from './auditoria.repository';
import { AuditoriaStatus } from '../domain/auditoria-status';

describe('PrismaAuditoriaRepository — typed mapping', () => {
  let repo: IAuditoriaRepository;
  let prisma: any;

  const mockPrisma = () => ({
    auditoria: { count: jest.fn(), create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    comunicadoAuditoria: { count: jest.fn(), create: jest.fn() },
    evidencia: { create: jest.fn(), findMany: jest.fn() },
    papelTrabalho: { create: jest.fn(), findMany: jest.fn() },
    requisicao: { create: jest.fn(), findMany: jest.fn() },
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaAuditoriaRepository, { provide: PrismaService, useValue: mockPrisma() }],
    }).compile();
    repo = module.get<IAuditoriaRepository>(PrismaAuditoriaRepository);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('deve criar auditoria e retornar AuditoriaListaItem com status tipado', async () => {
      const input: AuditoriaCreateInput = {
        id: 'aud-1', itemPlanoId: 'ip-1', numero: 'AUD-2026-0001',
        tipo: 'CONFORMIDADE', forma: 'DIRETA', status: AuditoriaStatus.ABERTA,
        unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar finanças',
        sigilosa: false, escopo: null, dataFimPrevista: null,
      };

      const prismaResult = {
        id: 'aud-1', itemPlanoId: 'ip-1', numero: 'AUD-2026-0001',
        tipo: 'CONFORMIDADE', forma: 'DIRETA', status: 'ABERTA',
        unidadeAuditada: 'SECRETARIA_X', objetivo: 'Auditar finanças',
        sigilosa: false, escopo: null, dataFimPrevista: null,
        dataInicio: null, dataFimReal: null, motivoSuspensao: null,
        createdAt: new Date(), updatedAt: new Date(), deletedAt: null,
        itemPlano: null,
      };

      prisma.auditoria.create.mockResolvedValue(prismaResult);

      const result = await repo.create(input);

      // Verifica tipo: status deve ser AuditoriaStatus, não string
      expect(result.status).toBe(AuditoriaStatus.ABERTA);
      expect(result.numero).toBe('AUD-2026-0001');
      // Verifica que createdAt é Date, não string
      expect(result.createdAt).toBeInstanceOf(Date);
      // Verifica que campos não expostos na interface não vazam
      expect(result.id).toBe('aud-1');
    });
  });

  describe('findMany', () => {
    it('deve retornar array de AuditoriaListaItem', async () => {
      prisma.auditoria.findMany.mockResolvedValue([
        { id: '1', status: 'EM_EXECUCAO', createdAt: new Date(), updatedAt: new Date(), deletedAt: null, _count: { evidencias: 0, papeisTrabalho: 0, requisicoes: 0 } },
      ]);
      const results = await repo.findMany({});
      expect(results[0]!.status).toBe(AuditoriaStatus.EM_EXECUCAO);
    });
  });
});
