/**
 * Retorna um filtro Prisma WHERE para escopo de unidade.
 *
 * Se o usuário tem `unidadeEscopo` definido (ex: P05, P06),
 * filtra pelo campo `unidadeField` da entidade.
 * Se não tem escopo definido (P01, P10, etc.), retorna {} (sem filtro).
 */
export function buildScopeFilter(
  unidadeEscopo: string | null | undefined,
  unidadeField: string,
): Record<string, any> {
  if (!unidadeEscopo) return {};
  return { [unidadeField]: unidadeEscopo };
}
