[← Back to Documentation Index](../index.md)

# P0-04: Manual Developer Guide — Auth Guards & Token Management

## Overview
This guide covers functional route guards (`canActivateFn`, `canMatchFn`) and authentication token management in `libs/auth` or `libs/shared-core`.

---

## 1. Auth Service

In `libs/shared-core/src/lib/services/auth.service.ts`:

```typescript
import { Injectable, signal, computed } from '@angular/core';

export interface UserSession {
  userId: string;
  userName: string;
  roles: string[];
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private sessionSignal = signal<UserSession | null>(null);

  readonly isAuthenticated = computed(() => !!this.sessionSignal()?.token);
  readonly userRoles = computed(() => this.sessionSignal()?.roles ?? []);

  setSession(session: UserSession) {
    this.sessionSignal.set(session);
    localStorage.setItem('auth_token', session.token);
  }

  getToken(): string | null {
    return this.sessionSignal()?.token ?? localStorage.getItem('auth_token');
  }

  logout() {
    this.sessionSignal.set(null);
    localStorage.removeItem('auth_token');
  }

  hasRole(requiredRole: string): boolean {
    return this.userRoles().includes(requiredRole);
  }
}
```

---

## 2. Functional Auth Guard

In `libs/shared-core/src/lib/guards/auth.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

---

## 3. Protecting MFE Routes in Shell

In `apps/shell/src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';
import { loadRemoteModule } from '@nx/module-federation';
import { authGuard } from '@fusion-cash-mfe/shared-core';

export const appRoutes: Routes = [
  {
    path: 'balance',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule('balance', './Routes').then((m) => m.remoteRoutes),
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadChildren: () =>
      loadRemoteModule('payments', './Routes').then((m) => m.remoteRoutes),
  }
];
```
