// shared-core/src/lib/interceptors/loading.state.ts

import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingStateService {
  private _activeRequests = signal<number>(0);

  /** Signal reflecting if at least one HTTP request is active */
  readonly isLoading = computed(() => this._activeRequests() > 0);

  /** Active HTTP request counter */
  readonly activeRequestsCount = this._activeRequests.asReadonly();

  show(): void {
    this._activeRequests.update(c => c + 1);
  }

  hide(): void {
    this._activeRequests.update(c => Math.max(0, c - 1));
  }

  reset(): void {
    this._activeRequests.set(0);
  }
}
