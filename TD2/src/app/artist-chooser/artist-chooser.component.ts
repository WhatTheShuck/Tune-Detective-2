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
    toggleTrackArtist(artist: Artist, event: Event) {
    event.stopPropagation();
    const trackedArtists = this.getTrackedArtists();
    const index = trackedArtists.indexOf(artist.id);
    if (index > -1) {
      trackedArtists.splice(index, 1);
    } else {
      trackedArtists.push(artist.id);
    }
    this.saveTrackedArtists(trackedArtists);
  }

  isArtistTracked(artist: Artist): boolean {
    const trackedArtists = this.getTrackedArtists();
    return trackedArtists.includes(artist.id);
  }

  private getTrackedArtists(): number[] {
    const trackedArtistsJson = localStorage.getItem('trackedArtists');
    return trackedArtistsJson ? JSON.parse(trackedArtistsJson) : [];
  }

  private saveTrackedArtists(trackedArtists: number[]) {
    localStorage.setItem('trackedArtists', JSON.stringify(trackedArtists));
  }}
