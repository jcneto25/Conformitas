import { AuditoriaStatus, podeTransitar } from './auditoria-status';

describe('AuditoriaStatus', () => {
  describe('podeTransitar', () => {
    it('ABERTA → EM_EXECUCAO deve ser permitido', () => {
      expect(podeTransitar(AuditoriaStatus.ABERTA, AuditoriaStatus.EM_EXECUCAO)).toBe(true);
    });
    it('EM_EXECUCAO → CONCLUIDA deve ser permitido', () => {
      expect(podeTransitar(AuditoriaStatus.EM_EXECUCAO, AuditoriaStatus.CONCLUIDA)).toBe(true);
    });
    it('ABERTA → CONCLUIDA não deve ser permitido (pula EM_EXECUCAO)', () => {
      expect(podeTransitar(AuditoriaStatus.ABERTA, AuditoriaStatus.CONCLUIDA)).toBe(false);
    });
    it('CONCLUIDA → qualquer não deve ser permitido (terminal)', () => {
      expect(podeTransitar(AuditoriaStatus.CONCLUIDA, AuditoriaStatus.ABERTA)).toBe(false);
    });
    it('ABERTA → SUSPENSA deve ser permitido', () => {
      expect(podeTransitar(AuditoriaStatus.ABERTA, AuditoriaStatus.SUSPENSA)).toBe(true);
    });
    it('ABERTA → ABERTA não deve ser permitido (mesmo estado)', () => {
      expect(podeTransitar(AuditoriaStatus.ABERTA, AuditoriaStatus.ABERTA)).toBe(false);
    });
  });
});
