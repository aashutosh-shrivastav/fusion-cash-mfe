// shared-core/src/lib/config/app-config.service.spec.ts

import { TestBed } from '@angular/core/testing';
import { AppConfigService } from './app-config.service';

describe('AppConfigService', () => {
  let service: AppConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigService]
    });
    service = TestBed.inject(AppConfigService);
  });

  it('should initialize with default configuration', () => {
    expect(service.config()).toBeDefined();
    expect(service.environment()).toBe('development');
    expect(service.apiBaseUrl()).toBe('http://localhost:3000/api/v1');
  });

  it('should update configuration dynamically', () => {
    service.updateConfig({
      apiBaseUrl: 'https://qa-api.fusioncash.com/api/v1',
      environment: 'qa'
    });

    expect(service.apiBaseUrl()).toBe('https://qa-api.fusioncash.com/api/v1');
    expect(service.environment()).toBe('qa');
  });

  it('should evaluate feature flags correctly', () => {
    expect(service.isFeatureEnabled('enableNewPaymentsUI')).toBe(true);
    expect(service.isFeatureEnabled('nonExistentFlag')).toBe(false);
  });

  it('should construct API endpoints properly', () => {
    const url = service.getApiUrl('/accounts');
    expect(url).toBe('http://localhost:3000/api/v1/accounts');
  });
});
