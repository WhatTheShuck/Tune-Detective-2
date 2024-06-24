import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Artist } from '../artist.interface';
import { db, TrackedArtist } from '../db';

@Component({
  selector: 'app-artist-chooser',
  standalone: true,
  imports: [MatDialogModule, MatListModule, MatButtonModule, CommonModule, MatIconModule],
  templateUrl: './artist-chooser.component.html',
  styleUrl: './artist-chooser.component.css'
})
export class ArtistChooserComponent implements OnInit {
  selectedArtist!: Artist;
  trackedArtistIds: Set<number> = new Set();

  constructor(
    public dialogRef: MatDialogRef<ArtistChooserComponent>,
    @Inject(MAT_DIALOG_DATA) public artists: Artist[]
  ) {}

  async ngOnInit() {
    await this.loadTrackedArtists();
  }

  async loadTrackedArtists() {
    const trackedArtists = await db.trackedArtists.toArray();
    this.trackedArtistIds = new Set(trackedArtists.map(artist => artist.id));
  }

  onSelect(artist: Artist) {
    this.dialogRef.close(artist.id);
  }

  onCancel() {
    this.dialogRef.close();
  }

  async toggleTrackArtist(artist: Artist, event: Event) {
    event.stopPropagation();
    if (artist.id === undefined) {
      console.error('Artist ID is undefined');
      return;
    }
    if (this.trackedArtistIds.has(artist.id)) {
      await db.trackedArtists.delete(artist.id);
      this.trackedArtistIds.delete(artist.id);
    } else {
      const trackedArtist: TrackedArtist = {
        id: artist.id,
        name: artist.name
      };
      await db.trackedArtists.add(trackedArtist);
      this.trackedArtistIds.add(artist.id);
    }
  }

  isArtistTracked(artist: Artist): boolean {
    return artist.id !== undefined && this.trackedArtistIds.has(artist.id);
  }
}
