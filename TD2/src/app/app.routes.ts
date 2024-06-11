import { Routes } from '@angular/router';
import { ReleasesComponent } from './releases/releases.component';
import { AboutComponent } from './about/about.component';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'releases', component: ReleasesComponent },
  { path: 'about', component: AboutComponent },
];
