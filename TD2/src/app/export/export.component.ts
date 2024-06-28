import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { db } from '../db';

@Component({
  selector: 'app-export',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './export.component.html',
  styleUrl: './export.component.css'
})
export class ExportComponent {
  readonly dialog = inject(MatDialog);

  openDialog() {
    const dialogRef = this.dialog.open(ExampleDialog);

    dialogRef.afterClosed().subscribe(result => {
      console.log('worky');
    });
  }

  async exportTrackedArtistsToFile() {
    const trackedArtists = await db.trackedArtists.toArray();
    const blob = new Blob([JSON.stringify(trackedArtists)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'tracked-artists.json';
    link.click();
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  template: `<mat-dialog-content class="mat-typography">
  <h3>What do you want to export?</h3>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button mat-dialog-close>Settings</button>
  <button mat-button mat-dialog-close>All</button>
  <button mat-button [mat-dialog-close]="true" cdkFocusInitial>Tracked Artists</button>
</mat-dialog-actions>
`,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  styleUrl: './export.component.css'
})
export class ExampleDialog {}
