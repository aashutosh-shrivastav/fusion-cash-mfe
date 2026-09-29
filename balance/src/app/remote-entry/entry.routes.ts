import { Route } from '@angular/router';
import { ScreenAComponent } from './screen-a.component';

/**
 * Remote routes exposed to the Shell via Module Federation.
 * These routes are loaded under the 'balance/' prefix in the shell.
 *
 * NOTE: BalanceHomeComponent is intentionally NOT included here.
 * It is only accessible when running standalone on port 3001.
 */
export const remoteRoutes: Route[] = [
  { path: 'screen-a', component: ScreenAComponent },
  { path: '', redirectTo: 'screen-a', pathMatch: 'full' },
];
