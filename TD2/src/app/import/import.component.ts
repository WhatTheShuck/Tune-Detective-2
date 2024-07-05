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

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleImport(result.content, result.format);
      }
    });
  }

  private async handleImport(content: string, format: string) {
    try {
      //const data = await this.getData(content);
      //if (!data) return;
      //const decompressedData = decompress(data);
      //let importResultData: ImportResultData;

      switch (format) {
        case 'file':
          //const filename = this.exportToFile(content, compressedData);
          //exportResultData = { type: 'file', filename };
          break;
        case 'qrcode':
          // open camera
          //exportResultData = { type: 'qrcode', data: compressedData.toString() };
          break;
        case 'string':
          //const exportString = this.exportToString(compressedData);
          //exportResultData = { type: 'string', data: exportString};
          break;
        default:
          console.error('Unsupported import format');
          return;
      }

      //this.openResultDialog(exportResultData);
    } catch (error) {
      console.error('Error during export:', error);
    }
  }

  private async loadData(content: string, data: any): Promise<any> {
    switch (content) {
      case 'artists':
        return { trackedArtists: await db.trackedArtists.toArray() };
      case 'settings':
        return { settings: await db.settings.toArray() };
      case 'all':
        return {
          trackedArtists: await db.trackedArtists.toArray(),
          settings: await db.settings.toArray()
        };
      default:
        console.error('Unsupported export content');
        return null;
    }
  }

  importFromFile(content: string, data: any) {
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

  private importFromString(base64String: string): any {
    const uncompressedData = atob(base64String);
    return uncompressedData;
  }

  private importFromQRCode() {

  }
}
