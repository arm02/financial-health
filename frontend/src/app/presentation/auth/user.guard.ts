import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export const GuestGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem(environment.storage.authData || 'auth_data');

  if (!token) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
