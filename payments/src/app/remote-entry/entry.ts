import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule],
  selector: 'app-payments-entry',
  template: `
    <div style="padding: var(--fc-spacing-xl); background-color: var(--fc-color-surface-container); border: 1px solid var(--fc-color-outline-variant); border-radius: var(--fc-radius-lg); box-shadow: var(--fc-shadow-md);">
      <h2 style="font-family: var(--fc-font-family-heading); color: var(--fc-color-on-surface); font-size: var(--fc-font-size-2xl); margin-bottom: var(--fc-spacing-md);">Payments MFE</h2>
      <p style="font-family: var(--fc-font-family-base); color: var(--fc-color-on-surface-variant); font-size: var(--fc-font-size-md);">This is the Payments remote application loaded successfully!</p>
      <div *ngIf="data" style="margin-top: var(--fc-spacing-md);">
        <h3 style="font-family: var(--fc-font-family-heading); color: var(--fc-color-on-surface); font-size: var(--fc-font-size-lg);">Data from API:</h3>
        <pre style="font-family: var(--fc-font-family-mono); background-color: var(--fc-color-surface-dim); padding: var(--fc-spacing-sm); border-radius: var(--fc-radius-sm);">{{ data | json }}</pre>
      </div>
      <button (click)="fetchData()" style="margin-top: var(--fc-spacing-lg); padding: var(--fc-spacing-sm) var(--fc-spacing-md); background-color: var(--fc-color-secondary); color: var(--fc-color-on-secondary); border: none; border-radius: var(--fc-radius-md); font-family: var(--fc-font-family-base); font-weight: var(--fc-font-weight-medium); cursor: pointer; transition: background-color var(--fc-transition-fast);">
        Fetch Data from Dummy API
      </button>
    </div>
  `,
})
export class RemoteEntryComponent {
  data: any = null;

  async fetchData() {
    try {
      const response = await fetch('http://localhost:4000/api/payments/data');
      this.data = await response.json();
    } catch (e) {
      console.error('Error fetching data', e);
      this.data = { error: 'Failed to fetch data. Is the dummy server running?' };
    }
  }
}
