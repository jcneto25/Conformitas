export enum AchadoStatus {
  PRELIMINAR = 'PRELIMINAR',
  EM_MANIFESTACAO = 'EM_MANIFESTACAO',
  CONSOLIDADO = 'CONSOLIDADO',
}

const TRANSICOES: Record<AchadoStatus, AchadoStatus[]> = {
  [AchadoStatus.PRELIMINAR]: [AchadoStatus.EM_MANIFESTACAO],
  [AchadoStatus.EM_MANIFESTACAO]: [AchadoStatus.CONSOLIDADO],
  [AchadoStatus.CONSOLIDADO]: [],
};

export function podeTransitar(de: AchadoStatus, para: AchadoStatus): boolean {
  return TRANSICOES[de]?.includes(para) ?? false;
}
