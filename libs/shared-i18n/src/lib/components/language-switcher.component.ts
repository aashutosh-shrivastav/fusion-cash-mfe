// libs/shared-i18n/src/lib/components/language-switcher.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageService } from '../services/language.service';
import { SupportedLanguage } from '../models/i18n.model';

@Component({
  selector: 'fc-language-switcher',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule, MatIconModule],
  template: `
    <button mat-button [matMenuTriggerFor]="langMenu" class="lang-trigger-btn" aria-label="Select Language">
      <span class="flag-icon">{{ activeLang().flag }}</span>
      <span class="lang-code">{{ activeLang().code.toUpperCase() }}</span>
      <mat-icon class="dropdown-icon">expand_more</mat-icon>
    </button>

    <mat-menu #langMenu="matMenu" class="lang-menu-panel">
      <button 
        mat-menu-item 
        *ngFor="let lang of supportedLangs" 
        (click)="selectLanguage(lang.code)"
        [class.selected-lang]="lang.code === activeLang().code">
        <span class="flag-icon">{{ lang.flag }}</span>
        <span>{{ lang.nativeName }}</span>
        <span class="lang-english-name">({{ lang.name }})</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .lang-trigger-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 500;
      color: inherit;
    }

    .flag-icon {
      font-size: 1.1rem;
      margin-right: 4px;
    }

    .lang-code {
      font-size: 0.85rem;
      letter-spacing: 0.5px;
    }

    .dropdown-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      opacity: 0.7;
    }

    .selected-lang {
      font-weight: 600;
      background-color: rgba(var(--fc-primary-rgb, 14, 165, 233), 0.1);
    }

    .lang-english-name {
      font-size: 0.8rem;
      opacity: 0.6;
      margin-left: 6px;
    }
  `]
})
export class LanguageSwitcherComponent {
  private languageService = inject(LanguageService);

  readonly supportedLangs = this.languageService.supportedLanguages;
  readonly activeLang = this.languageService.activeLanguageInfo;

  selectLanguage(lang: SupportedLanguage): void {
    this.languageService.setLanguage(lang);
  }
}
