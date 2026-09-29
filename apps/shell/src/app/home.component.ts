import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

/**
 * Shell Home — placeholder greeting page.
 * This will be the default landing page when the user navigates to /home.
 */
@Component({
  selector: 'fc-home',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  template: `
    <div class="home-container">
      <mat-card>
        <mat-card-content class="greeting-content">
          <mat-icon class="greeting-icon" color="primary">rocket_launch</mat-icon>
          <h1 class="greeting-title">Welcome to Fusion Portal</h1>
          <p class="greeting-subtitle">
            Your unified cash management platform. Select a module from the sidebar to get started.
          </p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .home-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .greeting-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--fc-spacing-3xl, 64px) var(--fc-spacing-2xl, 48px);
    }

    .greeting-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: var(--fc-spacing-lg, 24px);
    }

    .greeting-title {
      font-family: var(--fc-font-family-heading, 'Inter', sans-serif);
      font-size: var(--fc-font-size-3xl, 30px);
      font-weight: var(--fc-font-weight-bold, 700);
      color: var(--fc-color-on-surface, #212121);
      margin-bottom: var(--fc-spacing-sm, 8px);
    }

    .greeting-subtitle {
      font-size: var(--fc-font-size-md, 16px);
      color: var(--fc-color-on-surface-variant, #616161);
      max-width: 400px;
    }
  `]
})
export class HomeComponent {}
