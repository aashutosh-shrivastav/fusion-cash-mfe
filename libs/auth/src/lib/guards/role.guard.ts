// libs/auth/src/lib/guards/role.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Higher-order guard factory to restrict routes based on user role authorization
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    }

    if (authService.hasAnyRole(allowedRoles)) {
      return true;
    }

    // Redirect to unauthorized access forbidden view
    return router.createUrlTree(['/forbidden']);
  };
}
