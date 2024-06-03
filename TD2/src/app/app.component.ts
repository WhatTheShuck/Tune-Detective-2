import { Component } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
// import { SwPush } from '@angular/service-worker';
import { SearchComponent } from './search/search.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SearchComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'TD2';
}
