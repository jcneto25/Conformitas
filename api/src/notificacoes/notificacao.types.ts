export interface CriarNotificacaoParams {
  usuarioId: string;
  tipo: string;
  mensagem: string;
  auditoriaId?: string;
}

export interface NotificarPerfilParams {
  codigoPerfil: string;
  tipo: string;
  mensagem: string;
  auditoriaId?: string;
}

export interface NotificarUnidadeParams {
  unidade: string | null;
  tipo: string;
  mensagem: string;
  auditoriaId?: string;
}
