# P0-03: Manual Developer Guide — HTTP Interceptor Chain

## Overview
This guide demonstrates setting up functional HTTP interceptors in Angular 19/22 using `provideHttpClient(withInterceptors([...]))`.

---

## 1. Auth & Token Interceptor

In `libs/shared-core/src/lib/interceptors/auth.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
```

---

## 2. Global Error Handling Interceptor

In `libs/shared-core/src/lib/interceptors/error.interceptor.ts`:

```typescript
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to login or refresh token
        router.navigate(['/login']);
      } else if (error.status === 403) {
        console.error('Access Denied');
      } else if (error.status >= 500) {
        console.error('Server error encountered:', error.message);
      }
      return throwError(() => error);
    })
  );
};
```

---

## 3. Register Interceptors Globally

In `apps/shell/src/app/app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@fusion-cash-mfe/shared-core';
import { errorInterceptor } from '@fusion-cash-mfe/shared-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    )
  ]
};
```
