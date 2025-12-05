import { Routes } from '@angular/router';
import { authGuard } from '../auth/auth.guard';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./testing/testing').then((m) => m.TestingComponent),
  },
];
