// shared-core/src/lib/interceptors/retry.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry, timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  // Only retry idempotent GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    retry({
      count: 2, // retry up to 2 times
      delay: (error: HttpErrorResponse, retryCount: number) => {
        // Only retry transient 5xx or 0 status network errors
        if (error.status >= 500 || error.status === 0) {
          const backoffTime = retryCount * 1000;
          console.warn(`[HTTP Retry] Retrying request ${req.url} (Attempt ${retryCount}) after ${backoffTime}ms...`);
          return timer(backoffTime);
        }
        throw error;
      }
    })
  );
};
