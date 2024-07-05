import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule} from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

interface DialogData {
  mode: 'import' | 'export';
}

@Component({
  selector: 'app-export-choice',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatButtonToggleModule, FormsModule, ],
  templateUrl: './export-choice.component.html',
  styleUrl: './export-choice.component.css'
})
export class ExportChoiceComponent implements OnInit {
  @Input() mode: 'import' | 'export' = 'export';

  transferContent?: string;
  transferFormat?: string;
  title: string = '';
  actionButtonText: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExportChoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.mode = data.mode || 'export';
  }

  ngOnInit() {
    this.title = this.mode === 'export' ? 'Export' : 'Import';
    this.actionButtonText = this.mode === 'export' ? 'Export Now' : 'Import Now';
  }

  onAction() {
    if (this.transferContent && this.transferFormat) {
      this.dialogRef.close({
        mode: this.mode,
        content: this.transferContent,
        format: this.transferFormat
      });
    }
  }
}
