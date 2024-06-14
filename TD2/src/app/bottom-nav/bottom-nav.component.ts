import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatIconModule, RouterLink],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  activeRoute: string = this.router.url;

  constructor(private router: Router) {
    // animation transition stuff
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.activeRoute = (event as NavigationEnd).urlAfterRedirects;
      });
  }

  isActiveRoute(route: string): boolean {
    return this.activeRoute === route;
  }
}

