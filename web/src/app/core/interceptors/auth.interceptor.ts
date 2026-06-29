import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { catchError, switchMap, throwError, from } from 'rxjs';

const SKIP_AUTH_PATHS = ['/auth/login', '/auth/mfa/verify', '/auth/refresh'];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const auth = inject(AuthService);
  const token = localStorage.getItem('access_token');

  let authReq = req;
  if (token && !SKIP_AUTH_PATHS.some((p) => req.url.includes(p))) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !SKIP_AUTH_PATHS.some((p) => req.url.includes(p))) {
        return from(auth.tryRefresh()).pipe(
          switchMap((refreshed) => {
            if (!refreshed) {
              auth.logout();
              return throwError(() => error);
            }
            const newToken = localStorage.getItem('access_token');
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retryReq);
          }),
        );
      }

      if (error.status === 403) {
        const msg = error.error?.message || 'Acesso negado — você não tem permissão para acessar este recurso';
        toast.show(msg, 'error');
      } else if (error.status === 0 || error.status >= 500) {
        toast.show(
          `Erro de conexão com o servidor (${error.status || 'offline'}). Tente novamente.`,
          'error',
        );
      }
      return throwError(() => error);
    }),
  );
};
