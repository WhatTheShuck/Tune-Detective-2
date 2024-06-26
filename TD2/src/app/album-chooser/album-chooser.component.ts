import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TrackChooserComponent } from '../track-chooser/track-chooser.component';

export interface Album {
  id: number;
  title: string;
  artist: {
    id: number;
    name: string;
  };
  cover: string;
  release_date: string;
}
@Component({
  selector: 'app-album-chooser',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule], // confused why I don't need JSONP module here, but okay
  templateUrl: './album-chooser.component.html',
  styleUrl: './album-chooser.component.css'
})
export class AlbumChooserComponent {
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AlbumChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public albums: Album[]
    ) {
       this.albums.sort((a, b) => {
      const dateA = new Date(a.release_date);
      const dateB = new Date(b.release_date);
      return dateB.getTime() - dateA.getTime();
    });
  }


  onSelect(album: Album) {
    this.dialogRef.close(album);
    this.dialogRef.afterClosed().subscribe(selectedAlbum => {
      if (selectedAlbum) {
        this.fetchTracks(selectedAlbum.id, selectedAlbum.cover);
      }
    });
  }

  fetchTracks(albumID: number, albumCover: string) {
    const apiUrl = `https://api.deezer.com/album/${albumID}/tracks&output=jsonp`;
    this.http.jsonp(apiUrl, "callback").subscribe(
      (response: any) => {
        const tracks = response.data;
        this.openTrackChooser(tracks, albumCover);
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  openTrackChooser(tracks: any[], albumCover: string) {
    this.dialog.open(TrackChooserComponent, {
      data: {tracks, albumCover},
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
