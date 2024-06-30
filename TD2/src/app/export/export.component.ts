import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { ExportChoiceComponent } from './export-choice/export-choice.component';
import { db } from '../db';
import * as QRCode from 'angularx-qrcode';
import { compress } from 'compress-json';

const QR_CODE_SIZE_LIMIT = 1000; // in bytes & pretty arbitrary. Could be adjusted, depending on qrcode version, etc

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
    const data = await this.getData(content);
    if (!data) return;
    const compressedData = compress(data);

    switch (format) {
      case 'file':
          this.exportToFile(content, compressedData);
          // Handle other content types for file export
        break;
      case 'qrcode':
        if (this.isQRCodeSizeExceeded(compressedData)) {
          this.showQRCodeSizeExceededWarning();
        } else {
          this.exportToQRCode(compressedData);
        }
        break;
      case 'string':
        this.exportToString(compressedData);
        break;
      default:
        console.error('Unsupported export format');
    }
  }

  private isQRCodeSizeExceeded(data: any): boolean {
    return new Blob([data]).size > QR_CODE_SIZE_LIMIT;
  }

  private showQRCodeSizeExceededWarning() {
    alert('The database is too large for a QR code. Please use the file export option instead.');
  }

  private async getData(content: string): Promise<any> {
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

  private async exportToFile(content: string, data: any) {
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export_${content}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private async exportToQRCode(data: any) {

  }

  private exportToString(data: any) {

  }
}


