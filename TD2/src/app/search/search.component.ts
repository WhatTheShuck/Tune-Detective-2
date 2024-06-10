import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Artist } from '../artist.interface';
import { ArtistChooserComponent} from '../artist-chooser/artist-chooser.component';
import { AlbumChooserComponent, Album } from '../album-chooser/album-chooser.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, HttpClientModule, MatDialogModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  searchTerm: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) { } // Inject HttpClient

  searchArtist() {
    const apiUrl = `/api/search/artist?q=${this.searchTerm}`;

    this.http.get(apiUrl).subscribe(
      (response: any) => {
        const artists: Artist[] = response.data;
        this.openArtistChooserDialog(artists);
      },
      (error) => {
        // Handle any errors that occur during the request
        console.error('API error:', error);
      }
    );
  }
  openArtistChooserDialog(artists: Artist[]) {
    const dialogRef = this.dialog.open(ArtistChooserComponent, {
      data: artists,
    });

    dialogRef.afterClosed().subscribe(selectedArtist => {
      if (selectedArtist) {
        this.fetchAlbums(selectedArtist);
      }
    });
  }
  fetchAlbums(artistId: number) {
    const apiUrl = `/api/artist/${artistId}/albums`;

    this.http.get<any>(apiUrl).subscribe(
      (response: any) => {
        const albums = response.data;
        this.openAlbumsChooser(albums);
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  openAlbumsChooser(albums: Album[]) {
    this.dialog.open(AlbumChooserComponent, {
      data: albums,
    });
  }
}
