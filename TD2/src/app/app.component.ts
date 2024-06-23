import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { NavigationPreferenceService } from './navigation-preference.service';
import { RouterOutlet, RouterModule } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
// import { SwPush } from '@angular/service-worker';
import { SearchComponent } from './search/search.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
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
  imports: [RouterOutlet, SearchComponent, RouterModule, SidebarNavComponent, BottomNavComponent, MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatListModule, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Tune Detective 2';
  showBottomNav = false;
  showSidebarNav = false;
  isCollapsed = true;
  private preferenceSubscription?: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationPreferenceService: NavigationPreferenceService
  ) {}

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
