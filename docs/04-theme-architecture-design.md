# Theme Architecture — Design Document

**Project:** Fusion Cash MFE  
**Version:** 1.0  
**Last Updated:** 2026-09-27

---

## 1. Overview

The Fusion Cash MFE theming system enables **multi-tenant, runtime-configurable branding** across the entire micro-frontend application. Themes are composed of two layers — a compile-time SCSS foundation and a runtime JavaScript injection layer — both unified through **CSS Custom Properties (Design Tokens)**.

Key capabilities:
- **Light / Dark mode** toggle with one-click switching
- **Per-tenant brand colors, fonts, and shapes** driven by a backend REST API
- **Live preview** of theme changes before persisting
- **MFE inheritance**: child MFEs automatically adopt the shell's theme without their own theme imports

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser (:root)                            │
│                                                                    │
│  CSS Custom Properties (Design Tokens)                             │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  --mat-sys-primary: #E31837                                  │  │
│  │  --fc-color-primary: var(--mat-sys-primary)                  │  │
│  │  --fc-color-secondary: var(--mat-sys-secondary)              │  │
│  │  --fc-font-family-base: 'Inter', 'Roboto', sans-serif       │  │
│  │  --fc-radius-md: 8px                                        │  │
│  │  --fc-spacing-md: 16px    ...                                │  │
│  └───────────────────────────────────────────────────────────────┘  │
│         ▲ Build-time defaults        ▲ Runtime overrides           │
│         │                            │                             │
│  ┌──────┴──────────┐        ┌────────┴──────────────┐              │
│  │  SCSS Layer     │        │  ThemeService (TS)     │              │
│  │  (Compiled)     │        │  (Runtime injection)   │              │
│  │                 │        │                        │              │
│  │  theme.scss     │        │  applyBrandTokens()    │              │
│  │  _tokens.scss   │        │  applyTenantTheme()    │              │
│  │  _palettes.scss │        │  toggleTheme()         │              │
│  │  _overrides.scss│        │  selectTenant()        │              │
│  │  _brand-*.scss  │        │  fetchTenants()        │              │
│  └─────────────────┘        └──────────┬────────────┘              │
│                                        │ HTTP                      │
│  ┌─────────────────────────────────────┴───────────────┐           │
│  │          Shell App (localhost:4200)                  │           │
│  │  ┌─────────────┐  ┌──────────┐  ┌────────────────┐ │           │
│  │  │ AppComponent │  │  Home    │  │ ThemeManager   │ │           │
│  │  │ (sidebar)    │  │  Page    │  │ Component      │ │           │
│  │  └─────────────┘  └──────────┘  └────────────────┘ │           │
│  │                                                     │           │
│  │  ┌──── MFE: Balance (port 3001) ──────────────────┐ │           │
│  │  │  Inherits tokens via CSS custom property       │ │           │
│  │  │  cascade — NO separate theme import needed     │ │           │
│  │  └────────────────────────────────────────────────┘ │           │
│  │  ┌──── MFE: Payments (port 3002) ─────────────────┐ │           │
│  │  │  Same inheritance mechanism                    │ │           │
│  │  └────────────────────────────────────────────────┘ │           │
│  └─────────────────────────────────────────────────────┘           │
│                                                                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ REST API
                     ┌──────────▼──────────┐
                     │  Backend API        │
                     │  (localhost:4000)    │
                     │                     │
                     │  GET  /themes       │
                     │  GET  /theme/:id    │
                     │  PUT  /theme/:id    │
                     │  POST /theme        │
                     └─────────────────────┘
```

---

## 3. File Structure

```
libs/shared-theme/
├── src/
│   ├── index.ts                        # Public API barrel exports
│   ├── lib/
│   │   ├── theme.service.ts            # Runtime theme logic (Angular service)
│   │   └── theme.models.ts             # TypeScript interfaces & CSS mapping functions
│   ├── brands/
│   │   ├── _brand-default.scss         # Tech Mahindra brand (Impact Red + Steel Grey)
│   │   └── _brand-template.scss        # Copy-this template for new customer brands
│   └── styles/
│       ├── theme.scss                  # Master entry point (import ONCE in shell)
│       ├── _material-theme.scss        # Angular Material M3 theme definitions
│       ├── _palettes.scss              # M3 tonal palettes for primary/secondary/tertiary
│       ├── _tokens.scss                # All CSS custom properties (design tokens)
│       ├── _overrides.scss             # Angular Material component-level overrides
│       └── _mixins.scss                # Reusable SCSS mixins for consumers
```

---

## 4. Layer 1 — SCSS (Compile-Time Foundation)

### 4.1 Brand Files (`brands/`)

Each tenant's **build-time** brand identity is defined as SCSS variables. The default is Tech Mahindra:

| Variable | Value | Description |
|---|---|---|
| `$primary` | `#E31837` | Impact Red |
| `$secondary` | `#4D4D4F` | Steel Grey |
| `$tertiary` | `#7c4dff` | Deep Purple A200 |
| `$error` | `#d32f2f` | Red 700 |
| `$font-family-base` | `'Inter', 'Roboto', sans-serif` | Body font |

