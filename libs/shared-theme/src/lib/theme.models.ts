/**
 * Common surface color definitions for light or dark mode.
 */
export interface CommonSurfaceBlock {
  surfaceColor?: string;
  surfaceContainerColor?: string;
  surfaceDimColor?: string;
  onSurfaceColor?: string;
  onSurfaceVariantColor?: string;
}

/**
 * Common brand tokens shared across the entire application.
 * Supports light surfaces and optional `dark` overrides for dark mode brand tokens.
 */
export interface CommonThemeConfig extends CommonSurfaceBlock {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor?: string;
  errorColor?: string;
  fontFamily?: string;
  borderRadius?: string;
  logo?: {
    lightUrl: string;
    darkUrl: string;
  };
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

/**
 * Base properties for component color configuration.
 */
export interface ComponentColorBlock {
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  activeItemBgColor?: string;
  activeItemTextColor?: string;
}

/**
 * Component-specific theme configuration for Sidebar.
 * Supports light values and optional `dark` overrides.
 */
export interface SidebarThemeConfig extends ComponentColorBlock {
  dark?: ComponentColorBlock;
}

/**
 * Component-specific theme configuration for Topbar.
 * Supports light values and optional `dark` overrides.
 */
export interface TopbarColorBlock extends ComponentColorBlock {
  iconColor?: string;
  avatarGradientStart?: string;
  avatarGradientEnd?: string;
  avatarTextColor?: string;
}

export interface TopbarThemeConfig extends TopbarColorBlock {
  dark?: TopbarColorBlock;
}

/**
 * Component-specific theme configuration for Footer.
 * Supports light values and optional `dark` overrides.
 */
export interface FooterThemeConfig extends ComponentColorBlock {
  dark?: ComponentColorBlock;
}

/**
 * Hierarchical Tenant Theme configuration structure.
 * Segregates common brand tokens from component-specific customizations.
 */
export interface TenantThemeConfig {
  tenantId: string;
  tenantName: string;
  common: CommonThemeConfig;
  sidebar?: SidebarThemeConfig;
  topbar?: TopbarThemeConfig;
  footer?: FooterThemeConfig;
}

/**
 * Maps TenantThemeConfig to CSS custom properties on :root (including Material 3 system & component tokens).
 * Reacts to `isDark` state to apply appropriate component tokens or fall back to palette defaults.
 */
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
      tokens['--sys-primary'] = primary;
      tokens['--mdc-theme-primary'] = primary;
      tokens['--fc-color-primary'] = primary;
      tokens['--mat-sys-surface-tint'] = primary;
      tokens['--mdc-filled-button-container-color'] = primary;
      tokens['--mat-filled-button-container-color'] = primary;
      tokens['--mdc-outlined-button-label-text-color'] = primary;
      tokens['--mat-outlined-button-label-text-color'] = primary;
      tokens['--mdc-outlined-button-outline-color'] = primary;
      tokens['--mat-outlined-button-outline-color'] = primary;
      tokens['--mdc-outlined-text-field-focus-label-text-color'] = primary;
      tokens['--mdc-outlined-text-field-focus-outline-color'] = primary;
      tokens['--mat-form-field-focus-select-arrow-color'] = primary;
      tokens['--mat-select-enabled-arrow-color'] = primary;
    }

    if (secondary) {
      tokens['--mat-sys-secondary'] = secondary;
      tokens['--sys-secondary'] = secondary;
      tokens['--mdc-theme-secondary'] = secondary;
      tokens['--fc-color-secondary'] = secondary;
    }

    if (tenant.common.fontFamily) {
      tokens['--fc-font-family-base'] = tenant.common.fontFamily;
      tokens['--fc-font-family-heading'] = tenant.common.fontFamily;
    }

    if (tenant.common.borderRadius) {
      tokens['--fc-radius-md'] = tenant.common.borderRadius;
      tokens['--mat-filled-button-container-shape'] = tenant.common.borderRadius;
      tokens['--_mat-button-filled-container-shape'] = tenant.common.borderRadius;
      tokens['--mat-outlined-button-container-shape'] = tenant.common.borderRadius;
      tokens['--_mat-button-outlined-container-shape'] = tenant.common.borderRadius;
    }

    // Dynamic Light / Dark Page Surface Tokens
    if (isDark) {
      const darkCommon = tenant.common.dark;
      const surface = darkCommon?.surfaceColor || 'var(--fc-palette-dark-surface)';
      const surfaceContainer = darkCommon?.surfaceContainerColor || 'var(--fc-palette-dark-container)';
      const onSurface = darkCommon?.onSurfaceColor || 'var(--fc-palette-white)';
      const onSurfaceVariant = darkCommon?.onSurfaceVariantColor || 'var(--fc-palette-gray-400)';

      tokens['--fc-color-surface'] = surface;
      tokens['--mat-sys-surface'] = surface;

      tokens['--fc-color-surface-container'] = surfaceContainer;
      tokens['--mat-sys-surface-container'] = surfaceContainer;
      tokens['--mat-sys-surface-container-highest'] = surfaceContainer;
      tokens['--mat-sys-surface-container-high'] = surfaceContainer;
      tokens['--mat-sys-surface-container-low'] = surfaceContainer;
      tokens['--mat-sys-surface-container-lowest'] = surfaceContainer;
      tokens['--mat-select-panel-background-color'] = surfaceContainer;
      tokens['--mat-menu-container-color'] = surfaceContainer;
      tokens['--mdc-menu-surface-background-color'] = surfaceContainer;

      tokens['--fc-color-surface-dim'] = darkCommon?.surfaceDimColor || 'var(--fc-palette-dark-elevated)';

      tokens['--fc-color-on-surface'] = onSurface;
      tokens['--mat-sys-on-surface'] = onSurface;

      tokens['--fc-color-on-surface-variant'] = onSurfaceVariant;
      tokens['--mat-sys-on-surface-variant'] = onSurfaceVariant;
    } else {
      const surface = tenant.common.surfaceColor || 'var(--fc-palette-gray-50)';
      const surfaceContainer = tenant.common.surfaceContainerColor || 'var(--fc-palette-white)';
      const onSurface = tenant.common.onSurfaceColor || 'var(--fc-palette-gray-900)';
      const onSurfaceVariant = tenant.common.onSurfaceVariantColor || 'var(--fc-palette-gray-600)';

      tokens['--fc-color-surface'] = surface;
      tokens['--mat-sys-surface'] = surface;

      tokens['--fc-color-surface-container'] = surfaceContainer;
      tokens['--mat-sys-surface-container'] = surfaceContainer;
      tokens['--mat-sys-surface-container-highest'] = surfaceContainer;
      tokens['--mat-sys-surface-container-high'] = surfaceContainer;
      tokens['--mat-sys-surface-container-low'] = surfaceContainer;
      tokens['--mat-sys-surface-container-lowest'] = surfaceContainer;
      tokens['--mat-select-panel-background-color'] = surfaceContainer;
      tokens['--mat-menu-container-color'] = surfaceContainer;
      tokens['--mdc-menu-surface-background-color'] = surfaceContainer;

      tokens['--fc-color-surface-dim'] = tenant.common.surfaceDimColor || 'var(--fc-palette-gray-100)';

      tokens['--fc-color-on-surface'] = onSurface;
      tokens['--mat-sys-on-surface'] = onSurface;

      tokens['--fc-color-on-surface-variant'] = onSurfaceVariant;
      tokens['--mat-sys-on-surface-variant'] = onSurfaceVariant;
    }
  }

  // 2. Sidebar Component Tokens
  if (tenant.sidebar) {
    const sb = isDark && tenant.sidebar.dark ? tenant.sidebar.dark : tenant.sidebar;
    
    if (sb.backgroundColor) {
      tokens['--fc-sidebar-bg'] = sb.backgroundColor;
    } else if (isDark) {
      tokens['--fc-sidebar-bg'] = 'var(--fc-palette-dark-surface)';
    } else {
      tokens['--fc-sidebar-bg'] = 'var(--fc-palette-white)';
    }

    if (sb.textColor) {
      tokens['--fc-sidebar-text-color'] = sb.textColor;
    } else if (isDark) {
      tokens['--fc-sidebar-text-color'] = 'var(--fc-palette-white)';
    } else {
      tokens['--fc-sidebar-text-color'] = 'var(--fc-palette-gray-900)';
    }

    if (sb.borderColor) {
      tokens['--fc-sidebar-border-color'] = sb.borderColor;
    } else if (isDark) {
      tokens['--fc-sidebar-border-color'] = 'var(--fc-palette-dark-border)';
    } else {
      tokens['--fc-sidebar-border-color'] = 'var(--fc-palette-light-border)';
    }
  }

  // 3. Topbar Component Tokens
  if (tenant.topbar) {
    const tb = isDark && tenant.topbar.dark ? tenant.topbar.dark : tenant.topbar;
    const topbarBg = tb.backgroundColor || (isDark ? 'var(--fc-palette-dark-container)' : 'var(--fc-color-primary)');
    const topbarText = tb.textColor || (isDark ? 'var(--fc-palette-white)' : '#FFFFFF');

    tokens['--fc-topbar-bg'] = topbarBg;
    tokens['--fc-topbar-text-color'] = topbarText;

    tokens['--fc-topbar-icon-color'] = tb.iconColor || topbarText;
    tokens['--fc-topbar-avatar-start'] = tb.avatarGradientStart || (isDark && tenant.common.dark?.primaryColor ? tenant.common.dark.primaryColor : tenant.common.primaryColor);
    tokens['--fc-topbar-avatar-end'] = tb.avatarGradientEnd || (isDark && tenant.common.dark?.secondaryColor ? tenant.common.dark.secondaryColor : tenant.common.secondaryColor);
    tokens['--fc-topbar-avatar-text-color'] = tb.avatarTextColor || '#FFFFFF';
  }

  // 4. Footer Component Tokens
  if (tenant.footer) {
    const ft = isDark && tenant.footer.dark ? tenant.footer.dark : tenant.footer;
    if (ft.backgroundColor) {
      tokens['--fc-footer-bg'] = ft.backgroundColor;
    } else if (isDark) {
      tokens['--fc-footer-bg'] = 'var(--fc-palette-dark-container)';
    }

    if (ft.textColor) {
      tokens['--fc-footer-text-color'] = ft.textColor;
    } else if (isDark) {
      tokens['--fc-footer-text-color'] = 'var(--fc-palette-gray-400)';
    }
  }

  return tokens;
}
