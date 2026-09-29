import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Screen A — Balance module's primary screen exposed to the Shell.
 * Accessible at: /balance/screen-a (via Shell) or /screen-a (standalone on :3001)
 */
@Component({
  selector: 'fc-balance-screen-a',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="screen-container">
      <mat-card>
        <mat-card-header>
          <mat-icon matCardAvatar color="primary" style="font-size: 32px; width: 32px; height: 32px;">account_balance_wallet</mat-icon>
          <mat-card-title>Balance — Screen A</mat-card-title>
          <mat-card-subtitle>Account Overview &amp; Summary</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content style="margin-top: 24px;">
          <div class="info-grid">
            <div class="info-card">
              <span class="info-label">Available Balance</span>
              <span class="info-value primary">₹ 2,45,000.00</span>
            </div>
            <div class="info-card">
              <span class="info-label">Ledger Balance</span>
              <span class="info-value">₹ 2,50,500.00</span>
            </div>
            <div class="info-card">
              <span class="info-label">Holds</span>
              <span class="info-value warn">₹ 5,500.00</span>
            </div>
            <div class="info-card">
              <span class="info-label">Last Updated</span>
              <span class="info-value muted">{{ lastUpdated }}</span>
            </div>
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-stroked-button color="primary">
            <mat-icon>refresh</mat-icon> Refresh
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>download</mat-icon> Export Statement
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .screen-container {
      max-width: 720px;
    }

    mat-card {
      background-color: var(--fc-color-surface-container) !important;
      color: var(--fc-color-on-surface) !important;
      border: 1px solid var(--fc-sidebar-border-color);
      border-radius: var(--fc-radius-md, 8px);
    }

    mat-card-title {
      color: var(--fc-color-on-surface) !important;
    }

    mat-card-subtitle {
      color: var(--fc-color-on-surface-variant) !important;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: var(--fc-spacing-md, 16px);
    }

    .info-card {
      padding: var(--fc-spacing-md, 16px);
      border-radius: var(--fc-radius-md, 8px);
      background: var(--fc-color-surface-dim);
      border: 1px solid var(--fc-sidebar-border-color);
      display: flex;
      flex-direction: column;
      gap: var(--fc-spacing-xs, 4px);
    }

    .info-label {
      font-size: var(--fc-font-size-xs, 12px);
      font-weight: var(--fc-font-weight-medium, 500);
      color: var(--fc-color-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-value {
      font-size: var(--fc-font-size-xl, 20px);
      font-weight: var(--fc-font-weight-semibold, 600);
      color: var(--fc-color-on-surface);
      font-family: var(--fc-font-family-base, sans-serif);
    }

    .info-value.primary {
      color: var(--fc-color-primary);
    }

    .info-value.warn {
      color: var(--fc-color-error);
    }

    .info-value.muted {
      font-size: var(--fc-font-size-sm, 14px);
      color: var(--fc-color-on-surface-variant);
    }
  `]
})
export class ScreenAComponent {
  lastUpdated = new Date().toLocaleString();
}
