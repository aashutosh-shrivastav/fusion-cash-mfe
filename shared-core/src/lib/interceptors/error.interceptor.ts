// shared-core/src/lib/interceptors/error.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export interface FormattedApiError {
  status: number;
  message: string;
  code?: string;
  timestamp: string;
  originalError: unknown;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let formattedMessage = 'An unexpected network error occurred.';

      if (error.error instanceof ErrorEvent) {
        // Client-side / network error
        formattedMessage = `Client error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            formattedMessage = 'Session expired or unauthorized. Please sign in again.';
            // Broadcast auth failure or redirect
            localStorage.removeItem('fc_auth_token');
            router.navigate(['/auth/login'], { queryParams: { returnUrl: router.url } });
            break;
          case 403:
            formattedMessage = 'Access denied. You do not have permission for this action.';
            break;
          case 404:
            formattedMessage = 'Requested API resource was not found.';
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            formattedMessage = 'Server error occurred. Please try again later.';
            break;
          default:
            formattedMessage = error.error?.message || `Server responded with status ${error.status}`;
        }
      }

      const formattedError: FormattedApiError = {
        status: error.status,
        message: formattedMessage,
        code: error.error?.code || `HTTP_${error.status}`,
        timestamp: new Date().toISOString(),
        originalError: error
      };

      return throwError(() => formattedError);
    })
  );
};
