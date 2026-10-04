# Fusion Cash Management — Micro Frontend (MFE) Monorepo

Enterprise Micro Frontend architecture for **Fusion Cash Management**, built with **Angular 22**, **Nx Monorepo**, and **Webpack Module Federation**.

> 📚 **Documentation Index**: See [**`docs/index.md`**](./docs/index.md) for architectural design documents, setup guides, and module specifications.

---

## Workspace Layout

- **`apps/shell`**: Host application (navigation, authentication, dynamic Module Federation loading)
- **`balance`**: Balance Service MFE (remote application)
- **`payments`**: Payments Service MFE (remote application)
- **`libs/shared-theme`**: Angular Material 3, brand palettes, CSS Custom Properties, and font loading
- **`libs/shared-core`**: Core services, HTTP interceptors, environment config, and auth guards
- **`docs/`**: Architecture design specs and developer setup guides

---

## Quick Start

### 1. Serve Integrated Applications

Start the Shell along with live dev servers for remote MFEs:

```bash
npx nx serve shell --devRemotes=balance,payments
```

### 2. Serve Single MFE Standalone

```bash
# Serve Balance MFE standalone on port 3001
npx nx serve balance

# Serve Payments MFE standalone on port 3002
npx nx serve payments
```

### 3. API Client Code Generation (OpenAPI)

Before running or building the applications, generate TypeScript services and DTO models from OpenAPI specifications:

```bash
# Generate API clients for all registered OpenAPI specifications
npm run generate:api

# Generate API client for a specific specification
npm run generate:api:fusion-cash
```

#### Adding New OpenAPI Specifications
1. Add your new YAML spec file (e.g. `accounts-api.yaml`) to `libs/api-client/openapi-spec/`.
2. Add a sub-command script to `package.json`:
   ```json
   "generate:api:accounts": "npx openapi-typescript-codegen --input libs/api-client/openapi-spec/accounts-api.yaml --output libs/api-client/src/lib/generated/accounts"
   ```
3. Append `&& npm run generate:api:accounts` to the master `"generate:api"` script in `package.json`.

---

### 4. Unit Testing & Building

```bash
# Run unit tests across workspace
npm run generate:api && npx nx run-many -t test --all

# Build production bundles
npx nx run-many -t build --all
```

---

*Note: This README will be updated continuously as new foundation modules and MFE components are added to the workspace.*
