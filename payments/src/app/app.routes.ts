import { Route } from '@angular/router';

/**
 * Standalone app routes for the Payments MFE (port 3002).
 *
 * Includes:
 *  - /home       → Payments standalone home (dev only, NOT exposed to shell)
 *  - /screen-b   → Screen B (also exposed to shell via remote routes)
 *  - /           → loads remote entry routes (for federation compatibility)
 */
export const appRoutes: Route[] = [
  {
    path: 'home',
    loadComponent: () => import('./payments-home.component').then(m => m.PaymentsHomeComponent),
  },
  {
    path: '',
    loadChildren: () => import('./remote-entry/entry.routes').then(m => m.remoteRoutes),
  },
];
