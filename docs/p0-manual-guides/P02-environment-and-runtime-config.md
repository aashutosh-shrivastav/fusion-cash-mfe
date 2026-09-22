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

## 4. Static Config File

Add `apps/shell/src/assets/config/app-config.json`:

```json
{
  "production": false,
  "apiBaseUrl": "http://localhost:4000/api",
  "authUrl": "http://localhost:4000/auth",
  "enableFeatureFlags": {
    "newPaymentsFlow": true
  }
}
```
