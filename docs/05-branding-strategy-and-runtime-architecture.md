# Branding Strategy & Runtime Theme Architecture

## 1. Overview & Strategy

**Core principle: Same binary for all customers. Branding is configuration, not code.**

This strategy document replaces traditional build-time wrapper projects and manual distribution steps with a runtime-configurable **CSS Custom Property (Design Token)** system managed via `shared-theme` and `ThemeService`.

---

## 2. Hierarchical Tenant Theme JSON Schema (`TenantThemeConfig`)

To support deep tenant customization without breaking Dark Mode or component boundaries, `tenant-themes.json` defines a component-segregated schema with dedicated `dark` override blocks:

```json
[
  {
    "tenantId": "tech-mahindra",
    "tenantName": "Tech Mahindra (Default)",
    "common": {
      "primaryColor": "#E31837",
      "secondaryColor": "#1A1A1A",
      "fontFamily": "AppCustomFont, Roboto, sans-serif",
      "borderRadius": "8px",
      "logo": {
        "lightUrl": "assets/images/logo/light/logo.png",
        "darkUrl": "assets/images/logo/dark/logo.png"
      },
      "surfaceColor": "#FAFAFA",
      "surfaceContainerColor": "#FFFFFF",
      "dark": {
        "primaryColor": "#E31837",
        "secondaryColor": "#212121",
        "surfaceColor": "#121212",
        "surfaceContainerColor": "#1E1E1E",
        "surfaceDimColor": "#282828",
        "onSurfaceColor": "#FFFFFF",
        "onSurfaceVariantColor": "#BDBDBD"
      }
    },
    "sidebar": {
      "backgroundColor": "#FFFFFF",
      "textColor": "#212121",
      "borderColor": "#E0E0E0",
      "dark": {
        "backgroundColor": "#1A1A1A",
        "textColor": "#FFFFFF",
        "borderColor": "rgba(255, 255, 255, 0.12)"
      }
    },
    "topbar": {
      "backgroundColor": "#1A1A1A",
      "textColor": "#FFFFFF",
      "dark": {
        "backgroundColor": "#121212",
        "textColor": "#FFFFFF"
      }
    },
    "footer": {
      "backgroundColor": "#F5F5F5",
      "textColor": "#616161",
      "dark": {
        "backgroundColor": "#121212",
        "textColor": "#9E9E9E"
      }
    }
  }
]
```

---

## 3. TypeScript Data Models (`theme.models.ts`)

```typescript
export interface LogoConfig {
  lightUrl: string;
  darkUrl: string;
}

export interface CommonSurfaceBlock {
  surfaceColor?: string;
  surfaceContainerColor?: string;
  surfaceDimColor?: string;
  onSurfaceColor?: string;
  onSurfaceVariantColor?: string;
}

export interface CommonThemeConfig extends CommonSurfaceBlock {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  errorColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  logo?: LogoConfig;
  dark?: {
    primaryColor?: string;
    secondaryColor?: string;
    surfaceColor?: string;
    surfaceContainerColor?: string;
    surfaceDimColor?: string;
    onSurfaceColor?: string;
    onSurfaceVariantColor?: string;
  };
}

export interface ComponentColorBlock {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  activeItemBgColor?: string;
  activeItemTextColor?: string;
}

export interface SidebarThemeConfig extends ComponentColorBlock {
  dark?: ComponentColorBlock;
}

export interface TopbarThemeConfig extends ComponentColorBlock {
  dark?: ComponentColorBlock;
}

export interface FooterThemeConfig extends ComponentColorBlock {
  dark?: ComponentColorBlock;
}

export interface TenantThemeConfig {
  tenantId: string;
  tenantName: string;
  common: CommonThemeConfig;
  sidebar?: SidebarThemeConfig;
  topbar?: TopbarThemeConfig;
  footer?: FooterThemeConfig;
}
```

---

## 4. Reactive CSS Custom Property Token Mapping

The `tenantThemeToCssTokens(tenant, isDark)` mapper dynamically injects CSS custom properties into `:root` at runtime:

