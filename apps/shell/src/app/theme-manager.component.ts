import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService, TenantThemeConfig } from '@fusion-cash-mfe/shared-theme';

@Component({
  selector: 'fc-theme-manager',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="theme-manager-card">
      <mat-card-header>
        <mat-card-title style="display: flex; align-items: center; gap: 8px;">
          <mat-icon color="primary">palette</mat-icon>
          Runtime Theme Switcher
        </mat-card-title>
        <mat-card-subtitle>
          Switch tenant brand themes from static configuration
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Tenant Dropdown Selector + Dark Mode Toggle -->
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="flex: 1; min-width: 240px;">
            <mat-label>Select Active Tenant</mat-label>
            <mat-select 
              [ngModel]="themeService.activeTenant()?.tenantId" 
              (selectionChange)="onTenantChange($event.value)">
              <mat-option *ngFor="let tenant of themeService.availableTenants()" [value]="tenant.tenantId">
                {{ tenant.tenantName }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button color="primary" (click)="themeService.toggleTheme()">
            {{ themeService.isDark() ? '☀️ Light Mode' : '🌙 Dark Mode' }}
          </button>
        </div>

        <!-- Active Theme Info -->
        <div *ngIf="themeService.activeTenant() as current" 
             style="display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.04);">
          <div style="display: flex; gap: 8px; align-items: center;">
            <div [style.background]="current.primaryColor" 
                 style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.12);"></div>
            <span style="font-size: 13px; font-weight: 500;">Primary</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <div [style.background]="current.secondaryColor" 
                 style="width: 24px; height: 24px; border-radius: 50%; border: 2px solid rgba(0,0,0,0.12);"></div>
            <span style="font-size: 13px; font-weight: 500;">Secondary</span>
          </div>
          <span style="font-size: 12px; color: rgba(0,0,0,0.5); margin-left: auto;">
            {{ current.fontFamily }} · {{ current.borderRadius }}
          </span>
        </div>

      </mat-card-content>
    </mat-card>

    <!-- ════════════════════════════════════════════════════════════
         CRUD panels (commented out for demo — re-enable when 
         backend API is integrated)
         
         Features when enabled:
         - Live Theme Editor (color pickers, font, border-radius)
         - Save to Backend (PUT)
         - Create New Tenant Profile (POST)
         ════════════════════════════════════════════════════════════ -->
  `
})
export class ThemeManagerComponent {
  themeService = inject(ThemeService);

  onTenantChange(tenantId: string) {
    this.themeService.selectTenant(tenantId);
  }

  // ── CRUD-related methods (commented out for demo) ─────────
  //
  // previewTheme() {
  //   const current = this.themeService.activeTenant();
  //   if (current) {
  //     this.themeService.applyTenantTheme(current);
  //   }
  // }
  //
  // async saveTheme(tenant: TenantThemeConfig) {
  //   await this.themeService.updateTenantTheme(tenant);
  //   alert(`Theme updated successfully for ${tenant.tenantName}!`);
  // }
  //
  // async createTenant() {
  //   if (!this.newTenant.tenantId || !this.newTenant.tenantName) {
  //     alert('Please fill in Tenant ID and Tenant Name');
  //     return;
  //   }
  //   await this.themeService.createTenantTheme(this.newTenant);
  //   alert(`New tenant theme created and activated: ${this.newTenant.tenantName}`);
  //   this.newTenant = {
  //     tenantId: '',
  //     tenantName: '',
  //     primaryColor: '#FF6B00',
  //     secondaryColor: '#1A1A1A',
  //     fontFamily: 'AppCustomFont, Roboto, sans-serif',
  //     borderRadius: '12px'
  //   };
  // }
}