**How to add a new build-time brand:**
1. Copy `_brand-template.scss` → `_brand-{customer}.scss`
2. Fill in brand hex values
3. In `_tokens.scss`, change: `@use '../brands/brand-{customer}' as brand;`
4. Rebuild

### 4.2 Material Theme (`_material-theme.scss`)

Defines two M3 themes with a critical setting:

```scss
$fc-light-theme: mat.define-theme((
  color: (
    theme-type: light,
    primary: palettes.$fc-primary-palette,
    use-system-variables: true,   // ← KEY: outputs --mat-sys-* CSS vars
  ),
  typography: (use-system-variables: true),
));
```

`use-system-variables: true` is what makes the entire Angular Material component library consume CSS custom properties instead of hardcoded colors. This is the foundation that makes runtime theming possible.

### 4.3 Design Tokens (`_tokens.scss`)

Defines **all** CSS custom properties consumed by components:

| Token Category | Prefix | Examples |
|---|---|---|
| Brand Colors | `--fc-color-*` | `--fc-color-primary`, `--fc-color-on-primary` |
| M3 System Overrides | `--mat-sys-*` | `--mat-sys-primary`, `--mat-sys-secondary` |
| Typography | `--fc-font-*` | `--fc-font-family-base`, `--fc-font-size-md` |
| Spacing | `--fc-spacing-*` | `--fc-spacing-sm` (8px), `--fc-spacing-md` (16px) |
| Shape | `--fc-radius-*` | `--fc-radius-md` (8px), `--fc-radius-full` (9999px) |
| Elevation | `--fc-shadow-*` | `--fc-shadow-sm`, `--fc-shadow-lg` |
| Transition | `--fc-transition-*` | `--fc-transition-fast` (150ms), `--fc-transition-slow` |

**Golden Rule:** Components must **only** use these tokens. Never hardcode colors, fonts, spacing, or shadows.

### 4.4 Material Overrides (`_overrides.scss`)

Uses Angular Material's `*-overrides()` mixins — the **only upgrade-safe** way to customize component appearance:

```scss
:root {
  @include mat.button-overrides((
    filled-container-color: var(--fc-color-primary),
    filled-label-text-color: var(--fc-color-on-primary),
    filled-container-shape: var(--fc-radius-md),
  ));
}
```

> ⚠️ **Never** override internal `.mat-*` or `.mdc-*` CSS classes directly. Use the `*-overrides()` API only.

### 4.5 Theme Entry Point (`theme.scss`)

The single import consumed by the Shell:

```scss
@include mat.core();

:root, .light-theme {
  @include mat.all-component-themes(fc-mat.$fc-light-theme);
}

.dark-theme {
  @include mat.all-component-themes(fc-mat.$fc-dark-theme);
  color-scheme: dark;
}
```

### 4.6 Utility Mixins (`_mixins.scss`)

Reusable mixins for component SCSS:

| Mixin | Purpose |
|---|---|
| `@include elevation($level)` | Apply shadow by level (0-4) |
| `@include card-surface` | Standard card background + border + shadow |
| `@include page-padding` | Consistent page padding |
| `@include heading($size)` | Heading font family + weight + size |
| `@include body($size)` | Body font family + weight + size |

---

## 5. Layer 2 — Runtime JavaScript (ThemeService)

**File:** `libs/shared-theme/src/lib/theme.service.ts`  
**Scope:** `providedIn: 'root'` (singleton across the app)

### 5.1 Signals (Reactive State)

| Signal | Type | Description |
|---|---|---|
| `themeMode` | `'light' \| 'dark'` | Current light/dark mode |
| `isDark` | `boolean` (computed) | Convenience flag |
| `activeTenant` | `TenantThemeConfig \| null` | Currently active tenant configuration |
| `availableTenants` | `TenantThemeConfig[]` | All tenant profiles from backend |

### 5.2 Core Methods

