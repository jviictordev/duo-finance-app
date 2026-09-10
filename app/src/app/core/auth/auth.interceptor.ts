import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthStore } from './auth.store';

/**
 * login/register/refresh run without a bearer and must not trigger the 401→refresh loop.
 * logout is NOT here on purpose: the API requires a valid access token to revoke the
 * refresh-token family, so it goes through the normal (authed) path.
 */
function isAuthEndpoint(url: string): boolean {
  return /\/auth\/(login|register|refresh)$/.test(url);
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (!req.url.startsWith(environment.apiBaseUrl) || isAuthEndpoint(req.url)) {
    return next(req);
  }

  const token = auth.accessToken();
  const authed = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authed).pipe(
    catchError((err: unknown) => {
      if (!(err instanceof HttpErrorResponse) || err.status !== 401 || !auth.refreshToken()) {
        return throwError(() => err);
      }

      return auth.refreshAccess().pipe(
        switchMap((fresh) => next(req.clone({ setHeaders: { Authorization: `Bearer ${fresh}` } }))),
        catchError((refreshErr: unknown) => {
          auth.clear();
          void router.navigate(['/login']);
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};
