import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
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
  imports: [MatDialogModule, MatButtonModule, QRCodeModule, ClipboardModule, MatInputModule, MatFormFieldModule],
  templateUrl: './export-dialog.component.html',
  styleUrl: './export-dialog.component.css'
})
export class ExportDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExportResultData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  retryDownload(): void {
    // Implement retry logic here
    console.log('Retrying download for:', this.data.filename);
  }
}
