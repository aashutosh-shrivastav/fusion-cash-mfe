import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@fusion-cash-mfe/shared-theme';

@Component({
  imports: [RouterModule],
  selector: 'fc-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'shell';
  themeService = inject(ThemeService);
}
