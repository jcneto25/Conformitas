import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  const token = localStorage.getItem('access_token');
  if (token) {
    auth.loadProfile();
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export function rolesGuard(allowedRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

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
