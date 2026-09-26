import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
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
    MatIconModule,
    MatExpansionModule
  ],
  template: `
    <mat-card class="theme-manager-card">
      <mat-card-header>
        <mat-card-title style="display: flex; align-items: center; gap: 8px;">
          <mat-icon color="primary">palette</mat-icon>
          Runtime Tenant Theme Manager (CRUD API)
        </mat-card-title>
        <mat-card-subtitle>
          Dynamically switch or customize tenant brand themes via REST API
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px;">
        
        <!-- Tenant Dropdown Selector -->
        <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
          <mat-form-field appearance="outline" style="flex: 1; min-width: 240px;">
            <mat-label>Select Active Tenant</mat-label>
            <mat-select 
              [ngModel]="themeService.activeTenant()?.tenantId" 
              (selectionChange)="onTenantChange($event.value)">
              <mat-option *ngFor="let tenant of themeService.availableTenants()" [value]="tenant.tenantId">
                {{ tenant.tenantName }} ({{ tenant.primaryColor }})
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button color="primary" (click)="themeService.toggleTheme()">
            {{ themeService.isDark() ? '☀️ Light Mode' : '🌙 Dark Mode' }}
          </button>
        </div>

        <!-- Live Theme Customizer & Editor -->
        <mat-expansion-panel *ngIf="themeService.activeTenant() as current">
          <mat-expansion-panel-header>
            <mat-panel-title style="font-weight: 500;">
              ✏️ Live Theme Editor — {{ current.tenantName }}
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
            
            <!-- Primary Color -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-size: 12px; font-weight: 600;">Primary Color (Impact Red / Brand)</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="color" [(ngModel)]="current.primaryColor" (input)="previewTheme()" style="width: 40px; height: 40px; border: none; cursor: pointer; border-radius: 4px;">
                <mat-form-field appearance="outline" style="flex: 1;">
                  <input matInput [(ngModel)]="current.primaryColor" (input)="previewTheme()">
                </mat-form-field>
              </div>
            </div>

            <!-- Secondary Color -->
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <label style="font-size: 12px; font-weight: 600;">Secondary Color (Steel Grey / Brand)</label>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="color" [(ngModel)]="current.secondaryColor" (input)="previewTheme()" style="width: 40px; height: 40px; border: none; cursor: pointer; border-radius: 4px;">
                <mat-form-field appearance="outline" style="flex: 1;">
                  <input matInput [(ngModel)]="current.secondaryColor" (input)="previewTheme()">
                </mat-form-field>
              </div>
            </div>

            <!-- Font Family -->
            <mat-form-field appearance="outline">
              <mat-label>Font Family</mat-label>
              <input matInput [(ngModel)]="current.fontFamily" (input)="previewTheme()">
            </mat-form-field>

            <!-- Border Radius -->
            <mat-form-field appearance="outline">
              <mat-label>Border Radius (e.g. 8px)</mat-label>
              <input matInput [(ngModel)]="current.borderRadius" (input)="previewTheme()">
            </mat-form-field>

          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px;">
            <button mat-flat-button color="primary" (click)="saveTheme(current)">
              💾 Save Theme to Backend (PUT)
            </button>
          </div>
        </mat-expansion-panel>

        <!-- Create New Tenant Panel -->
        <mat-expansion-panel>
          <mat-expansion-panel-header>
            <mat-panel-title style="font-weight: 500;">
              ➕ Add New Tenant Profile (POST)
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-top: 16px;">
            <mat-form-field appearance="outline">
              <mat-label>Tenant ID (e.g. solar-bank)</mat-label>
              <input matInput [(ngModel)]="newTenant.tenantId">
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Tenant Name</mat-label>
              <input matInput [(ngModel)]="newTenant.tenantName">
            </mat-form-field>

            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="color" [(ngModel)]="newTenant.primaryColor" style="width: 40px; height: 40px; border: none; cursor: pointer; border-radius: 4px;">
              <mat-form-field appearance="outline" style="flex: 1;">
                <mat-label>Primary Color</mat-label>
                <input matInput [(ngModel)]="newTenant.primaryColor">
              </mat-form-field>
            </div>

            <div style="display: flex; gap: 8px; align-items: center;">
              <input type="color" [(ngModel)]="newTenant.secondaryColor" style="width: 40px; height: 40px; border: none; cursor: pointer; border-radius: 4px;">
              <mat-form-field appearance="outline" style="flex: 1;">
                <mat-label>Secondary Color</mat-label>
                <input matInput [(ngModel)]="newTenant.secondaryColor">
              </mat-form-field>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
            <button mat-flat-button color="primary" (click)="createTenant()">
              🚀 Create Tenant Theme Profile
            </button>
          </div>
        </mat-expansion-panel>

      </mat-card-content>
    </mat-card>
  `
})
export class ThemeManagerComponent {
  themeService = inject(ThemeService);

  newTenant: TenantThemeConfig = {
    tenantId: '',
    tenantName: '',
    primaryColor: '#FF6B00',
    secondaryColor: '#1A1A1A',
    fontFamily: 'AppCustomFont, Roboto, sans-serif',
    borderRadius: '12px'
  };

  onTenantChange(tenantId: string) {
    this.themeService.selectTenant(tenantId);
  }

  previewTheme() {
    const current = this.themeService.activeTenant();
    if (current) {
      this.themeService.applyTenantTheme(current);
    }
  }

  async saveTheme(tenant: TenantThemeConfig) {
    await this.themeService.updateTenantTheme(tenant);
    alert(`Theme updated successfully for ${tenant.tenantName}!`);
  }

  async createTenant() {
    if (!this.newTenant.tenantId || !this.newTenant.tenantName) {
      alert('Please fill in Tenant ID and Tenant Name');
      return;
    }
    await this.themeService.createTenantTheme(this.newTenant);
    alert(`New tenant theme created and activated: ${this.newTenant.tenantName}`);
    this.newTenant = {
      tenantId: '',
      tenantName: '',
      primaryColor: '#FF6B00',
      secondaryColor: '#1A1A1A',
      fontFamily: 'AppCustomFont, Roboto, sans-serif',
      borderRadius: '12px'
    };
  }
}
