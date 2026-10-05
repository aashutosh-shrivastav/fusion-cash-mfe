# Cross-MFE Communication Architecture — Design Document

> **System**: FusionCash Management Micro Frontend Platform  
> **Target Scope**: `shell` (Host), `balance` (Remote), `payments` (Remote), and future MFEs  
> **Shared Library**: `libs/shared-core`  
> **Status**: Approved Architecture Specification  

---

## 1. Executive Summary

In a Webpack Module Federation architecture, Micro Frontends (MFEs) must maintain **loose coupling** while supporting **seamless interaction**. Over-coupling MFEs creates a distributed monolith, while zero communication degrades user experience.

This document presents a comprehensive evaluation of communication mechanisms for **FusionCash MFE**, tailored to our specific banking domain use cases:
1. **User Context & Session Synchronization** (Shell ↔ Remotes)
2. **Cross-MFE Action Navigation & Deep Linking** (Balance ↔ Payments)
3. **Global Notifications & Toast System** (Remotes → Shell)
4. **Multi-Tab Session Sync & Logout Guard** (Cross-Tab Browser Windows)

---

## 2. Domain Use Cases in FusionCash MFE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  SHELL HOST                                     │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Topbar / User Badge   │  │ Language Switcher    │  │ Toast Notifications  │  │
│  └──────────┬────────────┘  └──────────┬───────────┘  └──────────▲───────────┘  │
└─────────────┼──────────────────────────┼─────────────────────────┼──────────────┘
              │ User Changed             │ Language Changed        │ Post Notification
              ▼                          ▼                         │
┌───────────────────────────┐  ┌───────────────────────────┐       │
│    BALANCE MFE (3001)     │  │    PAYMENTS MFE (3002)    │───────┘
│  - Portfolio Summary      │  │  - Wire Transfer Form     │
│  - "Pay Now" Action ──────┼──►  - Pre-filled State      │
└───────────────────────────┘  └───────────────────────────┘
```

### Use Case 1: User Context & Session Synchronization
- **Scenario**: When a user logs in, switches tenant profiles, or token expires in the Shell Host, all loaded remote MFEs (`balance`, `payments`) must immediately react to updated user signals without page reloads.

### Use Case 2: Cross-MFE Action Navigation with State
- **Scenario**: A user views an unpaid invoice card in `balance` MFE and clicks **"Pay Now"**. The application must navigate to `payments` MFE's transfer route (`/payments/transfer`) while passing pre-filled payload (`recipientName`, `accountNumber`, `amount`, `reference`).

### Use Case 3: Global Notification & Toast System
- **Scenario**: `payments` MFE completes a wire transfer API call. It needs to emit a success notification event so the Shell Host's global Toast/Snackbar service renders a top-right alert without `payments` MFE embedding its own toast UI.

### Use Case 4: Multi-Tab Browser Session Lock
- **Scenario**: A user opens FusionCash in Tab A and Tab B. When the user logs out in Tab A, Tab B must automatically invalidate state and redirect to `/auth/login`.

---

## 3. Evaluation of Communication Approaches

---

### Approach A: Shared RxJS / Signals Event Bus (`libs/shared-core`) ⭐ *RECOMMENDED PRIMARY*

#### Overview
A singleton Angular service in `libs/shared-core` shared via Webpack Module Federation (`shared: { "@fusion-cash-mfe/shared-core": { singleton: true } }`). It leverages RxJS `Subject` / `BehaviorSubject` or Angular `signal` stores to publish and subscribe to strongly typed event streams.

#### Code Pattern
```typescript
// libs/shared-core/src/lib/communication/mfe-event-bus.service.ts
import { Injectable, signal } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';

export type MfeEventType = 
  | 'USER_CONTEXT_CHANGED'
  | 'NAVIGATE_TO_MFE'
  | 'SHOW_TOAST'
  | 'BALANCE_UPDATED';

