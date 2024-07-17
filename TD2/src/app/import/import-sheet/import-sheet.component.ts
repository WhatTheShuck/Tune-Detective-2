import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import QrScanner from 'qr-scanner';

@Component({
  selector: 'app-import-sheet',
  standalone: true,
  imports: [CommonModule,MatSelectModule, MatButtonModule, FormsModule],
  templateUrl: './import-sheet.component.html',
  styleUrl: './import-sheet.component.css'
})
export class ImportSheetComponent implements OnInit, OnDestroy {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private scanner: QrScanner | null = null;
  isScanning: boolean = false;
  cameras: QrScanner.Camera[] = [];
  selectedCamera: string | null = null;

  constructor(private bottomSheetRef: MatBottomSheetRef<ImportSheetComponent>) {}

  async ngOnInit() {
    this.cameras = await QrScanner.listCameras(true);
    if (this.cameras.length > 0) {
      this.selectedCamera = this.cameras[0].id;
    }
    await this.initializeScanner();
  }

  ngOnDestroy() {
    this.scanner?.destroy();
  }

  private async initializeScanner() {
    if (this.video) {
      this.scanner = new QrScanner(
        this.video.nativeElement,
        result => this.handleScanResult(result),
        { returnDetailedScanResult: true }
      );
      if (this.selectedCamera) {
        await this.scanner.setCamera(this.selectedCamera);
      }
    }
  }

  private handleScanResult(result: QrScanner.ScanResult) {
    this.bottomSheetRef.dismiss(result.data);
  }

  toggleScanner() {
    if (this.isScanning) {
      this.scanner?.stop();
    } else {
      this.scanner?.start();
    }
    this.isScanning = !this.isScanning;
  }

  async changeCamera() {
    if (this.scanner && this.selectedCamera) {
      await this.scanner.setCamera(this.selectedCamera);
    }
  }

  importImage() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      QrScanner.scanImage(file, { returnDetailedScanResult: true })
        .then(result => this.bottomSheetRef.dismiss(result.data))
        .catch(error => console.error('QR code scanning failed', error));
    }
  }

  closeScanner() {
    this.bottomSheetRef.dismiss();
  }
}
