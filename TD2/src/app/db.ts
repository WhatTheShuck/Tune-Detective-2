import Dexie, { Table } from 'dexie';

export interface TrackedArtist {
  id?: number;
  artistID: number;
  artistName: string;
}

export class AppDB extends Dexie {
  trackedArtists!: Table<TrackedArtist, number>;

}
export const db = new AppDB();
