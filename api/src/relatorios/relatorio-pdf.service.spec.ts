import { Test, TestingModule } from '@nestjs/testing';
import { RelatorioPdfService } from './relatorio-pdf.service';

describe('RelatorioPdfService', () => {
  let service: RelatorioPdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelatorioPdfService],
    }).compile();
    service = module.get<RelatorioPdfService>(RelatorioPdfService);
  });

  describe('buildConteudo', () => {
    it('compila título/subtítulo/corpo a partir do relatório', () => {
      const relatorio = {
        tipo: 'PRELIMINAR',
        conteudo: 'RELATÓRIO PRELIMINAR\n\n- ACH-1: Pagamento sem nota',
        status: 'PRELIMINAR',
        dataEmissao: new Date('2026-06-26'),
        auditoria: { numero: 'AUD-2026-0001', unidadeAuditada: 'SEC_X' },
      };

      const c = service.buildConteudo(relatorio as any);

      expect(c.titulo).toContain('PRELIMINAR');
      expect(c.subtitulo).toContain('AUD-2026-0001');
      expect(c.corpo).toContain('ACH-1');
    });

    it('tolera relatório sem auditoria/conteúdo', () => {
      const c = service.buildConteudo({ tipo: 'FINAL' } as any);
      expect(c.titulo).toContain('FINAL');
      expect(c.corpo).toBe('');
    });
  });

  describe('gerarPdf', () => {
    it('retorna Buffer válido com cabeçalho %PDF', async () => {
      const buf = await service.gerarPdf({
        tipo: 'PRELIMINAR',
        conteudo: 'RELATÓRIO PRELIMINAR\n\n- ACH-1: teste',
        auditoria: { numero: 'AUD-2026-0001' },
      } as any);

      expect(Buffer.isBuffer(buf)).toBe(true);
      expect(buf.slice(0, 5).toString('latin1')).toBe('%PDF-');
      expect(buf.length).toBeGreaterThan(100);
    });
  });
});
