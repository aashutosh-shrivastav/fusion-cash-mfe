[← Back to Documentation Index](../index.md)

# P0-02: Manual Developer Guide — Environment & Runtime Config

## Overview
This guide shows how to set up runtime environment configuration in `libs/shared-core` loaded at startup via `APP_INITIALIZER` / `provideAppInitializer`.

---

## 1. Create Config Model

In `libs/shared-core/src/lib/models/app-config.model.ts`:

```typescript
export interface AppConfig {
  production: boolean;
  apiBaseUrl: string;
  authUrl: string;
  enableFeatureFlags?: {
    [key: string]: boolean;
  };
}
```

---

## 2. Create Config Service

In `libs/shared-core/src/lib/services/app-config.service.ts`:

```typescript
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig } from '../models/app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private configSignal = signal<AppConfig | null>(null);

  readonly config = this.configSignal.asReadonly();

  constructor(private http: HttpClient) {}

  async loadConfig(): Promise<AppConfig> {
    try {
      const config = await firstValueFrom(
        this.http.get<AppConfig>('/assets/config/app-config.json')
      );
      this.configSignal.set(config);
      return config;
    } catch (err) {
      console.error('Failed to load application configuration', err);
      throw err;
    }
  }

  get apiBaseUrl(): string {
    return this.configSignal()?.apiBaseUrl ?? '';
  }
}
```

---

## 3. Register Provider in Application Config

In `apps/shell/src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { AppConfigService } from '@fusion-cash-mfe/shared-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppInitializer(() => {
      const configService = inject(AppConfigService);
      return configService.loadConfig();
    })
  ]
};
```

---

## 4. Microservice-Centric Dynamic Configuration (1 Microservice = 1 Base URL)

Configuration maps runtime environment URLs to **Backend Microservices** (not individual Swagger files). A single Microservice can host multiple Swagger/OpenAPI specs.

Add `apps/shell/public/assets/config/app-config.json`:

```json
{
  "production": false,
  "environment": "development",
  "apiBaseUrl": "http://localhost:3000/api/v1",
  "microservices": {
    "balanceMicroservice": "http://localhost:3000/api/v1/balance",
    "paymentsMicroservice": "http://localhost:3000/api/v1/payments",
    "userMicroservice": "http://localhost:3000/api/v1/user",
    "authMicroservice": "https://auth.fusion-cash.internal/v1"
  },
  "version": "1.0.0-dev",
  "enableLogging": true,
  "featureFlags": {
    "enableNewPaymentsUI": true
  }
}
```

---

## 5. Dynamic Endpoint Retrieval in Components & Services

```typescript
private configService = inject(AppConfigService);

// 1. Get dynamic base URL for any named microservice:
const balanceUrl = this.configService.getMicroserviceUrl('balanceMicroservice'); 
// Output: 'http://localhost:3000/api/v1/balance'

// 2. Construct full endpoint URL for a specific microservice action:
const fullUrl = this.configService.getApiUrl('/summary', 'balanceMicroservice');
// Output: 'http://localhost:3000/api/v1/balance/summary'
```
