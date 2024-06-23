import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule ],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.css'
})
export class SidebarNavComponent {
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

