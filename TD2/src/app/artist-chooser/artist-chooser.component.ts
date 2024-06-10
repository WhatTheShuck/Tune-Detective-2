import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Artist } from '../artist.interface';

@Component({
  selector: 'app-artist-chooser',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './artist-chooser.component.html',
  styleUrl: './artist-chooser.component.css'
})
export class ArtistChooserComponent {
  selectedArtist!: Artist;

  constructor(
    public dialogRef: MatDialogRef<ArtistChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public artists: Artist[]
  ) { }

  onSelect(artist: Artist) {
    this.dialogRef.close(artist.id);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
