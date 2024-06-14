import { Component, OnInit } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout'
import { NavigationPreferenceService } from './navigation-preference.service';
import { RouterOutlet, RouterModule } from '@angular/router';
// import { SwPush } from '@angular/service-worker';
import { SearchComponent } from './search/search.component';
import { SidebarNavComponent } from './sidebar-nav/sidebar-nav.component';
import { BottomNavComponent } from './bottom-nav/bottom-nav.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, RouterModule, SidebarNavComponent, BottomNavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Tune Detective 2';
  showBottomNav = false;
  showSidebarNav = false;
  private preferenceSubscription?: Subscription;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private navigationPreferenceService: NavigationPreferenceService
  ) {}

  ngOnInit() {
    this.preferenceSubscription = this.navigationPreferenceService.preferenceChanges$.subscribe(
      preference => {
        this.updateNavigation(preference);
      }
    );

    this.breakpointObserver
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .subscribe(result => {
        const isMobile = result.matches;
        const preferenceOverride = this.navigationPreferenceService.getPreference();

        this.updateNavigation(preferenceOverride, isMobile);
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
    if (preference === 'bottom-nav') {
      this.showBottomNav = true;
      this.showSidebarNav = false;
    } else if (preference === 'sidebar-nav') {
      this.showBottomNav = false;
      this.showSidebarNav = true;
    } else {
      this.showBottomNav = isMobile;
      this.showSidebarNav = !isMobile;
    }
  }
}
