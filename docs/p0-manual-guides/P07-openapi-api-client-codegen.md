[← Back to Documentation Index](../index.md)

# P0-07: Manual Developer Guide — OpenAPI Client Auto-Generation

## Overview
This guide outlines how to generate typed Angular services and DTO models directly from backend OpenAPI/Swagger YAML specs in `libs/api-client`.

---

## 1. Install Generator CLI

```bash
npm install -D @openapitools/openapi-generator-cli
```

---

## 2. Configure Codegen Script

Add `openapitools.json` in workspace root:

```json
{
  "$schema": "./node_modules/@openapitools/openapi-generator-cli/config.schema.json",
  "spaces": 2,
  "generator-cli": {
    "version": "7.8.0",
    "generators": {
      "balance-api": {
        "generatorName": "typescript-angular",
        "inputSpec": "libs/api-client/src/specs/balance-api.yaml",
        "output": "libs/api-client/src/lib/generated/balance",
        "additionalProperties": {
          "npmName": "@fusion-cash-mfe/api-client-balance",
          "supportsES6": true,
          "ngVersion": "22.0.0"
        }
      }
    }
  }
}
```

---

## 3. Package.json Script

In `package.json`:

```json
"scripts": {
  "generate:api": "openapi-generator-cli generate"
}
```

---

## 4. Run Generation

```bash
npm run generate:api
```

Components in MFEs can now inject typed services directly:

```typescript
import { BalanceService } from '@fusion-cash-mfe/api-client';

@Component({ ... })
export class BalanceComponent {
  private balanceService = inject(BalanceService);

  balances = this.balanceService.getAccountBalances();
}
```
