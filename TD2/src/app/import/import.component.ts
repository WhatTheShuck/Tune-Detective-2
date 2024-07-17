import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportChoiceComponent } from '../export-choice/export-choice.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { ImportSheetComponent } from './import-sheet/import-sheet.component';
import { db } from '../db';
import { decompress } from 'compress-json';

@Component({
  selector: 'app-import',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ExportChoiceComponent, ImportSheetComponent, MatButtonModule ],
  templateUrl: './import.component.html',
  styleUrl: './import.component.css'
})
export class ImportComponent {
   readonly dialog = inject(MatDialog);
  readonly bottomSheet = inject(MatBottomSheet);

  openDialog() {
    const dialogRef = this.dialog.open(ExportChoiceComponent, {
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
      let importedData: any;

      switch (format) {
        case 'file':
          importedData = await this.importFromFile();
          break;
        case 'qrcode':
          importedData = await this.importFromQRCode();
          break;
        case 'string':
          importedData = await this.importFromString();
          break;
        default:
          console.error('Unsupported import format');
          return;
      }

      if (importedData) {
        await this.loadData(content, importedData);
        console.log("success");
      }
    } catch (error) {
      console.error('Error during import:', error);
    }
  }

  private async loadData(content: string, data: string): Promise<void> {
    const decompressedData = decompress(JSON.parse(data));
    switch (content) {
      case 'artists':
        await db.trackedArtists.clear();
        await db.trackedArtists.bulkAdd(decompressedData.trackedArtists);
        break;
      case 'settings':
        await db.settings.clear();
        await db.settings.bulkAdd(decompressedData.settings);
        break;
      case 'all':
        await db.trackedArtists.clear();
        await db.settings.clear();
        await db.trackedArtists.bulkAdd(decompressedData.trackedArtists);
        await db.settings.bulkAdd(decompressedData.settings);
        break;
      default:
        console.error('Unsupported import content');
    }
  }

  private importFromFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      fileInput.onchange = async (event: Event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        } else {
          reject(new Error('No file selected'));
        }
      };
      fileInput.click();
    });
  }

   private async importFromString(): Promise<string> {
    const base64String = prompt('Please enter the import string:');
    if (!base64String) {
      throw new Error('No string provided');
    }
    return atob(base64String);
  }

  private importFromQRCode(): Promise<string> {
    return new Promise((resolve, reject) => {
      const bottomSheetRef = this.bottomSheet.open(ImportSheetComponent);
      bottomSheetRef.afterDismissed().subscribe(result => {
        if (result) {
          resolve(result);
        } else {
          reject('QR code scanning was cancelled');
        }
      });
    });
  }
}
