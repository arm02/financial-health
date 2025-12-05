import { Routes } from '@angular/router';
import { GuestGuard } from './user.guard';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./auth.component').then((m) => m.AuthComponent),
  },
];
