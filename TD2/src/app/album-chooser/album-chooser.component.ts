import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TrackChooserComponent } from '../track-chooser/track-chooser.component';

export interface Album {
  id: number;
  title: string;
  cover: string;
  release_date: string;
}
@Component({
  selector: 'app-album-chooser',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatDialogModule, HttpClientModule],
  templateUrl: './album-chooser.component.html',
  styleUrl: './album-chooser.component.css'
})
export class AlbumChooserComponent {
  constructor(
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
    this.dialogRef.close(album.id);
    this.dialogRef.afterClosed().subscribe(selectedAlbum => {
      if (selectedAlbum) {
        this.fetchTracks(selectedAlbum);
      }
    });
  }

  fetchTracks(albumID: number) {

  }

  openTrackChooser() {

  }

  onClose() {
    this.dialogRef.close();
  }

}
