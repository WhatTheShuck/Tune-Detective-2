import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { NavigationPreferenceService } from './navigation-preference.service';
import { Router, RouterOutlet, RouterModule, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import {MatToolbarModule} from '@angular/material/toolbar';
// import { SwPush } from '@angular/service-worker';
import { SearchComponent } from './search/search.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, RouterModule, BottomNavComponent, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, NgClass, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Tune Detective 2';
  showBottomNav = false;
  showSidebarNav = false;
  isCollapsed = false;
  activeRoute: string = this.router.url;
  private preferenceSubscription?: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationPreferenceService: NavigationPreferenceService,
    private router: Router,
  ) {
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

  ngOnInit() {
  this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
    .subscribe(result => {
      const isMobile = result.matches;
      const initialPreference = isMobile ? 'bottom-nav' : 'sidebar-nav';
      this.navigationPreferenceService.setPreference(initialPreference);
      this.preferenceSubscription = this.navigationPreferenceService.preferenceChanges$.subscribe(
        preference => {
          this.updateNavigation(preference, isMobile);
        }
      );
    });
}
  ngOnDestroy() {
    this.preferenceSubscription?.unsubscribe();
  }

  toggleNavigationPreference() {
    const currentPreference = this.navigationPreferenceService.getPreference();
    const newPreference =
      currentPreference === 'bottom-nav' ? 'sidebar-nav' : 'bottom-nav';
    this.navigationPreferenceService.setPreference(newPreference);
  }

  private updateNavigation(preference: string | null, isMobile = false) {
    const isBottomNavPreferred = preference === 'bottom-nav';
    const isSidebarNavPreferred = preference === 'sidebar-nav';

    if (isMobile) {
      this.showBottomNav = isBottomNavPreferred || preference === null;
      this.showSidebarNav = isSidebarNavPreferred;
    } else {
      this.showBottomNav = isBottomNavPreferred;
      this.showSidebarNav = isSidebarNavPreferred || preference === null;
    }
  }
}
