import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ExportChoiceComponent } from './export-choice/export-choice.component';
import { db } from '../db';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ExportChoiceComponent],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ExportChoiceComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleExport(result.content, result.format);
      }
    });
  }


  private handleExport(content: string, format: string) {
    switch (format) {
      case 'file':
        if (content === 'artists') {
          this.exportTrackedArtistsToFile();
        } else {
          // Handle other content types for file export
        }
        break;
      case 'qrcode':
        // Handle QR code export
        break;
      case 'string':
        // Handle string export
        break;
      default:
        console.error('Unsupported export format');
    }
  }

  async exportTrackedArtistsToFile() {
    const trackedArtists = await db.trackedArtists.toArray();
    const blob = new Blob([JSON.stringify(trackedArtists)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tracked-artists.json';
    link.click();
  }
}


