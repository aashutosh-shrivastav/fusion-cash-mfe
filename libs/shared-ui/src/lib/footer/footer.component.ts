import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'fc-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="fc-footer">
      {{ copyrightText() }}
    </footer>
  `,
  styles: [`
    .fc-footer {
      padding: var(--fc-spacing-sm, 8px) var(--fc-spacing-xl, 32px);
      background-color: var(--fc-footer-bg, var(--fc-color-surface-container, #f5f5f5)) !important;
      border-top: 1px solid var(--fc-sidebar-border-color, rgba(0, 0, 0, 0.12));
      font-size: var(--fc-font-size-xs, 12px);
      color: var(--fc-footer-text-color, var(--fc-color-on-surface-variant, #616161)) !important;
      text-align: center;
      flex-shrink: 0;
    }
  `]
})
export class FooterComponent {
  /** Copyright / footer text */
  copyrightText = input<string>(`© ${new Date().getFullYear()} Fusion Portal — All rights reserved.`);
}
