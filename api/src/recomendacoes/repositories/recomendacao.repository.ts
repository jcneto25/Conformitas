export const RECOMENDACAO_REPOSITORY = 'RECOMENDACAO_REPOSITORY';
export const PROVIDENCIA_REPOSITORY = 'PROVIDENCIA_REPOSITORY';
export interface IRecomendacaoRepository { create(data: any): Promise<any>; findMany(where: any): Promise<any[]>; findUnique(id: string, include?: any): Promise<any | null>; update(id: string, data: any): Promise<any>; }
export interface IProvidenciaRepository { create(data: any): Promise<any>; findMany(where: any): Promise<any[]>; }
