import { Routes } from '@angular/router';
import { authGuard, guestGuard, spaceGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/onboarding.page').then((m) => m.OnboardingPage),
  },
  {
    path: '',
    canActivate: [authGuard, spaceGuard],
    loadComponent: () => import('./layout/shell.page').then((m) => m.ShellPage),
    children: [
      { path: '', redirectTo: 'mes', pathMatch: 'full' },
      { path: 'mes', loadComponent: () => import('./features/dashboard/dashboard.page').then((m) => m.DashboardPage) },
      { path: 'atividade', loadComponent: () => import('./features/activity/activity.page').then((m) => m.ActivityPage) },
      { path: 'reserva', loadComponent: () => import('./features/emergency-fund/emergency-fund.page').then((m) => m.EmergencyFundPage) },
      { path: 'fechamento', loadComponent: () => import('./features/month-closing/month-closing.page').then((m) => m.MonthClosingPage) },
      { path: 'contas-fixas', loadComponent: () => import('./features/recurring-accounts/recurring-accounts.page').then((m) => m.RecurringAccountsPage) },
      { path: 'perfil', loadComponent: () => import('./features/profile/profile.page').then((m) => m.ProfilePage) },
      { path: 'renda', loadComponent: () => import('./features/income/income.page').then((m) => m.IncomePage) },
    ],
  },
  { path: '**', redirectTo: '' },
];
