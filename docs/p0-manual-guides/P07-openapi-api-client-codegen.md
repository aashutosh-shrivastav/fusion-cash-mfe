[← Back to Documentation Index](../index.md)

# P0-07: Manual Developer Guide — OpenAPI Client Auto-Generation

## Overview
This guide outlines how to generate typed Angular services and DTO models directly from backend OpenAPI/Swagger YAML specs in `libs/api-client` using pure Node.js terminal CLI tools (`openapi-typescript-codegen`).

---

## 1. Directory Structure

Store all input OpenAPI 3.0 specification YAML files in `libs/api-client/openapi-spec/`:

```
libs/api-client/
├── openapi-spec/
│   ├── fusion-cash-api.yaml
│   └── dummy-service-api.yaml
└── src/
    └── lib/
        └── generated/
            ├── fusion-cash/
            └── dummy/
```

---

## 2. Package.json Script Chaining

In `package.json`:

```json
"scripts": {
  "generate:api:fusion-cash": "npx openapi-typescript-codegen --input libs/api-client/openapi-spec/fusion-cash-api.yaml --output libs/api-client/src/lib/generated/fusion-cash",
  "generate:api:dummy": "npx openapi-typescript-codegen --input libs/api-client/openapi-spec/dummy-service-api.yaml --output libs/api-client/src/lib/generated/dummy",
  "generate:api": "npm run generate:api:fusion-cash && npm run generate:api:dummy"
}
```

---

## 3. Running API Client Code Generation

Run the master generator script before starting the application or running unit tests:

```bash
# Generate TypeScript services & models for all registered OpenAPI specs
npm run generate:api

# Or generate for a specific OpenAPI YAML file:
npm run generate:api:fusion-cash
```

---

## 4. Workflow for Adding New OpenAPI Specifications

1. Place your new spec (e.g. `accounts-api.yaml`) inside `libs/api-client/openapi-spec/`.
2. Add a sub-script script to `package.json`:
   ```json
   "generate:api:accounts": "npx openapi-typescript-codegen --input libs/api-client/openapi-spec/accounts-api.yaml --output libs/api-client/src/lib/generated/accounts"
   ```
3. Append `&& npm run generate:api:accounts` to `"generate:api"` in `package.json`.
4. Run `npm run generate:api`.

---

## 5. Consuming Generated Services in MFEs

```typescript
import { BalanceApiService, BalanceSummary } from '@fusion-cash-mfe/api-client';

@Component({
  selector: 'fc-balance-card',
  template: `<h2>{{ balance()?.totalBalanceUSD | currency }}</h2>`
})
export class BalanceCardComponent implements OnInit {
  private balanceApi = inject(BalanceApiService);
  readonly balance = signal<BalanceSummary | null>(null);

  ngOnInit() {
    this.balanceApi.getBalanceSummary().subscribe(data => this.balance.set(data));
  }
}
```

---

## 6. Configuring Different Base Paths for Different OpenAPI Specs

Each OpenAPI specification can target a completely different backend host, domain, or base path. This is configured in two ways:

### A. Static Definition in OpenAPI Spec YAML (`servers` field)
Each YAML file specifies its own base URL in the `servers` section:

```yaml
# fusion-cash-api.yaml
servers:
  - url: http://localhost:3000/api/v1

# payments-service-api.yaml
servers:
  - url: http://localhost:4000/api/v2/payments

# analytics-api.yaml
servers:
  - url: https://analytics.internal.company.com/v1
```

### B. Dynamic Runtime Configuration (`OpenAPI.BASE` / `AppConfigService`)
Override base paths dynamically per environment in Angular `app.config.ts` or `AppConfigService`:

```typescript
import { OpenAPI as FusionCashOpenAPI } from '@fusion-cash-mfe/api-client/generated/fusion-cash';
import { OpenAPI as DummyOpenAPI } from '@fusion-cash-mfe/api-client/generated/dummy';

export function initializeApiBasePaths(appConfig: AppConfigService) {
  // Direct generated OpenAPI clients to their respective environment microservices
  FusionCashOpenAPI.BASE = appConfig.getApiUrl('/v1');
  DummyOpenAPI.BASE = 'http://localhost:5000/api/v1/dummy';
}
```
