import Dexie, { Table } from 'dexie';

export interface TrackedArtist {
  id: number;
  name: string;
}

export class AppDatabase extends Dexie {
  trackedArtists!: Table<TrackedArtist, number>;

  constructor() {
    super('TuneDetective');
    this.version(1).stores({
      trackedArtists: '&id, name'
    });
  }
}

export const db = new AppDatabase();
