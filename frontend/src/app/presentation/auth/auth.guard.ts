import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  if (!!localStorage.getItem(environment.storage.authData || 'auth_data')) {
    return true;
  }

  router.navigate(['/auth/login'], {
    queryParams: { redirect: state.url },
  });

  return false;
};
