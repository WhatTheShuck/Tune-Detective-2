import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { Artist } from '../artist.interface';
import { Album } from '../album-chooser/album-chooser.component';
import { TrackChooserComponent } from '../track-chooser/track-chooser.component';

@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule, HttpClientJsonpModule, TrackChooserComponent],
  templateUrl: './releases.component.html',
  styleUrl: './releases.component.css'
})
export class ReleasesComponent implements OnInit {
  releases: Album[] = [];
  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadTrackedArtists();
  }

  loadTrackedArtists() {
    const trackedArtistsJson = localStorage.getItem('trackedArtists');
    if (trackedArtistsJson) {
      const trackedArtistIds = JSON.parse(trackedArtistsJson);
      trackedArtistIds.forEach((artistId: number) => {
        this.fetchRecentAlbum(artistId);
      });
    }
  }

  fetchRecentAlbum(artistId: number) {
    const apiUrl = `https://api.deezer.com/artist/${artistId}/albums&output=jsonp`;

    this.http.jsonp(apiUrl, 'callback').subscribe(
      (response: any) => {
        const albums: Album[] = response.data;
        albums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        if (albums.length > 0) {
          this.releases.push(albums[0]);
        }
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  openTrackChooser(albumID: number, albumCover: string) {
    const apiUrl = `https://api.deezer.com/album/${albumID}/tracks&output=jsonp`;
    this.http.jsonp(apiUrl, 'callback').subscribe(
      (response: any) => {
        const tracks = response.data;
        this.dialog.open(TrackChooserComponent, {
          data: { tracks, albumCover },
        });
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  exportTrackedArtists() {
    const trackedArtistsJson = localStorage.getItem('trackedArtists');
    if (trackedArtistsJson) {
      const trackedArtists = JSON.parse(trackedArtistsJson);
      const blob = new Blob([JSON.stringify(trackedArtists)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'tracked-artists.json';
      link.click();
    }
  }

  importTrackedArtists() {
    // Trigger file input dialog
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const trackedArtistsJson = reader.result as string;
          const trackedArtists = JSON.parse(trackedArtistsJson);
          // Save the imported tracked artists to local storage
          localStorage.setItem('trackedArtists', JSON.stringify(trackedArtists));
          this.loadTrackedArtists();
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }
}