```
┌──────────────────────────┬──────────────────────────────────────────────┐
│ Method                   │ Description                                  │
├──────────────────────────┼──────────────────────────────────────────────┤
│ toggleTheme()            │ Swap light ↔ dark, toggle body class,       │
│                          │ persist to localStorage                      │
├──────────────────────────┼──────────────────────────────────────────────┤
│ setTheme(mode)           │ Explicitly set light or dark                 │
├──────────────────────────┼──────────────────────────────────────────────┤
│ applyBrandTokens(tokens) │ Inject arbitrary CSS vars on :root           │
│                          │ (low-level, any Record<string, string>)      │
├──────────────────────────┼──────────────────────────────────────────────┤
│ resetBrandTokens(names)  │ Remove runtime overrides, fall back          │
│                          │ to SCSS defaults                             │
├──────────────────────────┼──────────────────────────────────────────────┤
│ fetchTenants()           │ GET /api/tenant/themes → populate signal     │
├──────────────────────────┼──────────────────────────────────────────────┤
│ selectTenant(id)         │ GET /api/tenant/theme/:id → apply + persist  │
├──────────────────────────┼──────────────────────────────────────────────┤
│ applyTenantTheme(tenant) │ Convert TenantThemeConfig → CSS tokens       │
│                          │ → inject on :root                            │
├──────────────────────────┼──────────────────────────────────────────────┤
│ updateTenantTheme(t)     │ PUT /api/tenant/theme/:id → save + refresh   │
├──────────────────────────┼──────────────────────────────────────────────┤
│ createTenantTheme(t)     │ POST /api/tenant/theme → create + activate   │
└──────────────────────────┴──────────────────────────────────────────────┘
```

### 5.3 Runtime Injection Flow

```
TenantThemeConfig (JSON)
        │
        ▼
tenantThemeToCssTokens()           ← maps JSON fields to CSS property names
        │
        ▼
{                                  ← Record<string, string>
  '--mat-sys-primary': '#E31837',
  '--fc-color-primary': '#E31837',
  '--mat-sys-secondary': '#4D4D4F',
  '--fc-color-secondary': '#4D4D4F',
  '--fc-font-family': 'Inter',
  '--fc-radius-md': '8px'
}
        │
        ▼
applyBrandTokens()                 ← document.documentElement.style.setProperty()
        │
        ▼
:root style attribute              ← browser repaints everything instantly
```

---

## 6. Layer 3 — Backend API

**Endpoint Base:** `http://localhost:4000/api/tenant`

### 6.1 REST Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/themes` | List all tenant theme profiles |
| `GET` | `/theme/:tenantId` | Get a single tenant theme |
| `PUT` | `/theme/:tenantId` | Update existing tenant theme |
| `POST` | `/theme` | Create a new tenant theme |

### 6.2 TenantThemeConfig Schema

```typescript
export interface TenantThemeConfig {
  tenantId: string;        // Unique key, e.g. "tech-mahindra"
  tenantName: string;      // Display name, e.g. "Tech Mahindra (Default)"
  common: CommonThemeConfig;
  sidebar?: SidebarThemeConfig;
  topbar?: TopbarThemeConfig;
  footer?: FooterThemeConfig;
}
```

### 6.3 Data Flow

```
┌─────────────┐     GET /themes     ┌───────────────┐
│ ThemeService ├───────────────────►│ Backend API    │
│ (Angular)    │◄───────────────────┤ (Express)      │
│              │   TenantThemeConfig[]│               │
│              │                     │               │
│              │  PUT /theme/:id     │  In-memory     │
│              ├───────────────────►│  store (Map)   │
│              │◄───────────────────┤               │
│              │   Updated config    │  (Future:     │
│              │                     │   PostgreSQL)  │
└──────┬───────┘                     └───────────────┘
       │
       ▼
  :root CSS vars → all Angular Material components repaint
```

---

## 7. Light / Dark Mode Mechanism

| Step | What Happens |
|---|---|
| User clicks toggle | `ThemeService.toggleTheme()` fires |
| Body class swap | `body.classList` switches between `light-theme` / `dark-theme` |
| M3 theme swap | SCSS `@include mat.all-component-themes($fc-dark-theme)` under `.dark-theme` activates |
| Surface colors change | `--mat-sys-surface`, `--mat-sys-on-surface`, etc. update automatically |
| Brand colors persist | `--mat-sys-primary`, `--fc-color-primary` remain unchanged across modes |
| Preference persisted | `localStorage.setItem('fc-theme-mode', mode)` |
| Restored on reload | Constructor reads `localStorage` and re-applies |

---

## 8. MFE Theme Inheritance

MFEs (Balance, Payments, etc.) **do not import** `theme.scss` or the `ThemeService`. They inherit everything through the CSS cascade:

```
Shell
├── <body class="light-theme">                    ← theme class here
│   ├── :root CSS custom properties               ← tokens injected here
│   │   ├── Shell components (use tokens) ✓
│   │   ├── <fc-balance-mfe>                      ← Shadow DOM boundary
│   │   │   └── Components use tokens ✓           ← CSS vars penetrate shadow DOM
│   │   └── <fc-payments-mfe>
│   │       └── Components use tokens ✓
```

**Why this works:**
- CSS custom properties **inherit through the DOM tree**, including through Web Component shadow DOM boundaries
- Angular Material's `use-system-variables: true` makes all Material components read `--mat-sys-*` variables
- When `ThemeService.applyBrandTokens()` updates `:root`, the browser automatically repaints every component

