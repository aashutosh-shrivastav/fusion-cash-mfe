# Fusion Cash MFE — Documentation Index

Welcome to the central documentation index for the Fusion Cash Management Micro Frontend (MFE) project.

---

## 🏗️ Architecture & Strategy Documents

- [**00 - Micro Frontend Architecture Design**](./00-mfe-architecture-design.md)  
  High-level architecture, dynamic Module Federation, workspace structure, and decoupled Tomcat WAR deployment.

- [**01 - Local Development & CI/CD Pipelines**](./01-local-dev-and-cicd.md)  
  Port configuration, Nx serve commands, HMR library rules, and GitHub Actions packaging workflows.

- [**02 - Branding & Angular Material 3 Theming Design**](./02-branding-and-theming-design-doc.md)  
  Tech Mahindra Impact Red (`#E31837`) & Steel Grey (`#58595B`) styling tokens, M3 overrides, runtime white-labeling, and TTF font setup.

- [**03 - Foundation Modules Roadmap**](./03-foundation-modules-roadmap.md)  
  Prioritized inventory of P0 (Blocker), P1 (Critical), P2 (Important), and P3 (Nice-to-have) workspace modules.

---

## 🛠️ P0 Manual Developer Setup Guides

Step-by-step implementation guides for developers building foundation setup items on non-AI enabled work environments:

1. [**P01 - Jest Unit Testing Setup**](./p0-manual-guides/P01-jest-unit-testing.md)  
   Angular + Jest presets, `jest.config.ts`, zone testing setup, and coverage commands.

2. [**P02 - Environment & Runtime Config**](./p0-manual-guides/P02-environment-and-runtime-config.md)  
   Runtime `app-config.json` loading via `provideAppInitializer` in `shared-core`.

3. [**P03 - HTTP Interceptor Chain**](./p0-manual-guides/P03-http-interceptor-chain.md)  
   Functional HTTP interceptors (`withInterceptors`) for auth tokens and global error handling.

4. [**P04 - Auth Guards & Token Management**](./p0-manual-guides/P04-auth-guards-and-token-mgmt.md)  
   Signals-based `AuthService`, functional `authGuard`, and MFE route protection.

5. [**P05 - Angular Material 3 & Custom Theming**](./p0-manual-guides/P05-angular-material-theming.md)  
   Material 3 SCSS architecture, `ThemeService`, dark mode, and dynamic font family customization.

6. [**P06 - ngx-translate Internationalization (i18n)**](./p0-manual-guides/P06-ngx-translate-i18n.md)  
   Multi-language support, HTTP translation loader, and per-MFE translation dictionaries.

7. [**P07 - OpenAPI Client Auto-Generation**](./p0-manual-guides/P07-openapi-api-client-codegen.md)  
   Generating typed Angular services and DTO models from Swagger/OpenAPI YAML specifications.
