/**
 * Cálculo de prazos em dias úteis.
 *
 * Um "dia útil" exclui sábados (6) e domingos (0). Feriados bancários/pontuais
 * NÃO são modelados — não há fonte de calendário de feriados no sistema. Caso
 * seja necessário, injete uma fonte de feriados em `ehDiaUtil()`.
 *
 * Usado, p.ex., no prazo de manifestação de achados (RF-006.5: 5 dias úteis).
 */

/** Retorna true quando `data` cai em seg–sex. */
export function ehDiaUtil(data: Date): boolean {
  const dia = data.getDay(); // 0 = domingo, 6 = sábado
  return dia !== 0 && dia !== 6;
}

/**
 * Soma `dias` dias úteis a `data`, ignorando fins de semana.
 * Não muta a data original.
 */
export function adicionarDiasUteis(data: Date, dias: number): Date {
  const resultado = new Date(data.getTime());
  let adicionados = 0;
  while (adicionados < dias) {
    resultado.setDate(resultado.getDate() + 1);
    if (ehDiaUtil(resultado)) {
      adicionados += 1;
    }
  }
  return resultado;
}
