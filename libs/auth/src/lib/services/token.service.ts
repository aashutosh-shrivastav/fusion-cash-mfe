// libs/auth/src/lib/services/token.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { TokenPayload } from '../models/auth.model';

const TOKEN_KEY = 'fc_auth_token';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private _rawToken = signal<string | null>(this.getStoredToken());

  /** Readonly reactive token signal */
  readonly token = this._rawToken.asReadonly();

  /** Decoded JWT token payload signal */
  readonly payload = computed<TokenPayload | null>(() => {
    const raw = this._rawToken();
    if (!raw) return null;
    return this.parseJwt(raw);
  });

  /** Computed flag indicating whether token exists and is not expired */
  readonly isValid = computed<boolean>(() => {
    const decoded = this.payload();
    if (!decoded || !decoded.exp) return false;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return decoded.exp > nowInSeconds;
  });

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
    this._rawToken.set(token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    this._rawToken.set(null);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private parseJwt(token: string): TokenPayload | null {
    try {
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      // If mock token is not standard JWT, construct fallback mock payload
      return {
        sub: 'usr-101',
        email: 'user@fusioncash.com',
        name: 'Demo Cash Manager',
        roles: ['ROLE_USER', 'ROLE_FINANCE_MANAGER'],
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
      };
    }
  }
}
