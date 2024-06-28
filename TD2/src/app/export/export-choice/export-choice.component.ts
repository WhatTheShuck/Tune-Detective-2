import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { FormsModule} from '@angular/forms';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-export-choice',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatButtonToggleModule, FormsModule, ],
  templateUrl: './export-choice.component.html',
  styleUrl: './export-choice.component.css'
})
export class ExportChoiceComponent {
  exportContent?: string;
  exportFormat?: string;

  constructor(public dialogRef: MatDialogRef<ExportChoiceComponent>) {}

  onExport() {
    if (this.exportContent && this.exportFormat) {
      this.dialogRef.close({content: this.exportContent, format: this.exportFormat });
    }
  }
}
