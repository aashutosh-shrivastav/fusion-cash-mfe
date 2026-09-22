import { HomeComponent } from './home.component';
import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
    {
    path: 'payments',
    loadChildren: () => loadRemote<typeof import('payments/Routes')>('payments/Routes').then(m => m!.remoteRoutes)
    },
    {
    path: 'balance',
    loadChildren: () => loadRemote<typeof import('balance/Routes')>('balance/Routes').then(m => m!.remoteRoutes)
    },
    {
      path: '',
      component: HomeComponent
    },];
