import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '@fusion-cash-mfe/shared-theme';
import {
  SidebarMenuComponent,
  TopbarComponent,
  FooterComponent,
  MenuItem,
} from '@fusion-cash-mfe/shared-ui';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    MatIconModule,
    SidebarMenuComponent,
    TopbarComponent,
    FooterComponent,
  ],
  selector: 'app-payments-root',
  template: `
    <div class="shell-layout">
      <fc-topbar
        [title]="title"
        [logoUrl]="logoUrl()"
        [currentDateTime]="currentDateTime()"
        [isDark]="isDark"
        (toggleSidebar)="toggleSidebar()"
        (toggleTheme)="toggleTheme()">
      </fc-topbar>

      <div class="shell-main">
        <main class="shell-content">
          <router-outlet></router-outlet>
        </main>
        <fc-footer></fc-footer>
      </div>

      @if (sidebarOpen()) {
        <div class="shell-backdrop" (click)="closeSidebar()" aria-hidden="true"></div>
      }

      <aside class="shell-sidebar" [class.open]="sidebarOpen()" aria-label="Sidebar navigation">
        <div class="sidebar-header">
          <div class="sidebar-brand">
            <img [src]="sidebarLogoUrl()" alt="Logo" class="sidebar-brand-logo" />
            <span class="brand-title">Fusion Portal</span>
          </div>
        </div>
        <div class="sidebar-menu-wrapper">
          <fc-sidebar-menu
            [menuItems]="menuItems"
            [collapsed]="false"
            (menuItemClicked)="closeSidebar()">
          </fc-sidebar-menu>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    .shell-layout { display: flex; flex-direction: column; height: 100vh; position: relative; overflow: hidden; }
    .shell-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .shell-content { flex: 1; padding: var(--fc-spacing-lg, 24px) var(--fc-spacing-xl, 32px); background-color: var(--fc-color-surface); color: var(--fc-color-on-surface); transition: background-color var(--fc-transition-normal, 250ms ease), color var(--fc-transition-normal, 250ms ease); overflow-y: auto; }
    .shell-backdrop { position: fixed; inset: 0; z-index: 999; background-color: rgba(0, 0, 0, 0.4); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); animation: fadeIn var(--fc-transition-fast, 150ms ease-out); cursor: pointer; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .shell-sidebar { position: fixed; top: 0; left: 0; bottom: 0; width: 300px; max-width: 85vw; height: 100vh; z-index: 1000; background-color: var(--fc-sidebar-bg); color: var(--fc-sidebar-text-color); border-right: 1px solid var(--fc-sidebar-border-color); box-shadow: 4px 0 24px rgba(0, 0, 0, 0.22); display: flex; flex-direction: column; transform: translateX(-100%); visibility: hidden; transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1), visibility 300ms cubic-bezier(0.4, 0, 0.2, 1), background-color var(--fc-transition-normal, 250ms ease), color var(--fc-transition-normal, 250ms ease); }
    .shell-sidebar.open { transform: translateX(0); visibility: visible; }
    .sidebar-header { display: flex; flex-direction: column; padding: var(--fc-spacing-md, 16px); border-bottom: 2px solid var(--fc-color-primary); }
    .sidebar-brand { display: flex; flex-direction: column; align-items: center; text-align: center; width: 100%; }
    .sidebar-brand-logo { width: 100%; height: auto; max-height: 52px; object-fit: contain; object-position: center; margin-bottom: var(--fc-spacing-xs, 8px); }
    .brand-title { font-family: var(--fc-font-family-heading, sans-serif); font-size: var(--fc-font-size-md, 16px); font-weight: var(--fc-font-weight-bold, 700); color: var(--fc-sidebar-text-color); letter-spacing: 0.5px; text-align: center; }
    .sidebar-menu-wrapper { flex: 1; overflow-y: auto; }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  protected title = 'Payments Standalone';
  private themeService = inject(ThemeService);

  logoUrl = this.themeService.activeLogoUrl;
  sidebarLogoUrl = this.themeService.activeSidebarLogoUrl;
  sidebarOpen = signal(false);
  currentDateTime = signal<string>('');
  private timerId: ReturnType<typeof setInterval> | null = null;

  readonly menuItems: MenuItem[] = [
    { label: 'Payments Home', icon: 'home', route: '/home' },
    { label: 'Screen B', icon: 'payment', route: '/screen-b' },
  ];

  ngOnInit(): void {
    this.updateClock();
    this.timerId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) clearInterval(this.timerId);
  }

  private updateClock(): void {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    this.currentDateTime.set(`${dd}-${mm}-${yyyy}: ${hh}:${min}:${ss}`);
  }

  openSidebar(): void { this.sidebarOpen.set(true); }
  closeSidebar(): void { this.sidebarOpen.set(false); }
  toggleSidebar(): void { this.sidebarOpen.update(v => !v); }
  toggleTheme(): void { this.themeService.toggleTheme(); }
  get isDark(): boolean { return this.themeService.isDark(); }
}
