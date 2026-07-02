import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogData } from '../../shared/components/confirm-dialog.component';

/**
 * Componentes que expõem `canDeactivate()` participam do guard de alterações não salvas.
 * - Retorno `true`  → formulário limpo, pode sair.
 * - Retorno `false` → há alterações não salvas; o guard abre um diálogo de confirmação.
 */
export interface CanFormDeactivate {
  canDeactivate(): boolean;
}

/**
 * Guard funcional reutilizável (Epic D4). Usa o ConfirmDialogComponent existente.
 * Componentes sem `canDeactivate()` são ignorados (no-op) — seguro para aplicar em
 * qualquer rota de formulário e ligar incrementalmente.
 */
export const confirmDeactivate: CanDeactivateFn<unknown> = (component) => {
  const form = component as Partial<CanFormDeactivate> | undefined;
  if (!form?.canDeactivate) return true;
  if (form.canDeactivate()) return true;

  const dialog = inject(MatDialog);
  const ref = dialog.open(ConfirmDialogComponent, {
    data: {
      title: 'Sair sem salvar?',
      message: 'Você tem alterações não salvas. Deseja descartá-las e sair?',
      confirmText: 'Descartar e sair',
      cancelText: 'Continuar editando',
      type: 'warning',
    } as ConfirmDialogData,
  });
  return ref.afterClosed();
};
