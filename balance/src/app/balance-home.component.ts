import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/**
 * Balance MFE Home — ONLY accessible when running standalone on port 3001.
 * NOT exposed to the Shell via Module Federation.
 * Purpose: standalone development landing page for the balance team.
 */
@Component({
  selector: 'fc-balance-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div style="max-width: 600px; margin: 48px auto; padding: 0 24px;">
      <mat-card>
        <mat-card-header>
          <mat-icon matCardAvatar color="primary" style="font-size: 32px; width: 32px; height: 32px;">account_balance</mat-icon>
          <mat-card-title>Balance MFE — Standalone</mat-card-title>
          <mat-card-subtitle>Running independently on port 3001</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content style="margin-top: 24px;">
          <p style="color: var(--fc-color-on-surface-variant, #616161); margin-bottom: 16px;">
            This home page is only visible when the Balance MFE is served standalone.
            It is <strong>not</strong> exposed to the Shell application.
          </p>
          <p style="color: var(--fc-color-on-surface-variant, #616161);">
            Use this page for isolated development and testing of balance features.
          </p>
        </mat-card-content>

        <mat-card-actions align="end">
          <button mat-flat-button color="primary" routerLink="/screen-a">
            <mat-icon>arrow_forward</mat-icon> Go to Screen A
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `
})
export class BalanceHomeComponent {}
