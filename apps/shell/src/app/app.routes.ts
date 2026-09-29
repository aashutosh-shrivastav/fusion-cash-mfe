import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

/**
 * Shell application routes.
 *
 * - /home           → Shell home (greeting placeholder)
 * - /theme-manager  → Theme Manager component
 * - /balance/*      → Balance MFE (federated, loads Screen A)
 * - /payments/*     → Payments MFE (federated, loads Screen B)
 * - /               → redirect to /home
 */
export const appRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./home.component').then(m => m.HomeComponent),
  },
  {
    path: 'theme-manager',
    loadComponent: () => import('./theme-manager.component').then(m => m.ThemeManagerComponent),
  },
  {
    path: 'balance',
    loadChildren: () =>
      loadRemote<typeof import('balance/Routes')>('balance/Routes').then(m => m!.remoteRoutes),
  },
  {
    path: 'payments',
    loadChildren: () =>
      loadRemote<typeof import('payments/Routes')>('payments/Routes').then(m => m!.remoteRoutes),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
