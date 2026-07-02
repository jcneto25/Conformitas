import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
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

    router.navigate(['/']);
    return false;
  };
}
