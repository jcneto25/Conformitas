import { Test, TestingModule } from '@nestjs/testing';
import { ConsultoriasService } from './consultorias.service';
import { SOLICITACAO_CONSULTORIA_REPOSITORY } from './repositories/solicitacao-consultoria.repository';
import { CONSULTORIA_REPOSITORY } from './repositories/consultoria.repository';

describe('ConsultoriasService', () => {
  let service: ConsultoriasService;
  let solicitacaoRepo: any;
  let consultoriaRepo: any;
  const mockSolicitacaoRepo = () => ({
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  });
  const mockConsultoriaRepo = () => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findUnique: jest.fn(),
    findBySolicitacao: jest.fn(),
    update: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultoriasService,
        { provide: SOLICITACAO_CONSULTORIA_REPOSITORY, useValue: mockSolicitacaoRepo() },
        { provide: CONSULTORIA_REPOSITORY, useValue: mockConsultoriaRepo() },
      ],
    }).compile();
    service = module.get<ConsultoriasService>(ConsultoriasService);
    solicitacaoRepo = module.get(SOLICITACAO_CONSULTORIA_REPOSITORY);
    consultoriaRepo = module.get(CONSULTORIA_REPOSITORY);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should criarSolicitacao', async () => {
    solicitacaoRepo.create.mockResolvedValue({ id: '1', status: 'PENDENTE' });
    const r = await service.criarSolicitacao({ tema: 'Teste' });
    expect(r.status).toBe('PENDENTE');
  });
  it('should aceitarSolicitacao', async () => {
    solicitacaoRepo.findUnique.mockResolvedValue({ id: '1', status: 'PENDENTE' });
    solicitacaoRepo.update.mockResolvedValue({ id: '1', status: 'ACEITA' });
    const r = await service.aceitarSolicitacao('1');
    expect(r.status).toBe('ACEITA');
  });
  it('should registrarConsultoria', async () => {
    consultoriaRepo.create.mockResolvedValue({ id: '1', tipo: 'ASSESSORAMENTO' });
    const r = await service.registrarConsultoria({ tipo: 'ASSESSORAMENTO' });
    expect(r.id).toBe('1');
  });
});
