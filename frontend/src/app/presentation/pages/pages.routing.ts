import { Routes } from '@angular/router';

export const PAGES_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.DashboardComponent),
      },
      {
        path: 'loans',
        loadComponent: () => import('./loans/loans').then((m) => m.LoansComponent),
      },
      {
        path: 'transactions',
        loadComponent: () => import('./transactions/transactions').then((m) => m.TransactionsComponent),
      },
      {
        path: 'expenses',
        loadComponent: () => import('./expenses/expenses').then((m) => m.ExpensesComponent),
      },
      {
        path: 'savings',
        loadComponent: () => import('./savings/savings').then((m) => m.SavingsComponent),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./analytics/analytics').then((m) => m.AnalyticsComponent),
      },
      {
        path: 'todos',
        loadComponent: () => import('./todos/todos').then((m) => m.TodosComponent),
      },
    ],
  },
];
