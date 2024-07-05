import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportChoiceComponent } from '../export-choice/export-choice.component';
import { db } from '../db';
import { decompress } from 'compress-json';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ExportChoiceComponent ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ExportChoiceComponent, {
      //width: '300px',
      data: { mode: 'import' }
    });
  }

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
