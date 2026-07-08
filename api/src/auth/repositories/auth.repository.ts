export const AUTH_REPOSITORY = 'AUTH_REPOSITORY';
export interface IAuthRepository {
  findUsuario(email: string): Promise<any | null>;
  createLog(data: any): Promise<any>;
  updateUsuario(id: string, data: any): Promise<any>;
  createRefreshToken(data: any): Promise<any>;
  findRefreshToken(tokenHash: string): Promise<any | null>;
  revokeRefreshToken(id: string): Promise<any>;
  revokeUserRefreshTokens(usuarioId: string): Promise<any>;
  createSessaoMfa(data: any): Promise<any>;
  findSessaoMfa(sessionToken: string): Promise<any | null>;
  deleteSessaoMfa(id: string): Promise<any>;
  getConfig(chave: string): Promise<string | null>;
}
