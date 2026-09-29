import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'fc-topbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  template: `
    <mat-toolbar class="fc-topbar" color="primary">
      
      <!-- Sidebar Toggle Button -->
      @if (showToggle()) {
        <button mat-icon-button (click)="toggleSidebar.emit()" aria-label="Toggle navigation menu">
          <mat-icon>menu</mat-icon>
        </button>
      }

      <!-- Logo & App Title -->
      <div class="topbar-brand">
        @if (logoUrl()) {
          <img [src]="logoUrl()" alt="Brand Logo" class="brand-logo" />
        }
        <span class="topbar-title">{{ title() }}</span>
      </div>

      <span class="topbar-spacer"></span>

      <!-- Right Hand Actions: Clock, Theme Toggle, User Profile, Logout -->
      <div class="topbar-right-actions">
        
        <!-- Live Date & Time -->
        @if (currentDateTime()) {
          <div class="topbar-clock" [matTooltip]="'Current Server Time'">
            <mat-icon class="clock-icon">schedule</mat-icon>
            <span class="clock-text">{{ currentDateTime() }}</span>
          </div>
        }

        <!-- Dark / Light Mode Toggle -->
        <button mat-icon-button (click)="toggleTheme.emit()" [matTooltip]="isDark() ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
          <mat-icon>{{ isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- User Profile Avatar Icon (Top to Bottom Gradient of Primary & Secondary theme colors) -->
        <div class="topbar-user-avatar" matTooltip="User Profile">
          <mat-icon>person</mat-icon>
        </div>

        <!-- Logout Button -->
        <button mat-icon-button (click)="logout.emit()" matTooltip="Logout">
          <mat-icon>logout</mat-icon>
        </button>

      </div>
    </mat-toolbar>
  `,
  styles: [`
    .fc-topbar {
      z-index: 10;
      box-shadow: var(--fc-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.08));
      display: flex;
      align-items: center;
      padding: 0 var(--fc-spacing-md, 16px);
      background-color: var(--fc-topbar-bg, var(--fc-color-primary)) !important;
      color: var(--fc-topbar-text-color, var(--fc-color-on-primary)) !important;

      button.mat-mdc-icon-button {
        color: var(--fc-topbar-icon-color, var(--fc-topbar-text-color, inherit)) !important;

        .mat-icon {
          color: var(--fc-topbar-icon-color, var(--fc-topbar-text-color, inherit)) !important;
        }
      }
    }

    .topbar-brand {
      display: flex;
      align-items: center;
      gap: var(--fc-spacing-sm, 8px);
      margin-left: var(--fc-spacing-xs, 4px);
    }

    .brand-logo {
      height: 32px;
      width: auto;
      max-width: 140px;
      object-fit: contain;
      transition: filter var(--fc-transition-fast, 150ms ease);
    }

    .topbar-title {
      font-family: var(--fc-font-family-heading, sans-serif);
      font-weight: var(--fc-font-weight-semibold, 600);
      font-size: var(--fc-font-size-lg, 18px);
      white-space: nowrap;
      color: inherit;
    }

    .topbar-spacer {
      flex: 1;
    }

    .topbar-right-actions {
      display: flex;
      align-items: center;
      gap: var(--fc-spacing-sm, 12px);
    }

    .topbar-clock {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--fc-font-family-mono, monospace);
      font-size: var(--fc-font-size-xs, 12px);
      font-weight: var(--fc-font-weight-medium, 500);
      background: rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: var(--fc-radius-full, 9999px);
      white-space: nowrap;
      letter-spacing: 0.5px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
      color: inherit;

      .clock-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
        opacity: 0.9;
        color: inherit;
      }
    }

    .topbar-user-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(
        180deg,
        var(--fc-topbar-avatar-start, var(--fc-color-primary)) 0%,
        var(--fc-topbar-avatar-end, var(--fc-color-secondary)) 100%
      );
      color: var(--fc-topbar-avatar-text-color, #ffffff);
      box-shadow: var(--fc-shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.15));
      border: 2px solid rgba(255, 255, 255, 0.35);
      cursor: pointer;
      transition: transform var(--fc-transition-fast, 150ms ease);

      &:hover {
        transform: scale(1.06);
      }

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        color: var(--fc-topbar-avatar-text-color, #ffffff) !important;
      }
    }
  `]
})
export class TopbarComponent {
  /** Application title */
  title = input<string>('Fusion Portal');

  /** Brand logo image URL */
  logoUrl = input<string | null>(null);

  /** Live date & time string */
  currentDateTime = input<string | null>(null);

  /** Is dark mode active */
  isDark = input<boolean>(false);

  /** Show sidebar toggle hamburger button */
  showToggle = input<boolean>(true);

  /** Emits when sidebar toggle is clicked */
  toggleSidebar = output<void>();

  /** Emits when light/dark theme toggle is clicked */
  toggleTheme = output<void>();

  /** Emits when logout button is clicked */
  logout = output<void>();
}
