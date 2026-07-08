export enum AuditoriaStatus {
  ABERTA = 'ABERTA',
  EM_EXECUCAO = 'EM_EXECUCAO',
  CONCLUIDA = 'CONCLUIDA',
  SUSPENSA = 'SUSPENSA',
}

/** Suspensão pode ocorrer de qualquer estado, sem validação de transição. */
const TRANSICOES: Record<AuditoriaStatus, AuditoriaStatus[]> = {
  [AuditoriaStatus.ABERTA]: [AuditoriaStatus.EM_EXECUCAO, AuditoriaStatus.SUSPENSA],
  [AuditoriaStatus.EM_EXECUCAO]: [AuditoriaStatus.CONCLUIDA, AuditoriaStatus.SUSPENSA],
  [AuditoriaStatus.CONCLUIDA]: [AuditoriaStatus.SUSPENSA],
  [AuditoriaStatus.SUSPENSA]: [],
};

export function podeTransitar(de: AuditoriaStatus, para: AuditoriaStatus): boolean {
  return TRANSICOES[de]?.includes(para) ?? false;
}