```typescript
export function tenantThemeToCssTokens(
  tenant: TenantThemeConfig,
  isDark: boolean = false
): Record<string, string> {
  const tokens: Record<string, string> = {};
  if (!tenant) return tokens;

  // 1. Common Brand & Surface Tokens
  if (tenant.common) {
    const primary = isDark && tenant.common.dark?.primaryColor ? tenant.common.dark.primaryColor : tenant.common.primaryColor;
    const secondary = isDark && tenant.common.dark?.secondaryColor ? tenant.common.dark.secondaryColor : tenant.common.secondaryColor;

    if (primary) {
      tokens['--mat-sys-primary'] = primary;
      tokens['--fc-color-primary'] = primary;
    }
    if (secondary) {
      tokens['--mat-sys-secondary'] = secondary;
      tokens['--fc-color-secondary'] = secondary;
    }
    if (tenant.common.fontFamily) {
      tokens['--fc-font-family-base'] = tenant.common.fontFamily;
      tokens['--fc-font-family-heading'] = tenant.common.fontFamily;
    }
    if (tenant.common.borderRadius) {
      tokens['--fc-radius-md'] = tenant.common.borderRadius;
    }

    // Dynamic Surface Tokens
    if (isDark) {
      const darkCommon = tenant.common.dark;
      tokens['--fc-color-surface'] = darkCommon?.surfaceColor || 'var(--fc-palette-dark-surface)';
      tokens['--mat-sys-surface'] = darkCommon?.surfaceColor || 'var(--fc-palette-dark-surface)';
      tokens['--fc-color-surface-container'] = darkCommon?.surfaceContainerColor || 'var(--fc-palette-dark-container)';
      tokens['--mat-sys-surface-container'] = darkCommon?.surfaceContainerColor || 'var(--fc-palette-dark-container)';
      tokens['--fc-color-surface-dim'] = darkCommon?.surfaceDimColor || 'var(--fc-palette-dark-elevated)';
      tokens['--fc-color-on-surface'] = darkCommon?.onSurfaceColor || 'var(--fc-palette-white)';
      tokens['--mat-sys-on-surface'] = darkCommon?.onSurfaceColor || 'var(--fc-palette-white)';
      tokens['--fc-color-on-surface-variant'] = darkCommon?.onSurfaceVariantColor || 'var(--fc-palette-gray-400)';
    } else {
      tokens['--fc-color-surface'] = tenant.common.surfaceColor || 'var(--fc-palette-gray-50)';
      tokens['--mat-sys-surface'] = tenant.common.surfaceColor || 'var(--fc-palette-gray-50)';
      tokens['--fc-color-surface-container'] = tenant.common.surfaceContainerColor || 'var(--fc-palette-white)';
      tokens['--mat-sys-surface-container'] = tenant.common.surfaceContainerColor || 'var(--fc-palette-white)';
      tokens['--fc-color-surface-dim'] = tenant.common.surfaceDimColor || 'var(--fc-palette-gray-100)';
      tokens['--fc-color-on-surface'] = tenant.common.onSurfaceColor || 'var(--fc-palette-gray-900)';
      tokens['--mat-sys-on-surface'] = tenant.common.onSurfaceColor || 'var(--fc-palette-gray-900)';
      tokens['--fc-color-on-surface-variant'] = tenant.common.onSurfaceVariantColor || 'var(--fc-palette-gray-600)';
    }
  }

  // 2. Component Blocks (sidebar, topbar, footer)
  if (tenant.sidebar) {
    const sb = isDark && tenant.sidebar.dark ? tenant.sidebar.dark : tenant.sidebar;
    tokens['--fc-sidebar-bg'] = sb.backgroundColor || (isDark ? 'var(--fc-palette-dark-surface)' : 'var(--fc-palette-white)');
    tokens['--fc-sidebar-text-color'] = sb.textColor || (isDark ? 'var(--fc-palette-white)' : 'var(--fc-palette-gray-900)');
    tokens['--fc-sidebar-border-color'] = sb.borderColor || (isDark ? 'var(--fc-palette-dark-border)' : 'var(--fc-palette-light-border)');
  }

  return tokens;
}
```

---

## 5. Framework Rules for MFE Component Developers

When building or styling components in any Micro-Frontend (Shell, Balance, Payments, etc.):

1. **Page Surface & Containers**:
   - Page backgrounds MUST use `background-color: var(--fc-color-surface)`.
   - Cards and container boxes MUST use `background-color: var(--fc-color-surface-container)` or `background: var(--fc-color-surface-dim)` with `border: 1px solid var(--fc-sidebar-border-color)`.
   - **NEVER** hardcode background colors (`#ffffff`, `#1a1a1a`, `#f5f5f5`).

2. **Typography & Text Contrast**:
   - Primary headers and main body text MUST use `color: var(--fc-color-on-surface)`.
   - Muted text, timestamps, and labels MUST use `color: var(--fc-color-on-surface-variant)`.
   - **NEVER** hardcode text colors (`#212121`, `#000000`, `#666666`).

3. **Theme Mode Reactivity**:
   - Do NOT write inline styles overriding CSS custom properties at element level.
   - Calling `ThemeService.setTheme('dark')` automatically updates `--fc-color-surface`, `--fc-color-surface-container`, `--fc-color-on-surface`, and `--fc-color-on-surface-variant` on `:root`, ensuring all MFEs adapt seamlessly without app reload or rebuild.

---

## 6. Known Pitfalls, Error Patterns & Resolution Strategies

