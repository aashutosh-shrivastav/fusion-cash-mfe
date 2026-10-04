// shared-core/src/lib/interceptors/loading.interceptor.ts

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingStateService } from './loading.state';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  // Skip loader for background silent polling requests if marked with header 'X-Silent'
  if (req.headers.has('X-Silent')) {
    const cleanReq = req.clone({ headers: req.headers.delete('X-Silent') });
    return next(cleanReq);
  }

  const loader = inject(LoadingStateService);
  loader.show();

  return next(req).pipe(
    finalize(() => loader.hide())
  );
};
