import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-export-choice',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './export-choice.component.html',
  styleUrl: './export-choice.component.css'
})
export class ExportChoiceComponent {

}
