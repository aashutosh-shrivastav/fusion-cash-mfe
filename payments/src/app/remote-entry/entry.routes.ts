import { Route } from '@angular/router';
import { ScreenBComponent } from './screen-b.component';

/**
 * Remote routes exposed to the Shell via Module Federation.
 * These routes are loaded under the 'payments/' prefix in the shell.
 *
 * NOTE: PaymentsHomeComponent is intentionally NOT included here.
 * It is only accessible when running standalone on port 3002.
 */
export const remoteRoutes: Route[] = [
  { path: 'screen-b', component: ScreenBComponent },
  { path: '', redirectTo: 'screen-b', pathMatch: 'full' },
];
