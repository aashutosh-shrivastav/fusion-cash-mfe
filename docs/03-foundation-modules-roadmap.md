[← Back to Documentation Index](./index.md)

# MFE Foundation Modules — Prioritization & Roadmap

This document summarizes the core foundational modules required for the enterprise Angular 22 MFE monorepo.

---

## P0 Modules Inventory (Blockers)

| # | Module | Nx Target Library | Purpose | Status |
|---|--------|-------------------|---------|--------|
| 1 | **Unit Testing (Jest)** | Workspace config | Jest setup with Angular presets, coverage thresholds | Setup Guide Ready |
| 2 | **Environment & Runtime Config** | `libs/shared-core` | `APP_INITIALIZER` dynamic endpoint & feature flag loader | Setup Guide Ready |
| 3 | **HTTP Interceptor Chain** | `libs/shared-core` | Auth header injection, global error handling, logging, retry | Setup Guide Ready |
| 4 | **Auth Guards & Token Mgmt** | `libs/auth` | JWT storage, token refresh, `canActivateFn`, `canMatchFn` | Setup Guide Ready |
| 5 | **Theming & CSS Vars** | `libs/shared-theme` | Angular Material 3 + Tech Mahindra Impact Red branding | Phase 1 Done |
| 6 | **i18n (ngx-translate)** | `libs/shared-i18n` | Per-MFE lazy loaded JSON key-value translations | Setup Guide Ready |
| 7 | **API Client Gen (OpenAPI)** | `libs/api-client` | Auto-generate Angular services & models from OpenAPI YAML | Setup Guide Ready |
