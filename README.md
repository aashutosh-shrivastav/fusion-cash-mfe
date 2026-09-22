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

### 3. Unit Testing & Building

```bash
# Run unit tests for affected projects
npx nx affected -t test

# Build production bundles
npx nx build shell
```

---

*Note: This README will be updated continuously as new foundation modules and MFE components are added to the workspace.*
