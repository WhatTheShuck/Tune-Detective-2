import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ExportChoiceComponent } from '../export-choice/export-choice.component';
import { ExportDialogComponent, ExportResultData } from './export-dialog/export-dialog.component';
import { db } from '../db';
import { compress } from 'compress-json';

const QR_CODE_SIZE_LIMIT = 1000; // in bytes & pretty arbitrary. Could be adjusted, depending on qrcode version, etc

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, ExportChoiceComponent, ExportDialogComponent],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ExportChoiceComponent, {
      data: { mode: 'export'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.handleExport(result.content, result.format);
      }
    });
  }


  private async handleExport(content: string, format: string) {
    try {
      const data = await this.getData(content);
      if (!data) return;
      const compressedData = compress(data);
      let exportResultData: ExportResultData;

      switch (format) {
        case 'file':
          const filename = this.exportToFile(content, compressedData);
          exportResultData = { type: 'file', filename };
          break;
        case 'qrcode':
          if (this.isQRCodeSizeExceeded(compressedData)) {
            this.showQRCodeSizeExceededWarning();
            return;
          }
          exportResultData = { type: 'qrcode', data: compressedData.toString() };
          break;
        case 'string':
          const exportString = this.exportToString(compressedData);
          exportResultData = { type: 'string', data: exportString};
          break;
        default:
          console.error('Unsupported export format');
          return;
      }

      this.openResultDialog(exportResultData);
    } catch (error) {
      console.error('Error during export:', error);
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

  private exportToFile(content: string, data: any): string {
    const filename = `export_${content}.json`;
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
    return filename;
  }


  private exportToString(data: any): string {
    const base64String = btoa(data);
    return base64String;
  }

  private openResultDialog(data: ExportResultData) {
    this.dialog.open(ExportDialogComponent, {
      width: '400px',
      data: data
    });
  }
}


