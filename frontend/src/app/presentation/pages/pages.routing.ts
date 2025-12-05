import { Routes } from '@angular/router';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./testing/testing').then((m) => m.TestingComponent),
  },
];
