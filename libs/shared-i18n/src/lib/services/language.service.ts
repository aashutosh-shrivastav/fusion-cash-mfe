// libs/shared-i18n/src/lib/services/language.service.ts

import { Injectable, signal, computed } from '@angular/core';
import { SupportedLanguage, LanguageInfo, SUPPORTED_LANGUAGES, TranslationDictionary } from '../models/i18n.model';

import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import frTranslations from '../translations/fr.json';
import arTranslations from '../translations/ar.json';

const STORAGE_KEY = 'fc_language_pref';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private _currentLang = signal<SupportedLanguage>(this.getInitialLanguage());
  private _translations = signal<Record<SupportedLanguage, TranslationDictionary>>({
    en: enTranslations as TranslationDictionary,
    es: esTranslations as TranslationDictionary,
    fr: frTranslations as TranslationDictionary,
    ar: arTranslations as TranslationDictionary
  });

  /** Current active language code signal */
  readonly currentLang = this._currentLang.asReadonly();

  /** List of supported languages */
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  /** Current active language info signal */
  readonly activeLanguageInfo = computed<LanguageInfo>(() => {
    const code = this._currentLang();
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0]
    );
  });

  constructor() {
    // Apply initial text direction (LTR / RTL)
    this.updateDocumentDirection(this._currentLang());
  }

  private getInitialLanguage(): SupportedLanguage {
    const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
    if (saved && ['en', 'es', 'fr', 'ar'].includes(saved)) {
      return saved;
    }
    // Detect browser language default
    const browserLang = navigator.language?.substring(0, 2).toLowerCase();
    if (browserLang === 'es') return 'es';
    if (browserLang === 'fr') return 'fr';
    if (browserLang === 'ar') return 'ar';
    return 'en';
  }

  setLanguage(lang: SupportedLanguage): void {
    if (!['en', 'es', 'fr', 'ar'].includes(lang)) return;
    this._currentLang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    this.updateDocumentDirection(lang);
  }

  private updateDocumentDirection(lang: SupportedLanguage): void {
    const langInfo = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = langInfo?.direction || 'ltr';
  }

  /**
   * Translate dot-delimited key path (e.g. 'SHELL.TITLE')
   */
  translate(key: string, params?: Record<string, string | number>): string {
    const lang = this._currentLang();
    const dictionary = this._translations()[lang] || this._translations()['en'];
    
    let result: unknown = dictionary;
    const parts = key.split('.');

    for (const part of parts) {
      if (result && typeof result === 'object' && part in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[part];
      } else {
        result = null;
        break;
      }
    }

    if (typeof result !== 'string') {
      // Fallback to English if translation missing in target language
      let fallbackResult: unknown = this._translations()['en'];
      for (const part of parts) {
        if (fallbackResult && typeof fallbackResult === 'object' && part in (fallbackResult as Record<string, unknown>)) {
          fallbackResult = (fallbackResult as Record<string, unknown>)[part];
        } else {
          fallbackResult = key;
          break;
        }
      }
      result = typeof fallbackResult === 'string' ? fallbackResult : key;
    }

    let translatedString = result as string;

    if (params) {
      for (const [paramKey, value] of Object.entries(params)) {
        translatedString = translatedString.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(value));
      }
    }

    return translatedString;
  }
}
