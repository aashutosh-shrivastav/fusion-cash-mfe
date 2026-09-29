// libs/shared-theme/src/lib/theme.service.ts

import { Injectable, Inject, signal, computed, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TenantThemeConfig, tenantThemeToCssTokens } from './theme.models';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private http = inject(HttpClient);

  /** Current theme mode signal */
  private _themeMode = signal<'light' | 'dark'>('light');

  /** Public readonly signal */
  readonly themeMode = this._themeMode.asReadonly();

  /** Computed convenience flag */
  readonly isDark = computed(() => this._themeMode() === 'dark');

  /** Active tenant theme signal */
  private _activeTenant = signal<TenantThemeConfig | null>(null);
  readonly activeTenant = this._activeTenant.asReadonly();

  /** All available tenant theme profiles signal */
  private _availableTenants = signal<TenantThemeConfig[]>([]);
  readonly availableTenants = this._availableTenants.asReadonly();

  /** Dynamic topbar logo URL (always uses darkUrl/white logo for high contrast on dark primary topbar) */
  readonly activeLogoUrl = computed(() => {
    const tenant = this._activeTenant();
    return tenant?.common?.logo?.darkUrl || 'assets/images/logo/dark/logo.png';
  });

  /** Dynamic sidebar logo URL (light logo for light theme sidebar, dark logo for dark theme sidebar) */
  readonly activeSidebarLogoUrl = computed(() => {
    const tenant = this._activeTenant();
    const isDark = this.isDark();
    if (isDark) {
      return tenant?.common?.logo?.darkUrl || 'assets/images/logo/dark/logo.png';
    } else {
      return tenant?.common?.logo?.lightUrl || 'assets/images/logo/light/logo.png';
    }
  });

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Restore persisted preference
    const savedMode = localStorage.getItem('fc-theme-mode');
    if (savedMode === 'dark') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }

    // Auto-load tenant themes from static JSON asset
    this.fetchTenants();
  }

  /**
   * Toggle between light and dark theme.
   * Switches CSS class on <body> which triggers the SCSS theme swap.
   */
  toggleTheme(): void {
    const next = this._themeMode() === 'light' ? 'dark' : 'light';
    this.setTheme(next);
  }

  /**
   * Set a specific theme mode.
   */
  setTheme(mode: 'light' | 'dark'): void {
    const body = this.document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(`${mode}-theme`);
    this._themeMode.set(mode);
    localStorage.setItem('fc-theme-mode', mode);

    // Re-apply current tenant theme tokens with updated mode
    const current = this._activeTenant();
    if (current) {
      this.applyTenantTheme(current);
    }
  }

  /**
   * Apply brand tokens at runtime by injecting CSS custom properties onto html and body elements.
   * Applying to body guarantees inline styles override SCSS .light-theme and .dark-theme class rules on body.
   */
  applyBrandTokens(tokens: Record<string, string>): void {
    const root = this.document.documentElement;
    const body = this.document.body;
    for (const [property, value] of Object.entries(tokens)) {
      root.style.setProperty(property, value);
      if (body) {
        body.style.setProperty(property, value);
      }
    }
  }

  /**
   * Reset all runtime brand overrides back to stylesheet defaults.
   */
  resetBrandTokens(tokenNames: string[]): void {
    const root = this.document.documentElement;
    const body = this.document.body;
    for (const property of tokenNames) {
      root.style.removeProperty(property);
      if (body) {
        body.style.removeProperty(property);
      }
    }
  }

  // ── Tenant Theme Operations (Read from static JSON asset) ────

  /**
   * Fetch all registered tenant themes from the static JSON file in assets.
   */
  async fetchTenants(): Promise<TenantThemeConfig[]> {
    try {
      const tenants = await firstValueFrom(
        this.http.get<TenantThemeConfig[]>('/assets/tenant-themes.json')
      );
      this._availableTenants.set(tenants);

      // Auto-restore saved tenant or default to first
      const savedTenantId = localStorage.getItem('fc-tenant-id') || 'tech-mahindra';
      const match = tenants.find(t => t.tenantId === savedTenantId);
      if (match) {
        this.selectTenant(match.tenantId);
      } else if (tenants.length > 0) {
        this.selectTenant(tenants[0].tenantId);
      }
      return tenants;
    } catch (err) {
      console.warn('Could not fetch tenant themes from JSON asset, using default SCSS theme', err);
      return [];
    }
  }

  /**
   * Select and apply a tenant theme by ID.
   */
  selectTenant(tenantId: string): void {
    const tenants = this._availableTenants();
    const tenant = tenants.find(t => t.tenantId === tenantId);
    if (tenant) {
      this._activeTenant.set(tenant);
      this.applyTenantTheme(tenant);
      localStorage.setItem('fc-tenant-id', tenantId);
    } else {
      console.warn(`Tenant "${tenantId}" not found in loaded themes`);
    }
  }

  /**
   * Apply tenant theme configuration to document :root.
   */
  applyTenantTheme(tenant: TenantThemeConfig): void {
    const tokens = tenantThemeToCssTokens(tenant, this.isDark());
    this.applyBrandTokens(tokens);
  }
}
