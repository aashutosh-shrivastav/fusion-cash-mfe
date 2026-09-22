// libs/shared-theme/src/lib/theme.service.ts

import { Injectable, Inject, signal, computed } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * ThemeService manages runtime theme switching and brand token injection.
 *
 * Usage:
 *   - Inject in Shell's root component
 *   - Call toggleTheme() for light/dark switch
 *   - Call applyBrandTokens() with a brand config for white-labeling
 *
 * Architecture Note:
 *   Shell owns the ThemeService instance. MFEs don't need to inject it
 *   because CSS custom properties cascade through the DOM automatically.
 *   MFEs only need this service if they want to READ the current theme.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {

  /** Current theme mode signal */
  private _themeMode = signal<'light' | 'dark'>('light');

  /** Public readonly signal */
  readonly themeMode = this._themeMode.asReadonly();

  /** Computed convenience flag */
  readonly isDark = computed(() => this._themeMode() === 'dark');

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Restore persisted preference
    const saved = localStorage.getItem('fc-theme-mode');
    if (saved === 'dark') {
      this.setTheme('dark');
    }
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
   *
   * Future: These tokens will be fetched from the branding API.
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
}
