// libs/shared-i18n/src/lib/pipes/translate.pipe.ts

import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure so pipe updates dynamically when language signal changes
})
export class TranslatePipe implements PipeTransform {
  private languageService = inject(LanguageService);

  transform(key: string, params?: Record<string, string | number>): string {
    if (!key) return '';
    return this.languageService.translate(key, params);
  }
}
