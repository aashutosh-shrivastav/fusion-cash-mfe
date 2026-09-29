import { Route } from '@angular/router';

/**
 * Standalone app routes for the Balance MFE (port 3001).
 *
 * Includes:
 *  - /home       → Balance standalone home (dev only, NOT exposed to shell)
 *  - /screen-a   → Screen A (also exposed to shell via remote routes)
 *  - /           → loads remote entry routes (for federation compatibility)
 */
export const appRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./balance-home.component').then(m => m.BalanceHomeComponent),
  },
  {
    path: '',
    loadChildren: () => import('./remote-entry/entry.routes').then(m => m.remoteRoutes),
  },
];
