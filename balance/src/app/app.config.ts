import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideCoreHttpInterceptors, provideAppConfig } from '@fusion-cash-mfe/shared-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideCoreHttpInterceptors(),
    provideAppConfig()
  ]
};
