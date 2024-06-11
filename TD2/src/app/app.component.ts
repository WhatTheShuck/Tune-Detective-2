import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
// import { SwPush } from '@angular/service-worker';
import { SearchComponent } from './search/search.component';
import { Artist } from './artist.interface';
import { ArtistChooserComponent } from './artist-chooser/artist-chooser.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Tune Detective 2';

}
