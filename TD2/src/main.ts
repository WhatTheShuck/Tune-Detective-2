import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { db } from './app/db';

db.open()
  .then(() => db.initializeDatabase())
  .then(() => {
    return bootstrapApplication(AppComponent, appConfig);
  })
  .catch(err => {
    console.error('Failed to open or initialize database, or bootstrap application:', err);
  });
