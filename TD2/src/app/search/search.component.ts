import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm: string = '';

  constructor(private http: HttpClient) { } // Inject HttpClient

  searchArtist() {
    const apiUrl = `https://api.deezer.com/search/artist?q=${this.searchTerm}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        // Handle the response data
        console.log('API response:', response);
        // Process the response and update your component's properties or perform any other necessary actions
      },
      (error) => {
        // Handle any errors that occur during the request
        console.error('API error:', error);
      }
    );
  }
}
