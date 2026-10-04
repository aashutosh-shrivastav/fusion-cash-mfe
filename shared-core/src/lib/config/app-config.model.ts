// shared-core/src/lib/config/app-config.model.ts

import { InjectionToken } from '@angular/core';

export interface AuthConfig {
  authority: string;
  clientId: string;
  redirectUri: string;
  scopes: string[];
  tokenRefreshIntervalMs?: number;
}

export interface FeatureFlags {
  enableNewPaymentsUI?: boolean;
  enableAnalytics?: boolean;
  enableMultiCurrency?: boolean;
  enableDarkTheme?: boolean;
  [key: string]: boolean | undefined;
}

export interface AppConfig {
  production: boolean;
  environment: 'development' | 'qa' | 'staging' | 'production';
  apiBaseUrl: string;
  /** Dictionary mapping Microservice names to their base URLs. 1 Microservice can host N Swagger/OpenAPI specs. */
  microservices: Record<string, string>;
  version: string;
  enableLogging: boolean;
  auth: AuthConfig;
  featureFlags: FeatureFlags;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  production: false,
  environment: 'development',
  apiBaseUrl: 'http://localhost:3000/api/v1',
  microservices: {
    balanceService: 'http://localhost:3000/api/v1/balance',
    paymentsService: 'http://localhost:3000/api/v1/payments',
    userService: 'http://localhost:3000/api/v1/user',
    authService: 'https://auth.fusion-cash.internal/v1'
  },
  version: '1.0.0-dev',
  enableLogging: true,
  auth: {
    authority: 'https://auth.fusion-cash.internal',
    clientId: 'fusion-cash-mfe-shell',
    redirectUri: 'http://localhost:4200/callback',
    scopes: ['openid', 'profile', 'email', 'finance.read', 'finance.write'],
    tokenRefreshIntervalMs: 300000
  },
  featureFlags: {
    enableNewPaymentsUI: true,
    enableAnalytics: true,
    enableMultiCurrency: true,
    enableDarkTheme: true
  }
};

export const ENVIRONMENT_CONFIG = new InjectionToken<AppConfig>('ENVIRONMENT_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_APP_CONFIG
});
