import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationPreferenceService {
  private preferenceSubject = new BehaviorSubject<'bottom-nav' | 'sidebar-nav' | null>(null);
  preferenceChanges$ = this.preferenceSubject.asObservable();

  getPreference() {
    return this.preferenceSubject.getValue();
  }

  setPreference(preference: 'bottom-nav' | 'sidebar-nav') {
    this.preferenceSubject.next(preference);
  }
}
