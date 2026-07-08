import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { AchadosService } from './achados.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ACHADO_REPOSITORY, MANIFESTACAO_REPOSITORY } from './repositories/achado.repository';

const mockRepo = () => ({
  create: jest.fn(),
  findMany: jest.fn(),
  findUnique: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
});
const mockManifRepo = () => ({ create: jest.fn(), findMany: jest.fn() });

describe('AchadosService', () => {
  let service: AchadosService;
  let achadoRepo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchadosService,
        { provide: ACHADO_REPOSITORY, useValue: mockRepo() },
        { provide: MANIFESTACAO_REPOSITORY, useValue: mockManifRepo() },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();
    service = module.get<AchadosService>(AchadosService);
    achadoRepo = module.get(ACHADO_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar achado em auditoria EM_EXECUCAO', async () => {
      achadoRepo.findUnique.mockResolvedValue({ id: 'aud-1', status: 'EM_EXECUCAO' });
      achadoRepo.count.mockResolvedValue(0);
      achadoRepo.create.mockResolvedValue({ id: 'ach-1', codigo: 'ACH-1', status: 'PRELIMINAR' });
      const dto = {
        tipo: 'NEGATIVO',
        situacaoEncontrada: 'Falha',
        criterio: 'CNJ 309',
        causa: 'Falta treinamento',
        efeito: 'Risco',
      };
      const r = await service.create('aud-1', dto as any, 'user-1');
      expect(r.codigo).toBe('ACH-1');
    });
  });

  describe('enviarManifestacao', () => {
    it('deve enviar e emitir evento', async () => {
      achadoRepo.findUnique.mockResolvedValue({
        id: 'ach-1',
        codigo: 'ACH-1',
        auditoriaId: 'aud-1',
        status: 'PRELIMINAR',
        tipo: 'NEGATIVO',
        situacaoEncontrada: 'X',
        criterio: 'Y',
        causa: 'Z',
        efeito: 'W',
        evidenciaIds: [],
        autorId: 'u1',
        dataLimiteManifestacao: null,
        ressalva: null,
        auditoria: { id: 'aud-1', unidadeAuditada: 'SEC' },
      });
      achadoRepo.update.mockResolvedValue({ id: 'ach-1', status: 'EM_MANIFESTACAO' });
      const r = await service.enviarManifestacao('ach-1');
      expect(r.status).toBe('EM_MANIFESTACAO');
    });
  });

  describe('consolidarExpirados', () => {
    it('deve consolidar expirados', async () => {
      achadoRepo.findMany.mockResolvedValue([
        {
          id: 'ach-1',
          auditoriaId: 'aud-1',
          codigo: 'ACH-1',
          status: 'EM_MANIFESTACAO',
          tipo: 'N',
          situacaoEncontrada: 'X',
          criterio: 'Y',
          causa: 'Z',
          efeito: 'W',
          evidenciaIds: [],
          autorId: 'u1',
          dataLimiteManifestacao: null,
          ressalva: null,
        },
      ]);
      achadoRepo.update.mockResolvedValue({});
      const r = await service.consolidarExpirados();
      expect(r.consolidados).toBe(1);
    });
  });
});
