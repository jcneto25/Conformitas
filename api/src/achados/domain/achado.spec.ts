import { AchadoStatus, podeTransitar } from './achado-status';

describe('AchadoStatus', () => {
  describe('podeTransitar', () => {
    it('PRELIMINAR → EM_MANIFESTACAO', () => {
      expect(podeTransitar(AchadoStatus.PRELIMINAR, AchadoStatus.EM_MANIFESTACAO)).toBe(true);
    });
    it('EM_MANIFESTACAO → CONSOLIDADO', () => {
      expect(podeTransitar(AchadoStatus.EM_MANIFESTACAO, AchadoStatus.CONSOLIDADO)).toBe(true);
    });
    it('PRELIMINAR → CONSOLIDADO não deve ser permitido', () => {
      expect(podeTransitar(AchadoStatus.PRELIMINAR, AchadoStatus.CONSOLIDADO)).toBe(false);
    });
    it('CONSOLIDADO → qualquer não deve ser permitido', () => {
      expect(podeTransitar(AchadoStatus.CONSOLIDADO, AchadoStatus.PRELIMINAR)).toBe(false);
    });
  });
});
