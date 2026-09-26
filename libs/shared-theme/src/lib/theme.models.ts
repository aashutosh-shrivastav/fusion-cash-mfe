// libs/shared-theme/src/lib/theme.models.ts

/**
 * Brand configuration interface.
 * Matches the SCSS variables in brands/_brand-*.scss.
 * Used for runtime token injection and API-served branding.
 */
export interface BrandConfig {
  name: string;
  colors: {
    primary: string;
    primaryContainer: string;
    onPrimary: string;
    secondary: string;
    secondaryContainer: string;
    onSecondary: string;
    tertiary: string;
    error: string;
    surface: string;
    onSurface: string;
  };
  typography: {
    fontFamilyBase: string;
    fontFamilyHeading: string;
  };
  logo?: {
    light: string;   // URL to logo for light theme
    dark: string;     // URL to logo for dark theme
  };
}

/**
 * Maps BrandConfig properties to CSS custom property names.
 * Used by ThemeService.applyBrandTokens().
 */
export function brandConfigToCssTokens(config: BrandConfig): Record<string, string> {
  return {
    '--fc-color-primary':             config.colors.primary,
    '--fc-color-primary-container':   config.colors.primaryContainer,
    '--fc-color-on-primary':          config.colors.onPrimary,
    '--fc-color-secondary':           config.colors.secondary,
    '--fc-color-secondary-container': config.colors.secondaryContainer,
    '--fc-color-on-secondary':        config.colors.onSecondary,
    '--fc-color-tertiary':            config.colors.tertiary,
    '--fc-color-error':               config.colors.error,
    '--fc-color-surface':             config.colors.surface,
    '--fc-color-on-surface':          config.colors.onSurface,
    '--fc-font-family-base':          config.typography.fontFamilyBase,
    '--fc-font-family-heading':       config.typography.fontFamilyHeading,
  };
}

/**
 * Tenant Theme configuration interface matching backend CRUD REST API.
 */
export interface TenantThemeConfig {
  tenantId: string;
  tenantName: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily?: string;
  borderRadius?: string;
}

/**
 * Maps TenantThemeConfig to CSS custom properties on :root (including Material 3 system variables).
 */
export function tenantThemeToCssTokens(tenant: TenantThemeConfig): Record<string, string> {
  const tokens: Record<string, string> = {
    '--mat-sys-primary':              tenant.primaryColor,
    '--fc-color-primary':             tenant.primaryColor,
    '--mat-sys-secondary':            tenant.secondaryColor,
    '--fc-color-secondary':           tenant.secondaryColor,
  };

  if (tenant.fontFamily) {
    tokens['--fc-font-family'] = tenant.fontFamily;
  }

  if (tenant.borderRadius) {
    tokens['--fc-radius-md'] = tenant.borderRadius;
  }

  return tokens;
}
