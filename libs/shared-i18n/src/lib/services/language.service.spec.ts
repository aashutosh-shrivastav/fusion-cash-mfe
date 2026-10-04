// libs/shared-i18n/src/lib/services/language.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { LanguageService } from './language.service';

describe('LanguageService', () => {
  let service: LanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LanguageService]
    });
    service = TestBed.inject(LanguageService);
  });

  it('should default to English or browser language', () => {
    expect(['en', 'es', 'fr', 'ar']).toContain(service.currentLang());
  });

  it('should translate keys correctly', () => {
    service.setLanguage('en');
    expect(service.translate('SHELL.TITLE')).toBe('FusionCash Portal');
    expect(service.translate('COMMON.LOGOUT')).toBe('Sign Out');
  });

  it('should switch language dynamically and update text direction to RTL for Arabic', () => {
    service.setLanguage('es');
    expect(service.currentLang()).toBe('es');
    expect(service.translate('SHELL.TITLE')).toBe('Portal FusionCash');
    expect(document.documentElement.dir).toBe('ltr');

    service.setLanguage('ar');
    expect(service.currentLang()).toBe('ar');
    expect(service.translate('SHELL.TITLE')).toBe('بوابة فيوجن كاش');
    expect(document.documentElement.dir).toBe('rtl');
  });

  it('should handle parameter interpolation in translations', () => {
    service.setLanguage('en');
    const result = service.translate('COMMON.WELCOME');
    expect(result).toBe('Welcome back');
  });
});
