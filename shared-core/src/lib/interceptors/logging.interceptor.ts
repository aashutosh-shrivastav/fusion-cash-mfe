// shared-core/src/lib/interceptors/logging.interceptor.ts

import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AppConfigService } from '../config/app-config.service';

export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const configService = inject(AppConfigService);
  const startTime = Date.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse && configService.config().enableLogging) {
          const elapsed = Date.now() - startTime;
          console.log(`[HTTP ${req.method}] ${req.urlWithParams} -> ${event.status} (${elapsed}ms)`);
        }
      },
      error: (error) => {
        if (configService.config().enableLogging) {
          const elapsed = Date.now() - startTime;
          console.error(`[HTTP ${req.method} FAILED] ${req.urlWithParams} -> Status ${error.status} (${elapsed}ms)`, error);
        }
      }
    })
  );
};
