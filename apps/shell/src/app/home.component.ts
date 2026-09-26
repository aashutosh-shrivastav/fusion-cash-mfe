import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { ThemeManagerComponent } from './theme-manager.component';

@Component({
  selector: 'fc-home',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ThemeManagerComponent
  ],
  template: `
    <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 24px;">
      
      <!-- Runtime Tenant Theme Manager -->
      <fc-theme-manager></fc-theme-manager>
      
      <!-- Primary Card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Welcome to Fusion Portal</mat-card-title>
          <mat-card-subtitle>Angular Material 3 Theming Demo</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content style="margin-top: 16px;">
          <p style="margin-bottom: 24px;">
            This home page uses standard <strong>Angular Material</strong> components to demonstrate the 
            Impact Red & Steel Grey theme. Switch between Light and Dark mode using the sidebar to see 
            how the material components dynamically adjust!
          </p>
          
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <button mat-flat-button color="primary">Primary Action</button>
            <button mat-stroked-button color="primary">Stroked Button</button>
            <button mat-button color="primary">Text Button</button>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Secondary Card with Chips -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>System Features</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 16px;">
          <mat-chip-set>
            <mat-chip color="primary" highlighted>MFE Architecture</mat-chip>
            <mat-chip color="primary" highlighted>Angular 19</mat-chip>
            <mat-chip color="primary" highlighted>Design Tokens</mat-chip>
            <mat-chip color="primary" highlighted>Runtime Theming</mat-chip>
          </mat-chip-set>
        </mat-card-content>
      </mat-card>

      <!-- Typography Card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Typography Samples</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 16px; display: flex; flex-direction: column; gap: 12px;">
          <h1 class="mat-headline-1">Headline 1</h1>
          <h2 class="mat-headline-2">Headline 2</h2>
          <h3 class="mat-headline-3">Headline 3</h3>
          <p class="mat-body-1">This is a standard body paragraph (mat-body-1). It shows how text flows with the configured font family and color inside a material card.</p>
          <p class="mat-caption">This is caption text (mat-caption).</p>
        </mat-card-content>
      </mat-card>

      <!-- Form & Calendar Card -->
      <mat-card>
        <mat-card-header>
          <mat-card-title>Forms & Datepicker</mat-card-title>
        </mat-card-header>
        <mat-card-content style="margin-top: 16px; display: flex; flex-direction: column; gap: 16px; max-width: 400px;">
          
          <mat-form-field appearance="outline" color="primary">
            <mat-label>Username</mat-label>
            <input matInput placeholder="Enter your username">
          </mat-form-field>

          <mat-form-field appearance="outline" color="primary">
            <mat-label>Choose a date</mat-label>
            <input matInput [matDatepicker]="picker">
            <mat-hint>MM/DD/YYYY</mat-hint>
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

        </mat-card-content>
      </mat-card>

    </div>
  `
})
export class HomeComponent {}