export interface MfeEvent<T = unknown> {
  type: MfeEventType;
  source: 'shell' | 'balance' | 'payments';
  payload: T;
  timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class MfeEventBusService {
  private eventStream$ = new Subject<MfeEvent>();

  /** Publish an event to all listening MFEs */
  emit<T>(type: MfeEventType, source: 'shell' | 'balance' | 'payments', payload: T): void {
    this.eventStream$.next({
      type,
      source,
      payload,
      timestamp: Date.now()
    });
  }

  /** Listen for specific event type */
  on<T>(type: MfeEventType): Observable<MfeEvent<T>> {
    return this.eventStream$.asObservable().pipe(
      filter((e): e is MfeEvent<T> => e.type === type)
    );
  }
}
```

#### Publisher Example (Payments MFE):
```typescript
this.eventBus.emit('SHOW_TOAST', 'payments', {
  severity: 'success',
  message: 'Wire transfer of $5,000 to ACME Corp initiated successfully.'
});
```

#### Subscriber Example (Shell Host):
```typescript
this.eventBus.on<ToastPayload>('SHOW_TOAST').subscribe(event => {
  this.toastService.show(event.payload.message, event.payload.severity);
});
```

#### Pros & Cons
- ✅ **Pros**: 100% strongly typed in TypeScript, zero external dependencies, native Angular RxJS/Signals integration, high performance.
- ❌ **Cons**: Requires both Shell and Remotes to run within the same Angular runtime version and share `@fusion-cash-mfe/shared-core` as a singleton.

---

### Approach B: Native Browser `CustomEvent` / `DOM EventTarget`

#### Overview
Uses native browser DOM events (`window.dispatchEvent` and `window.addEventListener`). MFEs communicate through the global `window` object without referencing any shared library code.

#### Code Pattern
```typescript
// Strongly-typed wrapper helper
export class NativeEventBus {
  static dispatch<T>(eventName: string, detail: T): void {
    const customEvent = new CustomEvent(eventName, {
      detail,
      bubbles: true,
      cancelable: true
    });
    window.dispatchEvent(customEvent);
  }

