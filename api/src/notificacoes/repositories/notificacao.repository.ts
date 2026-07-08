export const NOTIFICACAO_REPOSITORY = 'NOTIFICACAO_REPOSITORY';

export interface NotificacaoReadModel {
  id: string; usuarioId: string; tipo: string; mensagem: string;
  auditoriaId: string | null; lida: boolean;
  createdAt: Date; updatedAt: Date;
}

export interface INotificacaoRepository {
  create(data: any): Promise<NotificacaoReadModel>;
  findMany(where: any): Promise<NotificacaoReadModel[]>;
  updateMany(where: any, data: any): Promise<any>;
  createMany(data: any[]): Promise<any>;
  findPerfisWithUsuario(where: any): Promise<any[]>;
}
