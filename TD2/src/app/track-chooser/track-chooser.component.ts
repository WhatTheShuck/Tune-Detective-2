import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

interface Track {
  id: number;
  title: string;
  artist: string;
  preview: string;
}

interface DialogData {
  tracks: Track[];
  albumCover: string;
}

@Component({
  selector: 'app-track-chooser',
  standalone: true,
  imports: [],
  templateUrl: './track-chooser.component.html',
  styleUrl: './track-chooser.component.css'
})
export class TrackChooserComponent {
    constructor(
    public dialogRef: MatDialogRef<TrackChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onClose() {
    this.dialogRef.close();
  }

  playPreview(previewUrl: string) {
    const audio = new Audio(previewUrl);
    audio.play();
  }

}
