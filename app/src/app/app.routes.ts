import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell.page').then((m) => m.ShellPage),
    children: [
      { path: '', redirectTo: 'mes', pathMatch: 'full' },
      { path: 'mes', loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage) },
      { path: 'atividade', loadComponent: () => import('./features/activity/activity.page').then((m) => m.ActivityPage) },
      { path: 'reserva', loadComponent: () => import('./features/emergency-fund/emergency-fund.page').then((m) => m.EmergencyFundPage) },
      { path: 'fechamento', loadComponent: () => import('./features/month-closing/month-closing.page').then((m) => m.MonthClosingPage) },
      { path: 'contas-fixas', loadComponent: () => import('./features/recurring-accounts/recurring-accounts.page').then((m) => m.RecurringAccountsPage) },
      { path: 'perfil', loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage) },
    ],
  },
  { path: 'confirmar-gasto', loadComponent: () => import('./features/transactions/confirm-expense.page').then((m) => m.ConfirmExpensePage) },
  { path: '**', redirectTo: 'mes' },
];
