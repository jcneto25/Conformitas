import { Test, TestingModule } from '@nestjs/testing';
import { EticaController } from './etica.controller';
import { EticaService } from './etica.service';

type MockEticaService = {
  [K in keyof EticaService]: jest.Mock;
};

const mockReq = (roles: string[] = ['P01'], sub = 'user-1') => ({
  user: { sub, email: 'test@test.com', roles },
}) as any;

describe('EticaController', () => {
  let controller: EticaController;
  let service: MockEticaService;

  beforeEach(async () => {
    const mockService: MockEticaService = {
      criarDeclaracao: jest.fn(),
      listarDeclaracoes: jest.fn(),
      criarImpedimento: jest.fn(),
      listarImpedimentos: jest.fn(),
      aceitarImpedimento: jest.fn(),
      verificarConflitos: jest.fn(),
      verificarAcessoSigiloso: jest.fn(),
      classificarDocumento: jest.fn(),
      obterClassificacao: jest.fn(),
      listarTrilhaAcesso: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EticaController],
      providers: [{ provide: EticaService, useValue: mockService }],
    }).compile();

    controller = module.get<EticaController>(EticaController);
    service = module.get(EticaService) as MockEticaService;
  });

  describe('POST /declaracoes-independencia', () => {
    it('deve registrar declaração de independência', async () => {
      service.criarDeclaracao.mockResolvedValue({
        id: 'decl-1', usuarioId: 'user-1', vigenciaInicio: '2026-01-01', vigenciaFim: '2027-01-01',
      });

      const result = await controller.criarDeclaracao(mockReq(), {
        ano: 2026,
        declaracao: 'Declaro independência para auditoria X',
      });

      expect(result).toHaveProperty('id');
      expect(service.criarDeclaracao).toHaveBeenCalledWith('user-1', expect.any(Object));
    });
  });

  describe('GET /declaracoes-independencia', () => {
    it('deve listar declarações com filtro por usuário', async () => {
      service.listarDeclaracoes.mockResolvedValue([{ id: 'decl-1' }]);

      const result = await controller.listarDeclaracoes('user-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('POST /impedimentos', () => {
    it('deve registrar impedimento com verificação de conflito', async () => {
      service.criarImpedimento.mockResolvedValue({
        id: 'imp-1', usuarioId: 'user-1', auditoriaId: 'aud-1',
        motivo: 'Parentesco com gestor', status: 'PENDENTE',
      });

      const result = await controller.criarImpedimento(mockReq(), {
        auditoriaId: 'aud-1',
        motivo: 'Parentesco com gestor',
      });

      expect(result).toHaveProperty('status', 'PENDENTE');
    });
  });

  describe('GET /impedimentos', () => {
    it('deve listar impedimentos com filtro por auditoria', async () => {
      service.listarImpedimentos.mockResolvedValue([{ id: 'imp-1', status: 'PENDENTE' }]);

      const result = await controller.listarImpedimentos('aud-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('PATCH /impedimentos/:id/aceitar', () => {
    it('deve aceitar impedimento', async () => {
      service.aceitarImpedimento.mockResolvedValue({
        id: 'imp-1', status: 'ACEITO',
      });

      const result = await controller.aceitarImpedimento('imp-1');
      expect(result).toHaveProperty('status', 'ACEITO');
    });
  });

  describe('GET /verificar-conflitos', () => {
    it('deve verificar conflitos de um usuário por unidade', async () => {
      service.verificarConflitos.mockResolvedValue({
        temConflito: true,
        impedimentos: [{ id: 'imp-1', motivo: 'Parentesco' }],
      });

      const result = await controller.verificarConflitos('user-1', '1ª Vara Cível');
      expect(result).toHaveProperty('temConflito', true);
    });
  });

  describe('PUT /:entidadeTipo/:id/classificacao', () => {
    it('deve classificar documento com nível de sigilo', async () => {
      service.classificarDocumento.mockResolvedValue({
        id: 'class-1', entidadeTipo: 'auditorias', entidadeId: 'aud-1',
        nivelSigilo: 'RESTRITO', justificativa: 'Dados sensíveis',
      });

      const result = await controller.classificarDocumento(
        mockReq(), 'auditorias', 'aud-1',
        { nivelSigilo: 'RESTRITO', justificativa: 'Dados sensíveis' },
      );

      expect(result).toHaveProperty('nivelSigilo', 'RESTRITO');
    });

    it('deve classificar como SIGILOSO', async () => {
      service.classificarDocumento.mockResolvedValue({
        id: 'class-2', entidadeTipo: 'auditorias', entidadeId: 'aud-2',
        nivelSigilo: 'SIGILOSO',
      });

      const result = await controller.classificarDocumento(
        mockReq(), 'auditorias', 'aud-2',
        { nivelSigilo: 'SIGILOSO' },
      );

      expect(result).toHaveProperty('nivelSigilo', 'SIGILOSO');
    });
  });

  describe('GET /:entidadeTipo/:id/classificacao', () => {
    it('deve obter classificação de sigilo de documento', async () => {
      service.obterClassificacao.mockResolvedValue({
        id: 'class-1', entidadeTipo: 'evidencias', entidadeId: 'ev-1',
        nivelSigilo: 'INTERNO',
      });

      const result = await controller.obterClassificacao('evidencias', 'ev-1');
      expect(result).toHaveProperty('nivelSigilo', 'INTERNO');
    });
  });

  describe('GET /trilha-acesso-sigiloso', () => {
    it('deve listar trilha de acesso a documentos sigilosos', async () => {
      service.listarTrilhaAcesso.mockResolvedValue([
        {
          id: 'log-1', usuarioId: 'user-2', entidadeTipo: 'auditorias',
          entidadeId: 'aud-1', acao: 'VISUALIZAR',
          dataAcesso: new Date().toISOString(),
          usuario: { nome: 'Auditor X' },
        },
      ]);

      const result = await controller.listarTrilhaAcesso('auditorias', 'aud-1');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('acao', 'VISUALIZAR');
      expect(result[0]).toHaveProperty('usuario.nome');
    });

    it('deve retornar array vazio quando não há acessos', async () => {
      service.listarTrilhaAcesso.mockResolvedValue([]);

      const result = await controller.listarTrilhaAcesso('auditorias', 'inexistente');
      expect(result).toHaveLength(0);
    });
  });
});
