import { AuditoriaStatus, podeTransitar } from './auditoria-status';
import { TransicaoStatusInvalidaError } from './errors/transicao-status-invalida.error';

export class Auditoria {
  constructor(
    public readonly id: string,
    public readonly numero: string,
    public status: AuditoriaStatus,
    public readonly unidadeAuditada: string,
    public readonly objetivo: string,
    public readonly itemPlanoId: string,
    public readonly tipo: string,
    public readonly forma: string,
    public readonly sigilosa: boolean,
    public readonly escopo: string | null,
    public readonly dataFimPrevista: Date | null,
    public dataInicio: Date | null,
    public dataFimReal: Date | null,
    public motivoSuspensao: string | null,
  ) {}

  static criar(props: {
    id: string;
    numero: string;
    unidadeAuditada: string;
    objetivo: string;
    itemPlanoId: string;
    tipo: string;
    forma: string;
    sigilosa: boolean;
    escopo: string | null;
    dataFimPrevista: Date | null;
  }): Auditoria {
    return new Auditoria(
      props.id,
      props.numero,
      AuditoriaStatus.ABERTA,
      props.unidadeAuditada,
      props.objetivo,
      props.itemPlanoId,
      props.tipo,
      props.forma,
      props.sigilosa,
      props.escopo,
      props.dataFimPrevista,
      null,
      null,
      null,
    );
  }

  iniciarExecucao(): void {
    this.transitar(AuditoriaStatus.EM_EXECUCAO);
    this.dataInicio = new Date();
  }

  concluir(): void {
    this.transitar(AuditoriaStatus.CONCLUIDA);
    this.dataFimReal = new Date();
  }

  suspender(motivo: string): void {
    this.transitar(AuditoriaStatus.SUSPENSA);
    this.motivoSuspensao = motivo;
  }

  private transitar(destino: AuditoriaStatus): void {
    if (!podeTransitar(this.status, destino)) {
      throw new TransicaoStatusInvalidaError(this.status, destino);
    }
    this.status = destino;
  }
}
