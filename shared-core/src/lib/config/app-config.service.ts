import { Injectable, Inject, Optional, signal, computed, EnvironmentProviders, makeEnvironmentProviders, provideAppInitializer, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AppConfig, ENVIRONMENT_CONFIG, DEFAULT_APP_CONFIG } from './app-config.model';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private _config = signal<AppConfig>(DEFAULT_APP_CONFIG);

  /** Readonly reactive signal of application config */
  readonly config = this._config.asReadonly();

  /** Environment name signal */
  readonly environment = computed(() => this._config().environment);

  /** API Base URL signal */
  readonly apiBaseUrl = computed(() => this._config().apiBaseUrl);

  /** Dynamic Microservices base URL dictionary signal (1 Microservice = 1 URL, supports N Swaggers) */
  readonly microservices = computed(() => this._config().microservices || {});

  /** Version signal */
  readonly version = computed(() => this._config().version);

  /** Feature Flags signal */
  readonly featureFlags = computed(() => this._config().featureFlags);

  constructor(
    @Optional() @Inject(ENVIRONMENT_CONFIG) initialConfig?: AppConfig
  ) {
    if (initialConfig) {
      this.updateConfig(initialConfig);
    }
  }

  /**
   * Directly update or merge application configuration at runtime
   */
  updateConfig(partialConfig: Partial<AppConfig>): void {
    this._config.update(prev => ({
      ...prev,
      ...partialConfig,
      microservices: { ...(prev.microservices || {}), ...(partialConfig.microservices || {}) },
      auth: { ...prev.auth, ...(partialConfig.auth || {}) },
      featureFlags: { ...prev.featureFlags, ...(partialConfig.featureFlags || {}) }
    }));
  }

  /**
   * Retrieve dynamic base URL endpoint for a specific backend microservice
   * (e.g. 'balanceService', 'paymentsService', 'userService')
   */
  getMicroserviceUrl(serviceName: string, fallback?: string): string {
    const services = this.microservices();
    return services[serviceName] || fallback || this.apiBaseUrl();
  }

  /**
   * Check if a feature flag is enabled
   */
  isFeatureEnabled(flag: string): boolean {
    return !!this._config().featureFlags[flag];
  }

  /**
   * Construct full API URL endpoint for a specific microservice and path
   */
  getApiUrl(endpoint: string, microserviceName?: string): string {
    const base = microserviceName ? this.getMicroserviceUrl(microserviceName) : this.apiBaseUrl();
    const cleanBase = base.replace(/\/$/, '');
    const cleanPath = endpoint.replace(/^\//, '');
    return `${cleanBase}/${cleanPath}`;
  }
}

/**
 * Loads dynamic runtime app configuration from JSON asset before app startup
 */
export function initializeAppConfigFactory(http: HttpClient, appConfigService: AppConfigService, configUrl = '/assets/config/app-config.json') {
  return async (): Promise<void> => {
    try {
      const remoteConfig = await firstValueFrom(http.get<Partial<AppConfig>>(configUrl));
      if (remoteConfig) {
        appConfigService.updateConfig(remoteConfig);
        console.log(`[AppConfigService] Loaded runtime config from ${configUrl}`, remoteConfig);
      }
    } catch (err) {
      console.warn(`[AppConfigService] Failed to load ${configUrl}, using environment defaults`, err);
    }
  };
}

/**
 * Provider helper for registering AppConfig with custom static values or runtime fetch
 */
export function provideAppConfig(configUrl = '/assets/config/app-config.json'): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideAppInitializer(() => {
      const http = inject(HttpClient);
      const appConfigService = inject(AppConfigService);
      return initializeAppConfigFactory(http, appConfigService, configUrl)();
    })
  ]);
}
