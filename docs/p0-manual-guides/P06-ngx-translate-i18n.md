[← Back to Documentation Index](../index.md)

# P0-06: Manual Developer Guide — i18n Internationalization (`ngx-translate`)

## Overview
This guide provides instructions to configure `@ngx-translate/core` and `@ngx-translate/http-loader` for multi-language support across Micro Frontends.

---

## 1. Install Dependencies

```bash
npm install @ngx-translate/core @ngx-translate/http-loader
```

---

## 2. Translation Loader Factory

In `libs/shared-core/src/lib/i18n/translation-loader.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
```

---

## 3. Register Translate Module in App Config

In `apps/shell/src/app/app.config.ts`:

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from '@fusion-cash-mfe/shared-core';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'en',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })
    )
  ]
};
```

---

## 4. Translation Files & Usage

Add translation keys in `apps/shell/src/assets/i18n/en.json`:

```json
{
  "WELCOME": "Welcome to Fusion Portal",
  "NAV": {
    "HOME": "Home",
    "BALANCE": "Balance Service MFE",
    "PAYMENTS": "Payments MFE"
  }
}
```

Usage in Angular component template:

```html
<h1>{{ 'WELCOME' | translate }}</h1>
```