### 1. CDK Overlay & Form Field Menu Surface Reddish Tint Bug
- **Symptom / Error Pattern**: `mat-select` dropdown panels (`.mat-mdc-select-panel`), `mat-menu` overlays, and dropdown list items (`.mat-mdc-option`) displayed a pinkish/reddish surface container background (`#FFDAD6`) after toggling Dark Mode off or switching tenant themes.
- **Root Cause**:
  1. Angular Material M3 SCSS `@include mat.all-component-themes()` emits `--mat-sys-surface-container-highest`, `--mat-select-panel-background-color`, and `--mdc-menu-surface-background-color` scoped to `.light-theme`.
  2. Class declarations on `document.body.light-theme` hold higher CSS specificity than inline styles placed solely on `document.documentElement` (`<html>`), causing SCSS compiled pink defaults on `body` to override inherited `html` tokens.
- **Resolution Strategy**:
  - `ThemeService.applyBrandTokens()` MUST inject runtime tokens onto **BOTH `document.documentElement` (`html`) AND `document.body` (`body`)**. Inline styles on `body.style` override `.light-theme` / `.dark-theme` CSS class rules.
  - `theme.models.ts` maps all M3 container variables (`--mat-sys-surface-container-highest`, `--mat-sys-surface-container-high`, `--mat-sys-surface-container-low`, `--mat-sys-surface-container-lowest`, `--mat-select-panel-background-color`, `--mat-menu-container-color`, `--mdc-menu-surface-background-color`, `--mat-option-container-color`) to tenant `surfaceContainerColor`.
  - `_overrides.scss` enforces `background-color: var(--fc-color-surface-container) !important;` on `.cdk-overlay-container` panels and `.mat-mdc-option` items.

### 2. Button Icon Contrast Loss on Primary Buttons
- **Symptom / Error Pattern**: Icons (e.g. `<mat-icon>download</mat-icon>`) inside filled primary buttons (`<button mat-flat-button color="primary">`) rendered in dark primary burgundy color instead of white, blending into the dark button background.
- **Root Cause**: A generic `[color="primary"] .mat-icon` selector matched icons inside primary buttons and forced `color: var(--fc-color-primary)`.
- **Resolution Strategy**:
  - Scope `mat-icon.mat-primary` to standalone icons.
  - Enforce `button.mat-mdc-button-base.mat-primary { .mat-icon { color: var(--fc-color-on-primary) !important; } }` in `_overrides.scss` so primary filled button icons always inherit `#FFFFFF` white text color.

### 3. M3 Button Corner Rounding (`border-radius` / `--_mat-button-filled-container-shape`)
- **Symptom / Error Pattern**: Material buttons (`mat-flat-button`, `mat-raised-button`) displayed full `9999px` pill-shaped rounded corners regardless of `--fc-radius-md`.
- **Root Cause**: Angular Material 18/19 M3 uses an internal shape variable `--_mat-button-filled-container-shape`, which defaulted to `var(--mat-sys-corner-full)` (`9999px`).
- **Resolution Strategy**:
  - Override `--_mat-button-filled-container-shape` and `--mat-filled-button-container-shape` with `var(--fc-radius-md)` in `_overrides.scss` and `theme.models.ts`.
  - Set `border-radius: var(--fc-radius-md, 8px) !important;` on `.mat-mdc-button-base` and `.mdc-button__ripple`.

### 4. Topbar Icon & Profile Avatar Contrast Externalization
- **Symptom / Error Pattern**: Topbar buttons and profile avatar icon blended with topbar background when switching tenant topbar background colors.
- **Resolution Strategy**: Externalized `topbar.iconColor`, `topbar.avatarGradientStart`, `topbar.avatarGradientEnd`, and `topbar.avatarTextColor` in `TenantThemeConfig` / `tenant-themes.json` and mapped CSS custom properties `--fc-topbar-icon-color`, `--fc-topbar-avatar-start`, `--fc-topbar-avatar-end`, `--fc-topbar-avatar-text-color`.

### 5. Menu Item Rounded Selection Visuals
- **Symptom / Error Pattern**: Sidebar navigation menu items (`mat-nav-list`) showed rounded pill selection highlights.
- **Resolution Strategy**: Enforced `border-radius: 0 !important;` on `.mat-mdc-list-item` in `_overrides.scss` and `sidebar-menu.component.ts` for clean, full-width rectangular selection visuals.

### 6. Card Action Buttons Edge Sticking & Spacing
- **Symptom / Error Pattern**: Card action buttons on Screen A, Screen B, and Home screens had no gap between buttons and touched container edges.
- **Resolution Strategy**: Added `display: flex !important; gap: var(--fc-spacing-sm, 12px) !important; padding: var(--fc-spacing-md, 16px) !important;` to `mat-card-actions` in `_overrides.scss`.

