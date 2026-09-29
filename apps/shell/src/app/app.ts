import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
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
  imports: [
    RouterModule,
    MatIconModule,
    SidebarMenuComponent,
    TopbarComponent,
    FooterComponent,
  ],
  selector: 'fc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  protected title = 'Fusion Portal';
  private themeService = inject(ThemeService);

  /** Dynamic theme-aware logo URL (light vs dark) */
  logoUrl = computed(() =>
    this.themeService.isDark()
      ? 'assets/images/logo/dark/logo.png'
      : 'assets/images/logo/light/logo.png'
  );

  /** Overlay sidebar open state (starts closed by default) */
  sidebarOpen = signal(false);

  /** Live updating date & time signal (Format: DD-MM-YYYY: HH:MM:SS) */
  currentDateTime = signal<string>('');

  /** Interval reference for live clock cleanup */
  private timerId: ReturnType<typeof setInterval> | null = null;

  /** Sidebar menu configuration */
  readonly menuItems: MenuItem[] = [
    {
      label: 'Home',
      icon: 'apps',
      route: '/home',
    },
    {
      label: 'Theme Manager',
      icon: 'apps',
      route: '/theme-manager',
    },
    {
      label: 'Balance',
      icon: 'apps',
      children: [
        { label: 'Screen A', icon: 'apps', route: '/balance/screen-a' },
      ],
    },
    {
      label: 'Payments',
      icon: 'apps',
      children: [
        { label: 'Screen B', icon: 'apps', route: '/payments/screen-b' },
      ],
    },
  ];

  ngOnInit(): void {
    this.updateClock();
    this.timerId = setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /** Update live date & time string in format: DD-MM-YYYY: HH:MM:SS */
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

  /** Open the sidebar drawer */
  openSidebar(): void {
    this.sidebarOpen.set(true);
  }

  /** Close the sidebar drawer */
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  /** Toggle sidebar open state */
  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  /** Toggle light/dark theme */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /** Check if dark mode is active */
  get isDark(): boolean {
    return this.themeService.isDark();
  }
}