  static listen<T>(eventName: string, handler: (detail: T) => void): () => void {
    const listener = (event: Event) => {
      const custom = event as CustomEvent<T>;
      handler(custom.detail);
    };
    window.addEventListener(eventName, listener);
    // Return unsubscribe cleanup function to prevent memory leaks
    return () => window.removeEventListener(eventName, listener);
  }
}
```

#### Pros & Cons
- ✅ **Pros**: Framework-agnostic (works if a React or Vue MFE is added in the future), total decoupling, zero dependency on shared Angular code.
- ❌ **Cons**: Higher memory leak risk if `removeEventListener` is omitted on Angular `ngOnDestroy`, payload typing requires manual casting, events do not retain state history (no `BehaviorSubject` equivalent).

---

### Approach C: `BroadcastChannel` API (Multi-Tab Communication)

#### Overview
The web `BroadcastChannel` API allows communication across different browser windows, tabs, or iframes sharing the same origin (`http://localhost:4200`).

#### Code Pattern
```typescript
// libs/shared-core/src/lib/communication/multi-tab-sync.service.ts
import { Injectable, OnDestroy, signal } from '@angular/core';

export interface CrossTabMessage {
  action: 'LOGOUT' | 'SESSION_REFRESH' | 'THEME_CHANGED';
  payload?: unknown;
}

@Injectable({ providedIn: 'root' })
export class MultiTabSyncService implements OnDestroy {
  private channel = new BroadcastChannel('fusion_cash_sync_channel');

  constructor() {
    this.channel.onmessage = (event: MessageEvent<CrossTabMessage>) => {
      this.handleCrossTabEvent(event.data);
    };
  }

  postMessage(action: CrossTabMessage['action'], payload?: unknown): void {
    this.channel.postMessage({ action, payload });
  }

  private handleCrossTabEvent(msg: CrossTabMessage): void {
    if (msg.action === 'LOGOUT') {
      console.warn('[MultiTabSync] Logout detected in another tab. Invalidating session...');
      window.location.href = '/auth/login';
    }
  }

  ngOnDestroy(): void {
    this.channel.close();
  }
}
```

#### Pros & Cons
- ✅ **Pros**: Works across multiple browser tabs/windows, native web API, zero backend needed for tab sync.
- ❌ **Cons**: Irrelevant for same-window inter-component communication; designed specifically for cross-tab events.

---

### Approach D: Angular Router State & Query/Matrix Parameters

#### Overview
Passes transient parameters through Angular's router navigation (`router.navigate(['/payments'], { state: { ... } })` or query parameters `?recipient=...`).

#### Code Pattern
```typescript
// Balance MFE: Trigger navigation to Payments MFE with payload
this.router.navigate(['/payments/transfer'], {
  state: {
    recipientName: 'Acme Logistics',
    recipientAccount: 'ACC-998877',
    amount: 12500,
    reference: 'INV-2026-004'
  }
});

// Payments MFE: Read navigation state
constructor(private router: Router) {
  const currentNav = this.router.getCurrentNavigation();
  const state = currentNav?.extras?.state;
  if (state) {
    this.populateForm(state);
  }
}
```

#### Pros & Cons
- ✅ **Pros**: Perfect for deep linking and user-driven navigation workflows, bookmarkable/shareable (when using query params), native Angular Router support.
- ❌ **Cons**: Transient `history.state` is lost on browser refresh (unless query params are used). Not suitable for continuous telemetry or toasts.

---

## 4. Architectural Comparison & Trade-off Matrix

| Metric | Approach A: Shared RxJS/Signal EventBus | Approach B: CustomEvents (DOM) | Approach C: BroadcastChannel | Approach D: Router State / Query Params |
|:---|:---|:---|:---|:---|
| **Primary Scope** | Same-window Shell ↔ Remote | Same-window Polyglot MFEs | Multi-tab Browser Windows | Cross-MFE Navigation |
| **Type Safety** | 🟢 100% Strict TypeScript | 🟡 Manual Interface Casting | 🟡 Manual Interface Casting | 🟡 Partial (NavigationExtras) |
| **Memory Leak Risk** | 🟢 Low (RxJS `takeUntilDestroyed`) | 🔴 High (missing `removeEventListener`) | 🟢 Low (`ngOnDestroy` channel.close) | 🟢 Zero (handled by Router) |
| **State Retention** | 🟢 High (`BehaviorSubject`/Signals) | 🔴 Zero (fire-and-forget) | 🔴 Zero (fire-and-forget) | 🟡 Transient (route lifetime) |
| **Framework Agnostic** | 🔴 No (Angular Singleton) | 🟢 Yes (Vanilla JS/React/Vue) | 🟢 Yes (Native Web API) | 🔴 No (Angular Router) |
| **Multi-Tab Support** | 🔴 No | 🔴 No | 🟢 Yes (100% Web Native) | 🔴 No |
| **Developer DX** | 🟢 Outstanding | 🟡 Moderate | 🟢 Good | 🟢 Outstanding |

---

## 5. Decision Matrix: Which Approach to Use When?

```
                     Is the communication event...
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   Across Browser Tabs?                             Within Same Tab?
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐                             Is it a route navigation
│   APPROACH C    │                             with user data payload?
│ BroadcastChannel│                                        │
└─────────────────┘                       ┌────────────────┴────────────────┐
                                          ▼                                 ▼
                                       YES                                  NO
                                        │                                   │
                                        ▼                                   ▼
                               ┌─────────────────┐                Is MFE framework-agnostic?
                               │   APPROACH D    │                          │
                               │  Router State   │                ┌─────────┴─────────┐
                               └─────────────────┘                ▼                   ▼
                                                                 YES                  NO
                                                                  │                   │
                                                                  ▼                   ▼
                                                         ┌─────────────────┐ ┌─────────────────┐
                                                         │   APPROACH B    │ │   APPROACH A    │
                                                         │  CustomEvents   │ │ Shared EventBus │
                                                         └─────────────────┘ └─────────────────┘
```

### Direct Guidelines for `fusion-cash-mfe`:

1. **Use Approach A (Shared RxJS/Signals EventBus in `shared-core`)** for 90% of internal MFE messaging:
   - User profile & tenant changes
   - Global loading spinners & progress bars
   - Toast/Snackbar notifications
   - Inter-MFE telemetry & audit logs

2. **Use Approach D (Angular Router State & Query Params)** for navigation actions:
   - "Pay Invoice" in `balance` → Opens Transfer form in `payments`
   - "View Audit History" in `payments` → Opens Account Details in `balance`

3. **Use Approach C (BroadcastChannel)** exclusively for:
   - Multi-tab security logouts
   - Synchronizing dark/light mode across multiple open browser tabs

4. **Use Approach B (CustomEvents)** ONLY if introducing non-Angular MFEs (e.g. React micro-app) in future releases.

---

## 6. Complete Implementation Blueprint for `libs/shared-core`

To adopt this architecture, the following production-ready files are implemented in `libs/shared-core`:

### 1. `shared-core/src/lib/communication/mfe-event.model.ts`
```typescript
export type MfeEventType =
  | 'USER_CONTEXT_CHANGED'
  | 'NAVIGATE_TO_ROUTE'
  | 'SHOW_NOTIFICATION'
  | 'BALANCE_UPDATED'
  | 'PAYMENT_COMPLETED';

export interface UserContextPayload {
  userId: string;
  username: string;
  tenantId: string;
  roles: string[];
}

export interface NavigationPayload {
  targetMfe: 'shell' | 'balance' | 'payments';
  path: string;
  queryParams?: Record<string, string>;
  state?: Record<string, unknown>;
}

export interface NotificationPayload {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  durationMs?: number;
}

export interface MfeEventPayloadMap {
  USER_CONTEXT_CHANGED: UserContextPayload;
  NAVIGATE_TO_ROUTE: NavigationPayload;
  SHOW_NOTIFICATION: NotificationPayload;
  BALANCE_UPDATED: { accountId: string; newBalance: number };
  PAYMENT_COMPLETED: { transactionId: string; amount: number; recipient: string };
}

export interface MfeEvent<K extends MfeEventType = MfeEventType> {
  type: K;
  source: 'shell' | 'balance' | 'payments';
  payload: MfeEventPayloadMap[K];
  timestamp: number;
}
```

### 2. `shared-core/src/lib/communication/mfe-event-bus.service.ts`
```typescript
import { Injectable, signal } from '@angular/core';
import { Subject, Observable, filter, map } from 'rxjs';
import { MfeEvent, MfeEventType, MfeEventPayloadMap } from './mfe-event.model';

@Injectable({ providedIn: 'root' })
export class MfeEventBusService {
  private eventStream$ = new Subject<MfeEvent<any>>();
  private lastEventSignal = signal<MfeEvent<any> | null>(null);

  /** Signal exposing the last emitted cross-MFE event */
  readonly lastEvent = this.lastEventSignal.asReadonly();

  /**
   * Emit a strongly-typed event across MFEs
   */
  emit<K extends MfeEventType>(
    type: K,
    source: 'shell' | 'balance' | 'payments',
    payload: MfeEventPayloadMap[K]
  ): void {
    const event: MfeEvent<K> = {
      type,
      source,
      payload,
      timestamp: Date.now()
    };
    this.lastEventSignal.set(event);
    this.eventStream$.next(event);
  }

  /**
   * Listen to events of a specific type
   */
  on<K extends MfeEventType>(type: K): Observable<MfeEvent<K>> {
    return this.eventStream$.asObservable().pipe(
      filter((e): e is MfeEvent<K> => e.type === type)
    );
  }
}
```

---

## 7. Summary & Verification Matrix

- ✅ **Recommended Pattern**: Shared RxJS/Signals EventBus (`MfeEventBusService` in `libs/shared-core`).
- ✅ **Navigation Pattern**: Angular `Router.navigate()` with `NavigationExtras.state`.
- ✅ **Multi-Tab Security**: `BroadcastChannel` for instant cross-tab session invalidation.
- ✅ **Decoupling Guarantee**: Zero direct imports between `balance` and `payments` MFEs; all interaction flows through `shared-core` contracts.
