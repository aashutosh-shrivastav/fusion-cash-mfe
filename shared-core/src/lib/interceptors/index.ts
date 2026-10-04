// shared-core/src/lib/interceptors/index.ts

import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { authInterceptor } from './auth.interceptor';
import { loggingInterceptor } from './logging.interceptor';
import { loadingInterceptor } from './loading.interceptor';
import { retryInterceptor } from './retry.interceptor';
import { errorInterceptor } from './error.interceptor';

export * from './loading.state';
export * from './auth.interceptor';
export * from './logging.interceptor';
export * from './loading.interceptor';
export * from './retry.interceptor';
export * from './error.interceptor';

/**
 * Ordered array of foundational HTTP interceptors:
 * 1. Auth Interceptor (injects token)
 * 2. Logging Interceptor (starts timer)
 * 3. Loading Interceptor (increments loader count)
 * 4. Retry Interceptor (retries transient 5xx GETs)
 * 5. Error Interceptor (transforms HTTP errors & handles 401s)
 */
export const CORE_HTTP_INTERCEPTORS: HttpInterceptorFn[] = [
  authInterceptor,
  loggingInterceptor,
  loadingInterceptor,
  retryInterceptor,
  errorInterceptor
];

/**
 * Convenience Angular provider registering HttpClient with full foundational interceptor chain
 */
export function provideCoreHttpInterceptors(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideHttpClient(withInterceptors(CORE_HTTP_INTERCEPTORS))
  ]);
}