**MFE developer rule:** In your component SCSS, use `var(--fc-color-primary)` or the `@include` mixins from `_mixins.scss`. Never hardcode colors.

---

## 9. Token Mapping Chain

The full chain from backend JSON to rendered pixel:

```
Backend DB (TenantThemeConfig JSON)
     │
     │  HTTP GET
     ▼
ThemeService.selectTenant()
     │
     │  tenantThemeToCssTokens()
     ▼
Record<string, string>
     │
     │  document.documentElement.style.setProperty()
     ▼
:root {
  --mat-sys-primary: #E31837;        ← Angular Material reads this
  --fc-color-primary: #E31837;       ← Custom components read this
}
     │
     │  CSS cascade + inheritance
     ▼
mat-button { background: var(--mat-sys-primary); }     ← Material button
.my-widget { border-left: 3px solid var(--fc-color-primary); }  ← Custom component
```

---

## 10. Theme Manager UI

**Component:** `ThemeManagerComponent` (`apps/shell/src/app/theme-manager.component.ts`)  
**Selector:** `<fc-theme-manager>`  
**Location:** Embedded on the Home page

### Features

| Feature | Implementation |
|---|---|
| Tenant dropdown selector | `mat-select` bound to `availableTenants()` signal |
| Dark mode toggle | Calls `themeService.toggleTheme()` |
| Live color pickers | `<input type="color">` + `(input)="previewTheme()"` |
| Font family input | Text input for CSS font-family string |
| Border radius input | Text input for CSS border-radius value |
| Save (PUT) | `themeService.updateTenantTheme()` |
| Create (POST) | `themeService.createTenantTheme()` |

---

## 11. Persistence Strategy

| Data | Storage | Restored On |
|---|---|---|
| Light/Dark preference | `localStorage('fc-theme-mode')` | App bootstrap (constructor) |
| Active tenant ID | `localStorage('fc-tenant-id')` | App bootstrap → `fetchTenants()` |
| Tenant theme configs | Backend API (in-memory Map) | App bootstrap → `GET /themes` |

---

## 12. Adding a New Themeable Property

To add a new property (e.g., `headerBackground`):

### Step 1: Backend Model
Add the field to `TenantThemeConfig`:
```typescript
export interface TenantThemeConfig {
  // ... existing fields
  headerBackground?: string;
}
```

### Step 2: CSS Token Mapping
Update `tenantThemeToCssTokens()` in `theme.models.ts`:
```typescript
if (tenant.headerBackground) {
  tokens['--fc-color-header-bg'] = tenant.headerBackground;
}
```

### Step 3: SCSS Token Default
Add a default in `_tokens.scss`:
```scss
:root {
  --fc-color-header-bg: var(--fc-color-primary);
}
```

### Step 4: Consume in Components
```scss
.app-header {
  background-color: var(--fc-color-header-bg);
}
```

### Step 5: (Optional) UI Control
Add input to `ThemeManagerComponent` template.

---

## 13. Design Decisions & Rationale

| Decision | Rationale |
|---|---|
| **CSS Custom Properties** over SCSS-only theming | CSS vars can be changed at runtime without recompilation. SCSS variables are compile-time only. |
| **`use-system-variables: true`** in M3 | Makes Angular Material read `--mat-sys-*` CSS vars instead of baking in hex codes. This is non-negotiable for runtime theming. |
| **Single theme import in Shell only** | Avoids duplicate Material CSS bundles. MFEs inherit via cascade. |
| **`providedIn: 'root'`** singleton service | Ensures one source of truth for theme state across the entire app. |
| **Angular Signals** for state | Modern reactivity — computed values auto-update, no manual subscriptions. |
| **`document.documentElement.style.setProperty()`** | Directly targets `:root`, which is the cascade origin for all components. Highest specificity for overrides. |
| **`localStorage` for preferences** | Instant restore without API call. The backend is for tenant configuration, not user preferences. |
| **`*-overrides()` mixins** for Material customization | The only Angular Material-supported API for component styling. Direct `.mat-*` class overrides break on upgrades. |

---

## 14. Future Enhancements

| Enhancement | Status | Description |
|---|---|---|
| Font assets from `assets/fonts/` (TTF) | Planned | Load custom TTF fonts at runtime with configurable `@font-face` |
| Extended color tokens | Planned | Add `headerBackground`, `sidebarColor`, `accentGradient`, etc. |
| Persistent backend (PostgreSQL) | Planned | Replace in-memory Map with database |
| Per-user theme overrides | Planned | Allow users to set personal theme within a tenant |
| Theme export/import (JSON) | Planned | Download/upload theme configurations |
| CSS-in-JS fallback for SSR | Deferred | For server-side rendering scenarios |

---

← [Back to Index](index.md)
