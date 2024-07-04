import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { QRCodeModule } from 'angularx-qrcode';
import { ClipboardModule } from '@angular/cdk/clipboard';

export interface ExportResultData {
  type: 'qrcode' | 'string' | 'file';
  data?: string;
  filename?: string;
}

@Component({
  selector: 'app-export-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, QRCodeModule, ClipboardModule],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
  qrCodeData: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExportResultData
  ) {}
 private exportToQRCode(compressedData: string) {
    this.qrCodeData = compressedData;
    // You'll need to update your template to display the QR code
  }

  close(): void {
    this.dialogRef.close();
  }

  retryDownload(): void {
    // Implement retry logic here
    console.log('Retrying download for:', this.data.filename);
  }
}
