import { Routes } from '@angular/router';
import { LayoutsComponent } from './presentation/layouts/layouts.component';
import { PAGES_ROUTES } from './presentation/pages/pages.routing';
import { AUTH_ROUTES } from './presentation/auth/auth.routes';
import { AuthGuard } from './presentation/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
  {
    path: '',
    loadComponent: () =>
      import('./presentation/layouts/layouts.component').then((m) => m.LayoutsComponent),
    canActivate: [AuthGuard],
    children: PAGES_ROUTES,
  },
];
