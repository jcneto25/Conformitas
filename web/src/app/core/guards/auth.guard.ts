import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for the initial profile restore so isAuthenticated/roles are populated.
  await auth.ready;

  if (auth.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export function rolesGuard(allowedRoles: string[]): CanActivateFn {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const snackBar = inject(MatSnackBar);

    // Wait for roles to be loaded from the profile before checking them,
    // otherwise a hard refresh to a role-protected route redirects before
    // the profile fetch resolves.
    await auth.ready;

    if (!auth.isAuthenticated()) {
      router.navigate(['/login']);
      return false;
    }

    if (auth.hasAnyRole(allowedRoles)) {
      return true;
    }

    const rolesLabel = allowedRoles.join(', ');
    snackBar.open(
      `Seu perfil não possui permissão para acessar esta página. Perfis permitidos: ${rolesLabel}.`,
      'OK',
      { duration: 6000, panelClass: ['snack-warn'] },
    );
    router.navigate(['/']);
    return false;
  };
}
