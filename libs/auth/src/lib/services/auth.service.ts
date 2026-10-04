// libs/auth/src/lib/services/auth.service.ts

import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, LoginRequest, LoginResponse } from '../models/auth.model';
import { TokenService } from './token.service';

const MOCK_USER: User = {
  id: 'usr-101',
  username: 'ashutosh',
  email: 'ashutosh@fusioncash.com',
  fullName: 'Ashutosh Shrivastav',
  roles: ['ROLE_USER', 'ROLE_FINANCE_MANAGER', 'ROLE_ADMIN'],
  tenantId: 'tech-mahindra'
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenService = inject(TokenService);
  private router = inject(Router);

  private _currentUser = signal<User | null>(this.restoreInitialUser());

  /** Readonly signal of currently logged in user */
  readonly currentUser = this._currentUser.asReadonly();

  /** Computed flag indicating if user is authenticated */
  readonly isAuthenticated = computed(() => {
    return this._currentUser() !== null && this.tokenService.isValid();
  });

  /** Computed user roles */
  readonly roles = computed(() => this._currentUser()?.roles || []);

  private restoreInitialUser(): User | null {
    if (this.tokenService.isValid()) {
      const payload = this.tokenService.payload();
      return {
        id: payload?.sub || 'usr-101',
        username: payload?.email?.split('@')[0] || 'ashutosh',
        email: payload?.email || 'ashutosh@fusioncash.com',
        fullName: payload?.name || 'Ashutosh Shrivastav',
        roles: payload?.roles || ['ROLE_USER', 'ROLE_FINANCE_MANAGER', 'ROLE_ADMIN']
      };
    }
    return MOCK_USER; // Default to demo user state for seamless development
  }

  login(credentials: LoginRequest): Promise<boolean> {
    // Generate mock token for development demonstration
    const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: 'usr-101',
        email: credentials.username.includes('@') ? credentials.username : `${credentials.username}@fusioncash.com`,
        name: 'Ashutosh Shrivastav',
        roles: ['ROLE_USER', 'ROLE_FINANCE_MANAGER', 'ROLE_ADMIN'],
        exp: Math.floor(Date.now() / 1000) + 86400
      })
    )}.mock_signature`;

    this.tokenService.setToken(mockToken);
    this._currentUser.set({
      id: 'usr-101',
      username: credentials.username,
      email: `${credentials.username}@fusioncash.com`,
      fullName: 'Ashutosh Shrivastav',
      roles: ['ROLE_USER', 'ROLE_FINANCE_MANAGER', 'ROLE_ADMIN']
    });

    return Promise.resolve(true);
  }

  logout(redirectUrl = '/auth/login'): void {
    this.tokenService.clearToken();
    this._currentUser.set(null);
    this.router.navigateByUrl(redirectUrl);
  }

  hasRole(role: string): boolean {
    return this.roles().includes(role);
  }

  hasAnyRole(requiredRoles: string[]): boolean {
    return requiredRoles.some(r => this.hasRole(r));
  }
}
