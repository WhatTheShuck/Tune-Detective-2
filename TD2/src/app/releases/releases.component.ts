import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { Album } from '../album-chooser/album-chooser.component';
import { TrackChooserComponent } from '../track-chooser/track-chooser.component';
import { CacheService } from '../cache.service';


@Component({
  selector: 'app-releases',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule, HttpClientJsonpModule, TrackChooserComponent],
  templateUrl: './releases.component.html',
  styleUrl: './releases.component.css'
})
export class ReleasesComponent implements OnInit {
   releases: Album[] = [];
  private fetchCount = 0;
  private totalArtists = 0;
  isLoading = false;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private cacheService: CacheService
  ) {}

  ngOnInit() {
    this.loadTrackedArtists();
  }

  loadTrackedArtists(forceRefresh = false) {
    this.isLoading = true;
    const trackedArtistsJson = localStorage.getItem('trackedArtists');
    if (trackedArtistsJson) {
      const trackedArtistIds = JSON.parse(trackedArtistsJson);
      this.totalArtists = trackedArtistIds.length;
      this.fetchCount = 0;
      this.releases = [];
      trackedArtistIds.forEach((artistId: number) => {
        this.fetchRecentAlbum(artistId, forceRefresh);
      });
    } else {
      this.isLoading = false;
    }
  }

  fetchRecentAlbum(artistId: number, forceRefresh = false) {
    const cacheKey = `artist_${artistId}_albums`;
    const cachedData = forceRefresh ? null : this.cacheService.get(cacheKey);

    if (cachedData) {
      this.processAlbums(cachedData, artistId);
    } else {
      const apiUrl = `https://api.deezer.com/artist/${artistId}/albums&output=jsonp`;
      this.http.jsonp(apiUrl, 'callback').subscribe(
        (response: any) => {
          this.cacheService.set(cacheKey, response.data);
          this.processAlbums(response.data, artistId);
        },
        (error) => {
          console.error('API error fetching albums:', error);
          this.checkAndSortReleases();
        }
      );
    }
  }

  processAlbums(albums: Album[], artistId: number) {
    albums.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
    if (albums.length > 0) {
      const mostRecentAlbumId = albums[0].id;
      this.fetchAlbumDetails(mostRecentAlbumId, artistId);
    } else {
      this.checkAndSortReleases();
    }
  }

  fetchAlbumDetails(albumId: number, artistId: number, forceRefresh = false) {
    const cacheKey = `album_${albumId}_details`;
    const cachedData = forceRefresh ? null : this.cacheService.get(cacheKey);

    if (cachedData) {
      this.processAlbumDetails(cachedData);
    } else {
      const albumDetailsUrl = `https://api.deezer.com/album/${albumId}&output=jsonp`;
      this.http.jsonp(albumDetailsUrl, 'callback').subscribe(
        (albumDetails: any) => {
          this.cacheService.set(cacheKey, albumDetails);
          this.processAlbumDetails(albumDetails);
        },
        (error) => {
          console.error('API error fetching album details:', error);
          this.checkAndSortReleases();
        }
      );
    }
  }

  processAlbumDetails(albumDetails: any) {
    const album: Album = {
      id: albumDetails?.id,
      title: albumDetails?.title || 'Unknown Title',
      cover: albumDetails?.cover_medium || 'default-cover-url.jpg',
      release_date: albumDetails?.release_date || 'Unknown Date',
      artist: {
        id: albumDetails?.artist?.id,
        name: albumDetails?.artist?.name || 'Unknown Artist'
      }
    };
    this.releases.push(album);
    this.checkAndSortReleases();
  }

  checkAndSortReleases() {
    this.fetchCount++;
    if (this.fetchCount === this.totalArtists) {
      this.sortReleases();
      this.isLoading = false;
    }
  }

  sortReleases() {
    this.releases.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  }

  refreshReleases() {
    this.loadTrackedArtists(true);
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
