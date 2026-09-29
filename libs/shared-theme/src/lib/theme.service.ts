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

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Restore persisted preference
    const savedMode = localStorage.getItem('fc-theme-mode');
    if (savedMode === 'dark') {
      this.setTheme('dark');
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
  }

  /**
   * Apply brand tokens at runtime by injecting CSS custom properties.
   *
   * This is the runtime branding mechanism. Pass a partial map of
   * token overrides and they'll be applied to :root immediately.
   *
   * Example:
   *   themeService.applyBrandTokens({
   *     '--fc-color-primary': '#e91e63',
   *     '--fc-color-primary-container': '#fce4ec',
   *   });
   */
  applyBrandTokens(tokens: Record<string, string>): void {
    const root = this.document.documentElement;
    for (const [property, value] of Object.entries(tokens)) {
      root.style.setProperty(property, value);
    }
  }

  /**
   * Reset all runtime brand overrides back to stylesheet defaults.
   */
  resetBrandTokens(tokenNames: string[]): void {
    const root = this.document.documentElement;
    for (const property of tokenNames) {
      root.style.removeProperty(property);
    }
  }

  // ── Tenant Theme Operations (Read from static JSON asset) ────

  /**
   * Fetch all registered tenant themes from the static JSON file in assets.
   * In production, this will be replaced with a backend API call.
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
   * Looks up the tenant from the already-loaded list (no HTTP call).
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
    const tokens = tenantThemeToCssTokens(tenant);
    this.applyBrandTokens(tokens);
  }

  // ── CRUD API Operations (commented out for demo) ─────────────
  // These will be re-enabled when the backend API is integrated.
  //
  // /**
  //  * Save / Update existing tenant theme configuration to backend (PUT).
  //  */
  // async updateTenantTheme(tenant: TenantThemeConfig): Promise<TenantThemeConfig> {
  //   const updated = await firstValueFrom(
  //     this.http.put<TenantThemeConfig>(`${this.apiBaseUrl}/theme/${tenant.tenantId}`, tenant)
  //   );
  //   this._activeTenant.set(updated);
  //   this.applyTenantTheme(updated);
  //   await this.fetchTenants();
  //   return updated;
  // }
  //
  // /**
  //  * Create a new tenant theme profile on backend (POST).
  //  */
  // async createTenantTheme(tenant: TenantThemeConfig): Promise<TenantThemeConfig> {
  //   const created = await firstValueFrom(
  //     this.http.post<TenantThemeConfig>(`${this.apiBaseUrl}/theme`, tenant)
  //   );
  //   await this.fetchTenants();
  //   await this.selectTenant(created.tenantId);
  //   return created;
  // }
}
