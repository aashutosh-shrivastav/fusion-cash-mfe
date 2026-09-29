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
