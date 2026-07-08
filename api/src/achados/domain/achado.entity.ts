import { AchadoStatus, podeTransitar } from './achado-status';
import { adicionarDiasUteis } from '../../common/utils/dias-uteis';

export class Achado {
  constructor(
    public readonly id: string,
    public readonly auditoriaId: string,
    public readonly codigo: string,
    public status: AchadoStatus,
    public readonly tipo: string,
    public readonly situacaoEncontrada: string,
    public readonly criterio: string,
    public readonly causa: string,
    public readonly efeito: string,
    public readonly evidenciaIds: string[],
    public readonly autorId: string,
    public dataLimiteManifestacao: Date | null,
    public ressalva: string | null,
  ) {}

  static criar(props: {
    id: string;
    auditoriaId: string;
    codigo: string;
    tipo: string;
    situacaoEncontrada: string;
    criterio: string;
    causa: string;
    efeito: string;
    evidenciaIds: string[];
    autorId: string;
  }): Achado {
    return new Achado(
      props.id,
      props.auditoriaId,
      props.codigo,
      AchadoStatus.PRELIMINAR,
      props.tipo,
      props.situacaoEncontrada,
      props.criterio,
      props.causa,
      props.efeito,
      props.evidenciaIds,
      props.autorId,
      null,
      null,
    );
  }

  enviarManifestacao(prazoDiasUteis: number = 5): void {
    if (this.status !== AchadoStatus.PRELIMINAR) {
      throw new Error(`Apenas achados PRELIMINAR podem ser enviados para manifestação (atual: ${this.status})`);
    }
    this.status = AchadoStatus.EM_MANIFESTACAO;
    this.dataLimiteManifestacao = adicionarDiasUteis(new Date(), prazoDiasUteis);
  }

  consolidar(ressalva?: string): void {
    if (this.status !== AchadoStatus.EM_MANIFESTACAO) {
      throw new Error(`Apenas achados EM_MANIFESTACAO podem ser consolidados (atual: ${this.status})`);
    }
    this.status = AchadoStatus.CONSOLIDADO;
    this.ressalva = ressalva ?? null;
  }
}
