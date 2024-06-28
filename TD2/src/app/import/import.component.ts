import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { db } from '../db';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {

  importTrackedArtists() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = async () => {
          const trackedArtistsJson = reader.result as string;
          const trackedArtists = JSON.parse(trackedArtistsJson);
          await db.trackedArtists.clear();
          await db.trackedArtists.bulkAdd(trackedArtists);
          //this.loadTrackedArtists();
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  }

}
