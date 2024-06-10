import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Artist } from '../artist.interface';

interface Track {
  id: number;
  title: string;
  artist: Artist;
  preview: string;
}

interface DialogData {
  tracks: Track[];
  albumCover: string;
}


@Component({
  selector: 'app-track-chooser',
  standalone: true,
  imports: [MatIconModule, MatListModule, MatDialogModule, CommonModule, MatButtonModule],
  templateUrl: './track-chooser.component.html',
  styleUrl: './track-chooser.component.css'
})
export class TrackChooserComponent  {
  private audioRef: HTMLAudioElement | null = null;
  constructor(
  public dialogRef: MatDialogRef<TrackChooserComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {this.dialogRef.beforeClosed().subscribe(() => {
      this.stopPreview();
    });}


  onClose() {
    this.dialogRef.close();
    this.stopPreview();
  }

 playPreview(previewUrl: string) {
    this.stopPreview();
    this.audioRef = new Audio(previewUrl);
    this.audioRef.play();
  }

  stopPreview() {
    if (this.audioRef) {
      this.audioRef.pause();
      this.audioRef.currentTime = 0;
      this.audioRef = null;
    }
  }
}
