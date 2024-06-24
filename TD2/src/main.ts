import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { db } from './app/db';

db.open().catch(err => {
  console.error('Failed to open database:', err);
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
