import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

/**
 * Screen B — Payments module's primary screen exposed to the Shell.
 * Accessible at: /payments/screen-b (via Shell) or /screen-b (standalone on :3002)
 */
@Component({
  selector: 'fc-payments-screen-b',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  template: `
    <div class="screen-container">
      <mat-card>
        <mat-card-header>
          <mat-icon matCardAvatar color="primary" style="font-size: 32px; width: 32px; height: 32px;">payments</mat-icon>
          <mat-card-title>Payments — Screen B</mat-card-title>
          <mat-card-subtitle>Recent Transactions</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content style="margin-top: 24px;">
          <!-- Transaction list -->
          <div class="txn-list">
            @for (txn of transactions; track txn.id) {
              <div class="txn-row">
                <div class="txn-info">
                  <mat-icon class="txn-icon" [style.color]="txn.type === 'credit' ? 'var(--fc-color-primary)' : 'var(--fc-color-error)'">
                    {{ txn.type === 'credit' ? 'arrow_downward' : 'arrow_upward' }}
                  </mat-icon>
                  <div>
                    <span class="txn-desc">{{ txn.description }}</span>
                    <span class="txn-date">{{ txn.date }}</span>
                  </div>
                </div>
                <div class="txn-amount" [class.credit]="txn.type === 'credit'" [class.debit]="txn.type === 'debit'">
                  {{ txn.type === 'credit' ? '+' : '-' }} ₹ {{ txn.amount | number:'1.2-2' }}
                </div>
              </div>
            }
          </div>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-stroked-button color="primary">
            <mat-icon>filter_list</mat-icon> Filter
          </button>
          <button mat-flat-button color="primary">
            <mat-icon>add</mat-icon> New Payment
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

    .txn-list {
      display: flex;
      flex-direction: column;
      gap: var(--fc-spacing-xs, 4px);
    }

    .txn-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--fc-spacing-sm, 8px) var(--fc-spacing-md, 16px);
      border-radius: var(--fc-radius-sm, 4px);
      transition: background var(--fc-transition-fast, 150ms ease);
    }

    .txn-row:hover {
      background: var(--fc-color-surface-dim);
    }

    .txn-info {
      display: flex;
      align-items: center;
      gap: var(--fc-spacing-sm, 8px);
    }

    .txn-info > div {
      display: flex;
      flex-direction: column;
    }

    .txn-desc {
      font-weight: var(--fc-font-weight-medium, 500);
      color: var(--fc-color-on-surface);
    }

    .txn-date {
      font-size: var(--fc-font-size-xs, 12px);
      color: var(--fc-color-on-surface-variant);
    }

    .txn-amount {
      font-weight: var(--fc-font-weight-semibold, 600);
      font-family: var(--fc-font-family-base, sans-serif);
    }

    .txn-amount.credit {
      color: var(--fc-color-primary);
    }

    .txn-amount.debit {
      color: var(--fc-color-error);
    }

    .txn-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `]
})
export class ScreenBComponent {
  /** Demo transaction data */
  transactions = [
    { id: 1, description: 'Salary Credit — TechM', date: '29 Sep 2026', amount: 125000, type: 'credit' },
    { id: 2, description: 'Electricity Bill — MSEB', date: '28 Sep 2026', amount: 3200, type: 'debit' },
    { id: 3, description: 'Vendor Payment — Infra Co.', date: '27 Sep 2026', amount: 48500, type: 'debit' },
    { id: 4, description: 'Client Payment Received', date: '26 Sep 2026', amount: 87000, type: 'credit' },
    { id: 5, description: 'SIP — Mutual Fund', date: '25 Sep 2026', amount: 15000, type: 'debit' },
  ];
}
