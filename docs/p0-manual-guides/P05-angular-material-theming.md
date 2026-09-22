[← Back to Documentation Index](../index.md)

# P0-05: Manual Developer Guide — Angular Material 3 & Custom Theming

## Overview
This guide provides the complete setup for Angular Material 3, CSS custom variables, Tech Mahindra Impact Red (`#E31837`) branding, and dynamic TTF custom font loading in `libs/shared-theme`.

---

## 1. SCSS Architecture

```
libs/shared-theme/src/styles/
├── _brand.scss          # Primary (#E31837) & Secondary (#58595B) palettes
├── _tokens.scss         # CSS Custom Properties (--mat-sys-primary, --fc-font-family)
├── _material-theme.scss # Angular Material 3 theme definition
├── _overrides.scss      # Material component overrides
└── theme.scss           # Global entry file imported in shell
```

---

## 2. Brand Definitions (`_brand.scss`)

```scss
$primary: #E31837; // Tech Mahindra Impact Red
$secondary: #58595B; // Steel Grey

$primary-palette: (
  50: #fde8ea,
  100: #f9c5cb,
  500: #E31837,
  900: #8a0e21,
);
```

---

## 3. CSS Tokens & Custom Font (`_tokens.scss`)

```scss
@font-face {
  font-family: 'AppCustomFont';
  src: url('/assets/fonts/Outfit-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

:root {
  --fc-font-family: 'AppCustomFont', Roboto, sans-serif;
  --mat-sys-primary: #E31837;
  --mat-sys-secondary: #58595B;
  
  font-family: var(--fc-font-family);
}
```

---

## 4. Theme Service (`theme.service.ts`)

```typescript
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  isDarkMode = signal<boolean>(false);

  toggleDarkMode() {
    this.isDarkMode.update((dark) => !dark);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
  }

  updatePrimaryColor(hex: string) {
    document.documentElement.style.setProperty('--mat-sys-primary', hex);
  }

  updateFontFamily(fontFamily: string) {
    document.documentElement.style.setProperty('--fc-font-family', fontFamily);
  }
}
```
