import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

/**
 * Represents a single menu item in the sidebar.
 * Supports one level of nesting via `children`.
 */
export interface MenuItem {
  /** Display label */
  label: string;
  /** Material icon name (e.g. 'home', 'palette') */
  icon?: string;
  /** Router link — if set, clicking navigates to this route */
  route?: string;
  /** Child items — renders a collapsible sub-menu */
  children?: MenuItem[];
}

/**
 * Generic collapsible sidebar menu component.
 *
 * Usage:
 *   <fc-sidebar-menu
 *     [menuItems]="items"
 *     [collapsed]="isCollapsed"
 *     (menuItemClicked)="onMenuClick($event)">
 *   </fc-sidebar-menu>
 */
@Component({
  selector: 'fc-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <nav class="sidebar-nav" [class.collapsed]="collapsed()">

      <!-- Brand header (optional) -->
      @if (showBrand()) {
        <div class="sidebar-brand" *ngIf="!collapsed()">
          <span class="brand-text">Fusion Portal</span>
        </div>
        <div class="sidebar-brand sidebar-brand--icon" *ngIf="collapsed()">
          <mat-icon color="primary">apps</mat-icon>
        </div>
      }

      <!-- Menu items -->
      <mat-nav-list>
        @for (item of menuItems(); track item.label) {

          <!-- Item WITH children (collapsible group) -->
          @if (item.children && item.children.length > 0) {
            <a mat-list-item
               class="menu-parent"
               (click)="toggleGroup(item.label)">
              <mat-icon matListItemIcon>{{ item.icon || 'apps' }}</mat-icon>
              <span matListItemTitle *ngIf="!collapsed()">{{ item.label }}</span>
              <mat-icon *ngIf="!collapsed()"
                        matListItemMeta
                        class="expand-icon"
                        [class.expanded]="isGroupOpen(item.label)">
                keyboard_arrow_down
              </mat-icon>
            </a>

            <!-- Children -->
            <div class="submenu" *ngIf="isGroupOpen(item.label) && !collapsed()">
              @for (child of item.children; track child.label) {
                <a mat-list-item
                   class="menu-child"
                   [routerLink]="child.route"
                   routerLinkActive="active-link"
                   (click)="onItemClicked(child)">
                  <mat-icon matListItemIcon>{{ child.icon || 'apps' }}</mat-icon>
                  <span matListItemTitle>{{ child.label }}</span>
                </a>
              }
            </div>
          }

          <!-- Item WITHOUT children (direct link) -->
          @if (!item.children || item.children.length === 0) {
            <a mat-list-item
               [routerLink]="item.route"
               routerLinkActive="active-link"
               [routerLinkActiveOptions]="{ exact: item.route === '/' }"
               (click)="onItemClicked(item)">
              <mat-icon matListItemIcon>{{ item.icon || 'apps' }}</mat-icon>
              <span matListItemTitle *ngIf="!collapsed()">{{ item.label }}</span>
            </a>
          }
        }
      </mat-nav-list>
    </nav>
  `,
  styles: [`
    .sidebar-nav {
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      transition: width var(--fc-transition-normal, 250ms ease);
    }

    .sidebar-brand {
      padding: var(--fc-spacing-md, 16px) var(--fc-spacing-md, 16px) var(--fc-spacing-sm, 8px);
      border-bottom: 2px solid var(--fc-color-primary, #E31837);
      margin-bottom: var(--fc-spacing-sm, 8px);
    }

    .sidebar-brand--icon {
      display: flex;
      justify-content: center;
      padding: var(--fc-spacing-md, 16px) var(--fc-spacing-xs, 4px) var(--fc-spacing-sm, 8px);
    }

    .brand-text {
      font-family: var(--fc-font-family-heading, 'Inter', sans-serif);
      font-size: var(--fc-font-size-lg, 18px);
      font-weight: var(--fc-font-weight-bold, 700);
      color: var(--fc-color-primary, #E31837);
    }

    .menu-parent {
      cursor: pointer;
    }

    .expand-icon {
      margin-left: auto;
      transition: transform var(--fc-transition-fast, 150ms ease);
      font-size: 20px;
      width: 20px;
      height: 20px;
      font-family: 'Material Icons' !important;
      font-style: normal;
      font-weight: normal;
      text-transform: none;
      line-height: 1;
      letter-spacing: normal;
      white-space: nowrap;
      direction: ltr;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .expand-icon.expanded {
      transform: rotate(180deg);
    }

    .submenu {
      padding-left: var(--fc-spacing-md, 16px);
    }

    .menu-child {
      font-size: var(--fc-font-size-sm, 14px);
    }

    .active-link {
      background-color: color-mix(in srgb, var(--fc-color-primary, #E31837) 12%, transparent) !important;
      color: var(--fc-color-primary, #E31837) !important;
      border-right: 3px solid var(--fc-color-primary, #E31837);
    }

    .collapsed .brand-text,
    .collapsed span[matListItemTitle] {
      display: none;
    }

    .collapsed .submenu {
      display: none;
    }
  `]
})
export class SidebarMenuComponent {
  /** Menu items to render */
  menuItems = input.required<MenuItem[]>();

  /** Whether the sidebar is collapsed (icon-only mode) */
  collapsed = input<boolean>(false);

  /** Whether to show internal brand header */
  showBrand = input<boolean>(false);

  /** Emitted when a leaf menu item is clicked */
  menuItemClicked = output<MenuItem>();

  /** Tracks which collapsible groups are open */
  private openGroups = signal<Set<string>>(new Set());

  /** Toggle a collapsible group open/closed */
  toggleGroup(label: string): void {
    this.openGroups.update(current => {
      const next = new Set(current);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  }

  /** Check if a group is currently open */
  isGroupOpen(label: string): boolean {
    return this.openGroups().has(label);
  }

  /** Emit event when a leaf item is clicked */
  onItemClicked(item: MenuItem): void {
    this.menuItemClicked.emit(item);
  }
}
