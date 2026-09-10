import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

/** Blocks the app shell until there's an authenticated session. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.status() === 'authed') return true;
  return router.createUrlTree(['/login']);
};

/** The API's SpaceGuard 403s every space-scoped route until the user has a space. */
export const spaceGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.status() !== 'authed') return router.createUrlTree(['/login']);
  if (!auth.hasSpace()) return router.createUrlTree(['/onboarding']);
  return true;
};

/** Keeps an already-signed-in user out of the login/register screens. */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  if (auth.status() !== 'authed') return true;
  return router.createUrlTree([auth.hasSpace() ? '/mes' : '/onboarding']);
};
